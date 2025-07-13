-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  subcounty TEXT NOT NULL,
  village TEXT NOT NULL,
  education_level TEXT NOT NULL,
  course_type TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  profile_image TEXT,
  bio TEXT,
  date_of_birth TIMESTAMP,
  gender TEXT,
  national_id TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  profile_visibility TEXT DEFAULT 'public',
  show_email BOOLEAN DEFAULT false,
  show_phone BOOLEAN DEFAULT false,
  show_location BOOLEAN DEFAULT true,
  allow_messages BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  learning_language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Create permaculture_info table
CREATE TABLE IF NOT EXISTS permaculture_info (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  date_added TIMESTAMP DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor_id SERIAL NOT NULL REFERENCES users(id),
  is_approved BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  min_pass_percentage INTEGER DEFAULT 70,
  total_modules INTEGER DEFAULT 0,
  estimated_duration INTEGER,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  prerequisites TEXT[],
  tags TEXT[]
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  course_id SERIAL NOT NULL REFERENCES courses(id),
  student_id SERIAL NOT NULL REFERENCES users(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  replied_at TIMESTAMP,
  replied_by INTEGER REFERENCES users(id),
  reply TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  course_id INTEGER REFERENCES courses(id),
  created_by INTEGER NOT NULL REFERENCES users(id),
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id),
  sender_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  file_url TEXT,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create private_messages table
CREATE TABLE IF NOT EXISTS private_messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_receiver BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  video_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create student_progress table  
CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  module_id INTEGER NOT NULL REFERENCES course_modules(id),
  is_completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP,
  time_spent INTEGER DEFAULT 0,
  score INTEGER,
  last_accessed TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add remaining tables from schema
CREATE TABLE IF NOT EXISTS forum_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_topics (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES forum_categories(id),
  created_by INTEGER NOT NULL REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES forum_topics(id),
  author_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  module_id INTEGER REFERENCES course_modules(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  due_date TIMESTAMP,
  max_points INTEGER DEFAULT 100,
  submission_type TEXT NOT NULL DEFAULT 'text',
  allowed_file_types TEXT[],
  max_file_size INTEGER DEFAULT 10485760,
  is_published BOOLEAN DEFAULT false,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  graded_by INTEGER REFERENCES users(id),
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  graded_at TIMESTAMP,
  points_earned INTEGER,
  feedback TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  is_late BOOLEAN DEFAULT false,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  verification_code TEXT NOT NULL,
  final_score INTEGER,
  is_valid BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS learning_analytics (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  session_date TIMESTAMP DEFAULT NOW(),
  time_spent INTEGER,
  pages_viewed INTEGER DEFAULT 0,
  videos_watched INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  forum_posts INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW()
);

-- Insert sample users
INSERT INTO users (username, first_name, last_name, email, password, phone, location, district, subcounty, village, education_level, role, student_id, course_type, is_active, is_verified, email_verified, learning_language, timezone) 
VALUES 
  ('admin', 'Admin', 'User', 'admin@rrfuganda.org', '$2b$10$8qgXOLl9iHXzq0w5gFxGseqaE5VPqfhY2y/jK9qgEWGCOj.w6YG5u', '+256700000001', 'Kampala', 'Kampala', 'Central', 'City Center', 'University', 'admin', 'RRF240001', 'all', true, true, true, 'en', 'UTC'),
  ('instructor', 'John', 'Instructor', 'instructor@rrfuganda.org', '$2b$10$8qgXOLl9iHXzq0w5gFxGseqaE5VPqfhY2y/jK9qgEWGCOj.w6YG5u', '+256700000002', 'Mbarara', 'Mbarara', 'Central', 'University', 'University', 'instructor', 'RRF240002', 'permaculture', true, true, true, 'en', 'UTC'),
  ('student', 'Mary', 'Student', 'student@rrfuganda.org', '$2b$10$8qgXOLl9iHXzq0w5gFxGseqaE5VPqfhY2y/jK9qgEWGCOj.w6YG5u', '+256700000003', 'Nkoma', 'Kamwenge', 'Katalyeba', 'Nkoma', 'Secondary', 'student', 'RRF240003', 'beginner', true, true, true, 'en', 'UTC')
ON CONFLICT (username) DO NOTHING;

-- Insert sample permaculture info
INSERT INTO permaculture_info (title, description, category, location) VALUES
  ('Water Harvesting Techniques', 'Learn how to collect and store rainwater for sustainable farming', 'Water Management', 'Kampala'),
  ('Composting Methods', 'Various techniques for creating nutrient-rich compost from organic waste', 'Soil Health', 'Mbarara'),
  ('Food Forest Design', 'Creating sustainable food systems that mimic natural forest ecosystems', 'Agroforestry', 'Jinja')
ON CONFLICT DO NOTHING;