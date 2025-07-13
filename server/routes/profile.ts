import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import bcrypt from "bcrypt";
import { z } from "zod";

const router = Router();

// Get current user profile
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update profile
router.patch("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated via this endpoint
    delete updateData.id;
    delete updateData.studentId;
    delete updateData.role;
    delete updateData.password;
    delete updateData.createdAt;
    delete updateData.isActive;
    delete updateData.isVerified;
    delete updateData.emailVerified;
    
    const user = await storage.updateUser(userId, updateData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Change password
router.patch("/password", isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    
    const userId = req.session.userId!;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await storage.updateUser(userId, { password: hashedPassword });
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update privacy settings
router.patch("/privacy", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const privacySettings = req.body;
    
    // Only allow privacy-related fields
    const allowedFields = [
      'profileVisibility',
      'showEmail',
      'showPhone', 
      'showLocation',
      'allowMessages'
    ];
    
    const filteredSettings = Object.keys(privacySettings)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = privacySettings[key];
        return obj;
      }, {} as any);
    
    const user = await storage.updateUser(userId, filteredSettings);
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