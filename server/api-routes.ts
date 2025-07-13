import { Router } from "express";
import { storage } from "./storage";
import { isAuthenticated, isAdmin } from "./middleware/auth";

const router = Router();

// Admin dashboard stats
router.get("/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    const courses = await storage.getAllCourses();
    const enrollments = await storage.getAllEnrollments();
    
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      totalCourses: courses.length,
      activeCourses: courses.filter(c => c.isApproved && c.isPublic).length,
      pendingCourses: courses.filter(c => !c.isApproved).length,
      totalEnrollments: enrollments.length,
      newUsersToday: users.filter(u => {
        const today = new Date();
        const userDate = new Date(u.createdAt);
        return userDate.toDateString() === today.toDateString();
      }).length,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users for admin management
router.get("/admin/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user status (activate/deactivate)
router.patch("/admin/users/:id/status", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await storage.updateUser(parseInt(id), { isActive });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user role
router.patch("/admin/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "instructor", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await storage.updateUser(parseInt(id), { role });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user
router.delete("/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteUser(parseInt(id));
    
    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all courses for admin review
router.get("/admin/courses", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve course
router.put("/admin/courses/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await storage.updateCourse(parseInt(id), { 
      isApproved: true,
      isPublic: true 
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Approve course error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reject course
router.put("/admin/courses/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await storage.updateCourse(parseInt(id), { 
      isApproved: false,
      isPublic: false 
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Reject course error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;