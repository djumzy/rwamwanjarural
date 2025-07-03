import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const testUsers = [
  {
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@rrfuganda.org',
    password: 'admin123',
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
    password: 'instructor123',
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
    password: 'student123',
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

export async function createTestUsers() {
  console.log('Creating test users...');
  
  try {
    for (const userData of testUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Generate student ID
      const year = new Date().getFullYear().toString().slice(-2);
      const userCount = await db.select().from(users);
      const nextId = userCount.length + 1;
      const studentId = `RRF${year}${nextId.toString().padStart(4, '0')}`;
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, userData.email));
      
      if (existingUser.length === 0) {
        await db.insert(users).values({
          ...userData,
          password: hashedPassword,
          studentId,
        });
        
        console.log(`✓ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
      } else {
        console.log(`- User already exists: ${userData.email}`);
      }
    }
    
    console.log('\nTest users creation completed!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@rrfuganda.org / admin123');
    console.log('Instructor: instructor@rrfuganda.org / instructor123');
    console.log('Student: student@rrfuganda.org / student123');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUsers().then(() => process.exit(0));
}