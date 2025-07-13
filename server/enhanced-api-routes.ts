import { Express } from 'express';
import { storage } from './storage';
import { isAuthenticated } from './replitAuth';

export function setupEnhancedApiRoutes(app: Express) {
  // Enhanced Admin API routes for course creation and auto-marking
  app.post("/api/admin/courses", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const courseData = req.body;
      
      // Create course with admin privileges (auto-approved)
      const course = await storage.createCourse({
        ...courseData,
        instructorId: req.user.id,
        isApproved: true,
        isPublic: true
      });

      res.json({ 
        ...course, 
        message: "Course created successfully with auto-marking system enabled" 
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users for admin dashboard
  app.get("/api/admin/users", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all courses for admin dashboard
  app.get("/api/admin/courses", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const courses = await storage.getPublicCourses();
      res.json(courses);
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user status (activate/deactivate)
  app.patch("/api/admin/users/:id/status", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      const user = await storage.updateUser(parseInt(id), { isActive });
      res.json(user);
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user role
  app.patch("/api/admin/users/:id/role", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      const user = await storage.updateUser(parseInt(id), { role });
      res.json(user);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:id", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const { id } = req.params;
      await storage.deleteUser(parseInt(id));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get admin stats
  app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const users = await storage.getAllUsers();
      const courses = await storage.getPublicCourses();
      
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        totalCourses: courses.length,
        totalEnrollments: 0 // Can be calculated from enrollments table
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auto-marking system endpoint
  app.post("/api/courses/:courseId/submit-assessment", isAuthenticated, async (req, res) => {
    try {
      const { courseId } = req.params;
      const { moduleId, answers, questions } = req.body;
      
      if (!answers || !questions) {
        return res.status(400).json({ message: "Missing answers or questions" });
      }

      let totalPoints = 0;
      let earnedPoints = 0;
      const results = [];

      // Auto-mark each answer
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = answers[i];
        totalPoints += question.points || 1;

        let isCorrect = false;
        
        if (question.type === "multiple-choice") {
          // For multiple choice, compare against correct answer
          isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
        } else if (question.type === "true-false") {
          // For true/false, compare against correct answer
          isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
        } else if (question.type === "short-answer") {
          // For short answers, do keyword matching
          if (userAnswer && question.correctAnswer) {
            const correctWords = question.correctAnswer.toLowerCase().split(' ').filter(word => word.length > 2);
            const userWords = userAnswer.toLowerCase().split(' ');
            const matchCount = correctWords.filter(word => userWords.some(userWord => userWord.includes(word))).length;
            isCorrect = matchCount >= Math.ceil(correctWords.length * 0.6); // 60% keyword match
          }
        }

        if (isCorrect) {
          earnedPoints += question.points || 1;
        }

        results.push({
          questionIndex: i,
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          points: isCorrect ? (question.points || 1) : 0
        });
      }

      const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passed = score >= 70; // 70% passing grade

      // Update student progress
      try {
        await storage.createStudentProgress({
          studentId: req.user.id,
          courseId: parseInt(courseId),
          moduleId: parseInt(moduleId),
          status: passed ? 'completed' : 'in_progress',
          progressPercentage: passed ? 100 : score,
          lastAccessedAt: new Date(),
          completedAt: passed ? new Date() : null
        });
      } catch (progressError) {
        console.error('Progress update error:', progressError);
        // Continue even if progress update fails
      }

      res.json({
        score,
        passed,
        totalPoints,
        earnedPoints,
        results,
        feedback: passed 
          ? "🎉 Congratulations! You have passed this assessment with auto-marking system verification." 
          : `You scored ${score}%. You need 70% to pass. Please review the material and try again. The auto-marking system has identified areas for improvement.`
      });
    } catch (error) {
      console.error('Auto-marking error:', error);
      res.status(500).json({ message: "Auto-marking system error. Please try again." });
    }
  });
}