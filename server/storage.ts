import type { 
  User, InsertUser, PermacultureInfo, InsertPermacultureInfo, Course, Enrollment, InsertCourse, InsertEnrollment, 
  Contact, InsertContact, ChatRoom, InsertChatRoom, ChatMessage, InsertChatMessage, PrivateMessage, InsertPrivateMessage,
  CourseModule, InsertCourseModule, StudentProgress, InsertStudentProgress, Notification, InsertNotification
} from "@shared/schema";
import { 
  users, permacultureInfo, courses, enrollments, contacts, chatRooms, chatMessages, privateMessages,
  courseModules, studentProgress, notifications
} from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmailOrStudentId(identifier: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Permaculture info methods
  getAllPermacultureInfo(): Promise<PermacultureInfo[]>;
  getPermacultureInfoById(id: number): Promise<PermacultureInfo | undefined>;
  createPermacultureInfo(info: InsertPermacultureInfo): Promise<PermacultureInfo>;
  updatePermacultureInfo(id: number, info: Partial<InsertPermacultureInfo>): Promise<PermacultureInfo | undefined>;
  deletePermacultureInfo(id: number): Promise<boolean>;
  searchPermacultureInfo(query: string, category?: string): Promise<PermacultureInfo[]>;

  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, user: any): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getUserByStudentId(studentId: string): Promise<User | undefined>;

  // Course methods
  createCourse(course: InsertCourse): Promise<Course>;
  getCourseById(id: number): Promise<Course | undefined>;
  getPublicCourses(): Promise<Course[]>;
  getInstructorCourses(instructorId: number): Promise<Course[]>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Enrollment methods
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getStudentEnrollments(studentId: number): Promise<Enrollment[]>;
  isUserEnrolled(userId: number, courseId: number): Promise<boolean>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  updateContactStatus(id: number, status: string, reply?: string, repliedBy?: number): Promise<Contact>;
  
  // Chat room methods
  createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom>;
  getChatRoomById(id: number): Promise<ChatRoom | undefined>;
  getChatRoomsByCourse(courseId: number): Promise<ChatRoom[]>;
  getPublicChatRooms(): Promise<ChatRoom[]>;
  
  // Chat message methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByRoom(roomId: number, limit?: number): Promise<ChatMessage[]>;
  
  // Private message methods
  createPrivateMessage(message: InsertPrivateMessage): Promise<PrivateMessage>;
  getPrivateMessages(userId1: number, userId2: number): Promise<PrivateMessage[]>;
  markPrivateMessageAsRead(messageId: number): Promise<void>;
  
  // Course module methods
  createCourseModule(module: InsertCourseModule): Promise<CourseModule>;
  getCourseModulesByCourse(courseId: number): Promise<CourseModule[]>;
  getCourseModuleById(id: number): Promise<CourseModule | undefined>;
  updateCourseModule(id: number, module: Partial<CourseModule>): Promise<CourseModule>;
  deleteCourseModule(id: number): Promise<void>;
  
  // Student progress methods
  createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  getStudentProgress(studentId: number, courseId: number): Promise<StudentProgress[]>;
  updateStudentProgress(id: number, progress: Partial<StudentProgress>): Promise<StudentProgress>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(notificationId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmailOrStudentId(identifier: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      or(
        eq(users.email, identifier),
        eq(users.username, identifier),
        eq(users.studentId, identifier)
      )
    );
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Generate student ID
    const studentId = await this.generateStudentId();
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        studentId,
        role: "student", // Default role
      })
      .returning();
    return user;
  }

  private async generateStudentId(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const userCount = await db.select().from(users);
    const nextId = userCount.length + 1;
    return `RRF${year}${nextId.toString().padStart(4, '0')}`;
  }

  async getAllPermacultureInfo(): Promise<PermacultureInfo[]> {
    return await db.select().from(permacultureInfo).orderBy(permacultureInfo.dateAdded);
  }

  async getPermacultureInfoById(id: number): Promise<PermacultureInfo | undefined> {
    const [info] = await db.select().from(permacultureInfo).where(eq(permacultureInfo.id, id));
    return info || undefined;
  }

  async createPermacultureInfo(insertInfo: InsertPermacultureInfo): Promise<PermacultureInfo> {
    const [info] = await db
      .insert(permacultureInfo)
      .values(insertInfo)
      .returning();
    return info;
  }

  async updatePermacultureInfo(id: number, updateInfo: Partial<InsertPermacultureInfo>): Promise<PermacultureInfo | undefined> {
    const [updated] = await db
      .update(permacultureInfo)
      .set(updateInfo)
      .where(eq(permacultureInfo.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePermacultureInfo(id: number): Promise<boolean> {
    const result = await db
      .delete(permacultureInfo)
      .where(eq(permacultureInfo.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async searchPermacultureInfo(query: string, category?: string): Promise<PermacultureInfo[]> {
    let whereClause;
    
    if (query && category) {
      whereClause = and(
        or(
          ilike(permacultureInfo.title, `%${query}%`),
          ilike(permacultureInfo.description, `%${query}%`)
        ),
        eq(permacultureInfo.category, category)
      );
    } else if (query) {
      whereClause = or(
        ilike(permacultureInfo.title, `%${query}%`),
        ilike(permacultureInfo.description, `%${query}%`)
      );
    } else if (category) {
      whereClause = eq(permacultureInfo.category, category);
    }

    if (whereClause) {
      return await db.select().from(permacultureInfo).where(whereClause);
    }
    
    return await this.getAllPermacultureInfo();
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async updateUser(id: number, updateData: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db
      .delete(users)
      .where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.studentId, studentId));
    return user;
  }

  // Course methods
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getPublicCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPublic, true));
  }

  async getInstructorCourses(instructorId: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId));
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Enrollment methods
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getStudentEnrollments(studentId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
  }

  async isUserEnrolled(userId: number, courseId: number): Promise<boolean> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, userId),
          eq(enrollments.courseId, courseId)
        )
      );
    return !!enrollment;
  }

  // Contact methods
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async updateContactStatus(id: number, status: string, reply?: string, repliedBy?: number): Promise<Contact> {
    const updateData: any = { status };
    if (reply) updateData.reply = reply;
    if (repliedBy) updateData.repliedBy = repliedBy;
    if (status === 'replied') updateData.repliedAt = new Date();

    const [updatedContact] = await db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact;
  }

  // Chat room methods
  async createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom> {
    const [newChatRoom] = await db.insert(chatRooms).values(chatRoom).returning();
    return newChatRoom;
  }

  async getChatRoomById(id: number): Promise<ChatRoom | undefined> {
    const [chatRoom] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return chatRoom;
  }

  async getChatRoomsByCourse(courseId: number): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(and(eq(chatRooms.courseId, courseId), eq(chatRooms.isActive, true)));
  }

  async getPublicChatRooms(): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(and(eq(chatRooms.isPublic, true), eq(chatRooms.isActive, true)));
  }

  // Chat message methods
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getChatMessagesByRoom(roomId: number, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.roomId, roomId))
      .orderBy(chatMessages.createdAt)
      .limit(limit);
  }

  // Private message methods
  async createPrivateMessage(message: InsertPrivateMessage): Promise<PrivateMessage> {
    const [newMessage] = await db.insert(privateMessages).values(message).returning();
    return newMessage;
  }

  async getPrivateMessages(userId1: number, userId2: number): Promise<PrivateMessage[]> {
    return await db
      .select()
      .from(privateMessages)
      .where(
        or(
          and(eq(privateMessages.senderId, userId1), eq(privateMessages.receiverId, userId2)),
          and(eq(privateMessages.senderId, userId2), eq(privateMessages.receiverId, userId1))
        )
      )
      .orderBy(privateMessages.createdAt);
  }

  async markPrivateMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(privateMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(privateMessages.id, messageId));
  }

  // Course module methods
  async createCourseModule(module: InsertCourseModule): Promise<CourseModule> {
    const [newModule] = await db.insert(courseModules).values(module).returning();
    return newModule;
  }

  async getCourseModulesByCourse(courseId: number): Promise<CourseModule[]> {
    return await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);
  }

  async getCourseModuleById(id: number): Promise<CourseModule | undefined> {
    const [module] = await db.select().from(courseModules).where(eq(courseModules.id, id));
    return module;
  }

  async updateCourseModule(id: number, module: Partial<CourseModule>): Promise<CourseModule> {
    const [updatedModule] = await db
      .update(courseModules)
      .set(module)
      .where(eq(courseModules.id, id))
      .returning();
    return updatedModule;
  }

  async deleteCourseModule(id: number): Promise<void> {
    await db.delete(courseModules).where(eq(courseModules.id, id));
  }

  // Student progress methods
  async createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress> {
    const [newProgress] = await db.insert(studentProgress).values(progress).returning();
    return newProgress;
  }

  async getStudentProgress(studentId: number, courseId: number): Promise<StudentProgress[]> {
    return await db
      .select()
      .from(studentProgress)
      .where(and(eq(studentProgress.studentId, studentId), eq(studentProgress.courseId, courseId)));
  }

  async updateStudentProgress(id: number, progress: Partial<StudentProgress>): Promise<StudentProgress> {
    const [updatedProgress] = await db
      .update(studentProgress)
      .set(progress)
      .where(eq(studentProgress.id, id))
      .returning();
    return updatedProgress;
  }

  // Notification methods
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
  }
}

// Extended storage methods for admin functionality
DatabaseStorage.prototype.getAllCourses = async function(): Promise<Course[]> {
  return await db.select().from(courses).orderBy(desc(courses.createdAt));
};

DatabaseStorage.prototype.getAllEnrollments = async function(): Promise<Enrollment[]> {
  return await db.select().from(enrollments).orderBy(desc(enrollments.enrolledAt));
};

DatabaseStorage.prototype.updateUser = async function(id: number, updateData: any): Promise<User | undefined> {
  const [user] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning();
  return user || undefined;
};

DatabaseStorage.prototype.deleteUser = async function(id: number): Promise<boolean> {
  const result = await db
    .delete(users)
    .where(eq(users.id, id));
  return result.rowCount !== null && result.rowCount > 0;
};

export const storage = new DatabaseStorage();