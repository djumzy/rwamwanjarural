import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

export async function setupDatabase() {
  console.log('Setting up database with sample users...');
  
  try {
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Sample users to create
    const sampleUsers = [
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@rrfuganda.org',
        password: hashedPassword,
        phone: '+256700000001',
        location: 'Kampala',
        district: 'Kampala',
        subcounty: 'Central',
        village: 'City Center',
        educationLevel: 'University',
        role: 'admin',
        courseType: 'all',
        isActive: true,
        isVerified: true,
        emailVerified: true
      },
      {
        username: 'instructor',
        firstName: 'John',
        lastName: 'Instructor',
        email: 'instructor@rrfuganda.org',
        password: hashedPassword,
        phone: '+256700000002',
        location: 'Mbarara',
        district: 'Mbarara',
        subcounty: 'Central',
        village: 'University',
        educationLevel: 'University',
        role: 'instructor',
        courseType: 'permaculture',
        isActive: true,
        isVerified: true,
        emailVerified: true
      },
      {
        username: 'student',
        firstName: 'Mary',
        lastName: 'Student',
        email: 'student@rrfuganda.org',
        password: hashedPassword,
        phone: '+256700000003',
        location: 'Nkoma',
        district: 'Kamwenge',
        subcounty: 'Katalyeba',
        village: 'Nkoma',
        educationLevel: 'Secondary',
        role: 'student',
        courseType: 'beginner',
        isActive: true,
        isVerified: true,
        emailVerified: true
      }
    ];

    // Insert users if they don't exist
    for (const userData of sampleUsers) {
      try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.username, userData.username)).limit(1);
        
        if (existingUser.length === 0) {
          await db.insert(users).values(userData);
          console.log(`✓ Created user: ${userData.username} (${userData.role})`);
        } else {
          console.log(`- User ${userData.username} already exists, skipping`);
        }
      } catch (error) {
        console.error(`Failed to create user ${userData.username}:`, error);
      }
    }
    
    console.log('Database setup completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: username=admin, password=password123');
    console.log('Instructor: username=instructor, password=password123');
    console.log('Student: username=student, password=password123');
    
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}