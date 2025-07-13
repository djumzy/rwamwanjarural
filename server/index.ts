import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import cors from "cors";
import { storage } from "./storage";
import authRoutes from "./routes/auth";
import { isAuthenticated } from "./middleware/auth";
import courseRoutes from "./routes/courses";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { db } from './db';
import * as schema from "@shared/schema";
import { User, users } from "@shared/schema";
import 'dotenv/config';

// Test user creation function
async function createTestUsers() {
  const testUsers = [
    {
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@rrfuganda.org',
      password: 'password123',
      phone: '+256700000001',
      location: 'Kampala',
      district: 'Kampala',
      subcounty: 'Central',
      village: 'City Center',
      educationLevel: 'University',
      role: 'admin'
    },
    {
      username: 'instructor',
      firstName: 'John',
      lastName: 'Instructor',
      email: 'instructor@rrfuganda.org',
      password: 'password123',
      phone: '+256700000002',
      location: 'Mbarara',
      district: 'Mbarara',
      subcounty: 'Central',
      village: 'University',
      educationLevel: 'University',
      role: 'instructor'
    },
    {
      username: 'student',
      firstName: 'Mary',
      lastName: 'Student',
      email: 'student@rrfuganda.org',
      password: 'password123',
      phone: '+256700000003',
      location: 'Nkoma',
      district: 'Kamwenge',
      subcounty: 'Katalyeba',
      village: 'Nkoma',
      educationLevel: 'Secondary',
      role: 'student'
    }
  ];

  try {
    for (const userData of testUsers) {
      const existingUser = await storage.getUserByEmail(userData.email);
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const year = new Date().getFullYear().toString().slice(-2);
        const userCount = await db.query.users.findMany();
        const nextId = userCount.length + 1;
        const studentId = `RRF${year}${nextId.toString().padStart(4, '0')}`;
        
        await db.insert(users).values({
          ...userData,
          password: hashedPassword,
          studentId,
          courseType: userData.role === 'admin' ? 'all' : userData.role === 'instructor' ? 'permaculture' : 'beginner',
          isActive: true,
          isVerified: true,
          emailVerified: true,
          learningLanguage: 'english',
          timezone: 'Africa/Kampala'
        });
        
        console.log(`✓ Created test ${userData.role}: ${userData.email}`);
      }
    }
    console.log('\nTest user credentials:');
    console.log('Admin: admin@rrfuganda.org / admin123');
    console.log('Instructor: instructor@rrfuganda.org / instructor123');
    console.log('Student: student@rrfuganda.org / student123');
  } catch (error: any) {
    console.log('Test users may already exist or creation failed:', error.message);
  }
}

declare global {
  namespace Express {
    interface User extends schema.User {}
    interface Request {
      user?: User;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000", "http://127.0.0.1:5000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Disable secure for development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // Allow cross-site cookies for development
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication middleware
app.use(async (req, res, next) => {
  if (req.session.userId) {
    const user = await storage.getUserById(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
  { usernameField: 'identifier', passwordField: 'password' },
  async (identifier, password, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq, or }) => or(
          eq(users.username, identifier),
          eq(users.email, identifier),
          eq(users.studentId, identifier)
        ),
      });
      if (!user) {
        return done(null, false, { message: 'Incorrect username, email, or student ID.' });
      }
      if (!user.password) {
        return done(null, false, { message: 'Invalid user data.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user as User);
    } catch (err) {
      console.error('Passport authentication error:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
    done(null, user as User || null);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Create test users if they don't exist
  await createTestUsers();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // IMPORTANT: Define API routes BEFORE static file serving
  app.use("/api/auth", authRoutes);
  app.use("/api/courses", courseRoutes);

  // Protected route example
  app.get("/api/protected", isAuthenticated, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  });

  // Register and Login routes
  app.post('/api/register', async (req, res) => {
    const { username, firstName, lastName, email, password, phone, location, district, subcounty, village, educationLevel, courseType } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData: schema.InsertUser = {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        location,
        district,
        subcounty,
        village,
        educationLevel,
        courseType,
        learningLanguage: 'english',
        timezone: 'Africa/Kampala',
      };
      await db.insert(schema.users).values(userData);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: 'Authentication failed.' });
    }
  });

  app.get('/api/dashboard', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ message: "This is a protected route", user: req.user });
  });

  // Importantly, only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
