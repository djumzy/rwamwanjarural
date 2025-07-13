import { Router } from "express";
import { storage } from "../storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";

const router = Router();

// Create new contact submission
router.post("/", async (req, res) => {
  try {
    const validatedData = insertContactSchema.parse(req.body);
    const contact = await storage.createContact(validatedData);
    res.status(201).json({ message: "Contact form submitted successfully", contact });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all contacts (admin only)
router.get("/", async (req, res) => {
  try {
    const contacts = await storage.getAllContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;