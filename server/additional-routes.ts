import { Express } from "express";
import { z } from "zod";
import { storage } from "./storage.js";
import { insertCourseSchema } from "../shared/schema.js";

export function addAdditionalRoutes(app: Express) {
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Course management endpoints
  app.post("/api/courses", requireAuth, async (req: any, res) => {
    try {
      const validatedData = insertCourseSchema.parse({
        ...req.body,
        instructorId: req.session.userId
      });
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", requireAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.updateCourse(courseId, req.body);
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", requireAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      await storage.deleteCourse(courseId);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Enrollment management
  app.post("/api/courses/:id/enroll", requireAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const enrollment = await storage.createEnrollment({
        studentId: req.session.userId,
        courseId: courseId,
        enrolledAt: new Date()
      });
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/courses/:id/enrolled", requireAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const isEnrolled = await storage.isUserEnrolled(req.session.userId, courseId);
      res.json({ isEnrolled });
    } catch (error) {
      res.status(500).json({ message: "Failed to check enrollment status" });
    }
  });

  // User management endpoints
  app.put("/api/users/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.updateUser(userId, req.body);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.get("/api/users/:id", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course approval endpoints (admin only)
  app.put("/api/admin/courses/:id/approve", requireAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.updateCourse(courseId, { 
        isApproved: true, 
        isPublic: true 
      });
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve course" });
    }
  });

  app.put("/api/admin/courses/:id/reject", requireAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.updateCourse(courseId, { 
        isApproved: false, 
        isPublic: false 
      });
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject course" });
    }
  });

  // Get all courses for admin
  app.get("/api/admin/courses", requireAuth, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      const instructors = users.filter(u => u.role === 'instructor');
      let allCourses = [];
      
      for (const instructor of instructors) {
        const courses = await storage.getInstructorCourses(instructor.id);
        allCourses.push(...courses);
      }
      
      res.json(allCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Profile management
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.updateUser(req.session.userId, req.body);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
}