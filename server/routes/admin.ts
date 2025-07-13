import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated, isAdmin } from "../middleware/auth";
import { ZodError, z } from "zod";

const router = Router();

// Get admin dashboard stats
router.get("/stats", isAuthenticated, isAdmin, async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users for admin management
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user status (activate/deactivate)
router.patch("/users/:id/status", isAuthenticated, isAdmin, async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user role
router.patch("/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user
router.delete("/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteUser(parseInt(id));
    
    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all courses for admin review
router.get("/courses", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve course
router.put("/courses/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reject course
router.put("/courses/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile (admin can edit any user)
router.patch("/users/:id/profile", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await storage.updateUser(parseInt(id), updateData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;