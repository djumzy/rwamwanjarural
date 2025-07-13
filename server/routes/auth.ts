import { Router } from "express";
import { storage } from "../storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { isAuthenticated, isAdmin } from "../middleware/auth";
import { ZodError } from "zod";

const router = Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user
    const user = await storage.createUser({
      ...validatedData,
      password: hashedPassword,
    });

    // Set session
    req.session.userId = user.id;

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt with:", req.body);
    const { identifier, password } = loginSchema.parse(req.body);
    
    console.log("Looking for user with identifier:", identifier);
    // Find user by email, username, or student ID
    const user = await storage.getUserByEmailOrStudentId(identifier);
    if (!user) {
      console.log("User not found for identifier:", identifier);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.email, "role:", user.role);
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", user.email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password valid for user:", user.email);

    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    
    // Save session explicitly
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("Session set for user:", user.id, "role:", user.role);

    // Remove password from response
    const { password: _, ...userResponse } = user;
    res.json({ 
      success: true,
      message: "Login successful", 
      user: userResponse 
    });
  } catch (error) {
    console.log("Login error:", error);
    if (error instanceof ZodError) {
      console.log("Zod validation error:", error.errors);
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    console.log("Internal server error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get current user
router.get("/user", isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Admin only: Get all users
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin only: Update user role
router.patch("/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "instructor", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await storage.updateUser(parseInt(id), { role });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; 