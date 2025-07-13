import { pgTable, text, serial, timestamp, varchar, boolean, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 20 }).unique(),
  username: text("username").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  district: text("district").notNull(),
  subcounty: text("subcounty").notNull(),
  village: text("village").notNull(),
  educationLevel: text("education_level").notNull(),
  courseType: text("course_type"),
  role: text("role").notNull().default("student"), // 'student', 'instructor', 'admin'
  
  // Enhanced profile fields
  profileImage: text("profile_image"),
  bio: text("bio"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  nationalId: text("national_id"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  
  // Privacy settings
  profileVisibility: text("profile_visibility").default("public"), // public, private, contacts
  showEmail: boolean("show_email").default(false),
  showPhone: boolean("show_phone").default(false),
  showLocation: boolean("show_location").default(true),
  allowMessages: boolean("allow_messages").default(true),
  
  // Account status
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  emailVerified: boolean("email_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  
  // Learning preferences
  learningLanguage: text("learning_language").default("english"),
  timezone: text("timezone").default("Africa/Kampala"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const permacultureInfo = pgTable("permaculture_info", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array(),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorId: integer("instructor_id").notNull().references(() => users.id),
  isApproved: boolean("is_approved").default(false),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  minPassPercentage: integer("min_pass_percentage").default(70),
  totalModules: integer("total_modules").default(0),
  estimatedDuration: integer("estimated_duration"), // in minutes
  category: text("category").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  prerequisites: text("prerequisites").array(),
  tags: text("tags").array(),
  objectives: text("objectives").array(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  courseId: serial("course_id").notNull().references(() => courses.id),
  studentId: serial("student_id").notNull().references(() => users.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").notNull().default("active"), // active, completed, dropped
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread, read, replied
  repliedAt: timestamp("replied_at"),
  repliedBy: integer("replied_by").references(() => users.id),
  reply: text("reply"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat rooms for trainee communication
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id),
  createdBy: integer("created_by").notNull().references(() => users.id),
  isPublic: boolean("is_public").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => chatRooms.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, file, image
  fileUrl: text("file_url"),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Private messages between users
export const privateMessages = pgTable("private_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"),
  fileUrl: text("file_url"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course modules/chapters
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull(),
  duration: integer("duration"), // in minutes
  videoUrl: text("video_url"),
  attachments: json("attachments").$type<string[]>().default([]),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student progress tracking
export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  moduleId: integer("module_id").notNull().references(() => courseModules.id),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  score: integer("score"), // percentage
  timeSpent: integer("time_spent"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments and assessments
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  moduleId: integer("module_id").references(() => courseModules.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions"),
  maxScore: integer("max_score").default(100),
  passingScore: integer("passing_score").default(70),
  timeLimit: integer("time_limit"), // in minutes
  attemptLimit: integer("attempt_limit").default(3),
  dueDate: timestamp("due_date"),
  isPublished: boolean("is_published").default(false),
  allowLateSubmission: boolean("allow_late_submission").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignment submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  content: text("content"),
  fileUrls: json("file_urls").$type<string[]>().default([]),
  score: integer("score"),
  feedback: text("feedback"),
  status: text("status").default("pending"), // pending, graded, returned
  attemptNumber: integer("attempt_number").default(1),
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
  gradedBy: integer("graded_by").references(() => users.id),
});

// Discussion forums
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  courseId: integer("course_id").references(() => courses.id),
  isPublic: boolean("is_public").default(true),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => forumCategories.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  views: integer("views").default(0),
  repliesCount: integer("replies_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyBy: integer("last_reply_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => forumTopics.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  certificateNumber: text("certificate_number").notNull().unique(),
  issuedAt: timestamp("issued_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  verificationCode: text("verification_code").notNull(),
  finalScore: integer("final_score"),
  isValid: boolean("is_valid").default(true),
});

// Learning analytics
export const learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  sessionDate: timestamp("session_date").defaultNow(),
  timeSpent: integer("time_spent"), // in minutes
  pagesViewed: integer("pages_viewed").default(0),
  videosWatched: integer("videos_watched").default(0),
  assignmentsCompleted: integer("assignments_completed").default(0),
  forumPosts: integer("forum_posts").default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  studentId: true,
  createdAt: true,
  updatedAt: true,
  role: true,
  profileImage: true,
  isActive: true,
  isVerified: true,
  emailVerified: true,
  lastLoginAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  district: z.string().min(1, "District is required"),
  subcounty: z.string().min(1, "Subcounty is required"),
  village: z.string().min(1, "Village is required"),
  educationLevel: z.enum(["primary", "secondary", "diploma", "bachelors", "masters", "phd", "other"], {
    required_error: "Please select your education level",
  }),
  courseType: z.enum(["online", "physical"]).optional(),
  bio: z.string().max(500).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  nationalId: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  learningLanguage: z.enum(["english", "swahili", "luganda", "french"]).default("english"),
  timezone: z.string().default("Africa/Kampala"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Student ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertPermacultureInfoSchema = createInsertSchema(permacultureInfo).omit({
  id: true,
  dateAdded: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isApproved: true,
  isPublic: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Additional Zod schemas for new tables
export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  isEdited: true,
  editedAt: true,
});

export const insertPrivateMessageSchema = createInsertSchema(privateMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
  readAt: true,
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type InsertPermacultureInfo = z.infer<typeof insertPermacultureInfoSchema>;
export type PermacultureInfo = typeof permacultureInfo.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// New types for enhanced tables
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type PrivateMessage = typeof privateMessages.$inferSelect;
export type InsertPrivateMessage = z.infer<typeof insertPrivateMessageSchema>;
export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
// Volunteer Applications Table
export const volunteerApplications = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  skills: text("skills").notNull(),
  availability: text("availability").notNull(),
  motivation: text("motivation").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Partnership Applications Table  
export const partnershipApplications = pgTable("partnership_applications", {
  id: serial("id").primaryKey(),
  applicantType: text("applicant_type").notNull(),
  organizationName: text("organization_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  location: text("location").notNull(),
  mission: text("mission").notNull(),
  vision: text("vision").notNull(),
  objectives: text("objectives").notNull(),
  focusAreas: text("focus_areas").notNull(),
  servicesOffered: text("services_offered").notNull(),
  servicesSought: text("services_sought").notNull(),
  partnershipReason: text("partnership_reason").notNull(),
  partnershipAreas: text("partnership_areas").array(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter Subscriptions Table
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  interests: text("interests").array(),
  isActive: boolean("is_active").default(true),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  source: text("source").default("website"), // website, social, referral
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).omit({
  id: true,
  createdAt: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  notes: true,
});

export const insertPartnershipApplicationSchema = createInsertSchema(partnershipApplications).omit({
  id: true,
  createdAt: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  notes: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
  unsubscribedAt: true,
});

// Types for new tables
export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;
export type PartnershipApplication = typeof partnershipApplications.$inferSelect;
export type InsertPartnershipApplication = z.infer<typeof insertPartnershipApplicationSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
