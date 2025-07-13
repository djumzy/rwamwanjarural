# RRF Learning Platform

## Overview

RRF Learning is now a **complete online school** designed specifically for refugee and rural communities to learn permaculture and sustainable practices. The platform has been transformed into a full-featured learning management system with modern UI/UX, comprehensive user profiles, advanced administrative controls, and professional online education capabilities.

**Key Features:**
- Full online school functionality with courses, assignments, certificates, and transcripts
- Modern student dashboard with progress tracking, achievements, and community interaction
- Comprehensive admin dashboard with complete system control and user management
- Advanced user profiles with privacy controls and personal information management
- Professional slideshow hero section showcasing real permaculture work
- Discussion forums and community features for collaborative learning
- Assignment submission and grading system with feedback
- Certificate generation with verification codes
- Learning analytics and progress tracking
- Real-time notifications and messaging system
- Responsive modern design optimized for all devices

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom RRF branding colors
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Authentication**: Session-based authentication with Express sessions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Session Management**: Express sessions with PostgreSQL store
- **Password Security**: bcrypt for password hashing
- **File Structure**: Monorepo structure with shared types and schemas

### Database Architecture
- **Database**: PostgreSQL (Render hosted - dpg-d1hbbcfgi27c73chd5s0-a.oregon-postgres.render.com)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Type-safe schema definitions in shared folder
- **Connection**: postgres-js with SSL required for cloud database
- **Tables**: 18 tables including users, courses, enrollments, forums, assignments, certificates, analytics

## Key Components

### User Management System
- **Multi-role Architecture**: Admin, Instructor, and Student roles
- **Registration System**: Comprehensive user profiles with location data
- **Authentication Middleware**: Role-based access control
- **User Profiles**: Detailed information including education level and geographic data

### Course Management
- **Course Creation**: Instructors can create structured courses
- **Content Types**: Support for text, images, videos, and documents
- **Assessment System**: Chapter-based assessments with scoring
- **Progress Tracking**: Student progress monitoring and analytics
- **Approval Workflow**: Admin approval system for course publication

### Permaculture Content System
- **Information Database**: Structured permaculture knowledge base
- **Search Functionality**: Category and text-based search
- **Content Management**: CRUD operations for permaculture information
- **Tagging System**: Organized content categorization

### File Upload System
- **Multi-format Support**: PDF, DOC, images, audio, and video files
- **Progress Tracking**: Real-time upload progress indication
- **File Management**: Course-specific file organization
- **Size Limitations**: Configurable file size limits (50MB default)

## Data Flow

### Authentication Flow
1. User registration with comprehensive profile data
2. Password hashing with bcrypt
3. Session creation and storage in PostgreSQL
4. Role-based route protection and UI rendering

### Course Learning Flow
1. Student browses published courses
2. Enrollment process with progress tracking initialization
3. Chapter-by-chapter learning progression
4. Assessment completion and scoring
5. Progress updates and completion tracking

### Content Management Flow
1. Instructors create courses with structured chapters
2. File uploads and content organization
3. Admin review and approval process
4. Course publication and student accessibility

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database (Render/Neon hosting)
- **Connection Pooling**: Neon serverless PostgreSQL with connection pooling

### File Storage
- **Local Storage**: Server-side file storage in public directory
- **Upload Processing**: Express middleware for multipart form handling

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon system
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **ESBuild**: Production build bundling for server
- **TypeScript**: Type safety across full stack
- **Drizzle Kit**: Database migration and introspection tools

## Deployment Strategy

### Replit Deployment
- **Environment**: Node.js 20 runtime with PostgreSQL 16
- **Build Process**: Vite client build + ESBuild server bundle
- **Port Configuration**: Server runs on port 5000, external port 80
- **Development Mode**: Hot reload with Vite middleware integration

### Production Configuration
- **Environment Variables**: Database URL and session secrets
- **Static Files**: Client build served from dist/public
- **Database SSL**: SSL-required connections for cloud PostgreSQL
- **Session Security**: HTTP-only cookies with secure flags in production

### Database Setup
- **Migration Strategy**: Drizzle migrations with table creation scripts
- **Seed Data**: Initial permaculture content and admin user setup
- **Backup Strategy**: Cloud provider automated backups

## Recent Changes

```
Recent Changes:
- July 13, 2025: COMPLETED DATA COLLECTION SYSTEM FOR VOLUNTEER, PARTNERSHIP, AND NEWSLETTER APPLICATIONS
- Added comprehensive database tables for volunteerApplications, partnershipApplications, and newsletterSubscriptions
- Created API endpoints (/api/volunteer-applications, /api/partnership-applications, /api/newsletter-subscribe) 
- Updated volunteer and partnership forms to save data via API instead of simulation
- Built newsletter subscription component with email validation and success feedback
- All three forms now properly submit data and provide user feedback with toast notifications
- API endpoints confirmed working and logging received data correctly
- July 13, 2025: FIXED CREATE COURSE BUTTON FUNCTIONALITY - FULLY OPERATIONAL
- Enhanced form submission handler with proper data transformation and error handling
- Added comprehensive logging for debugging form submission and API requests
- Fixed mutation function to properly handle async operations and API responses
- Course creation now works correctly with form validation and success notifications
- API endpoints confirmed working (POST /api/admin/courses returning 200 status)
- Auto-marking system integration confirmed functional with course creation
- July 12, 2025: ENHANCED ADMIN DASHBOARD WITH COMPREHENSIVE MANAGEMENT FEATURES COMPLETED
- Created EnhancedUserManagement component with full CRUD operations for users
- Built AddCourseForm component with sophisticated course creation and auto-marking system
- Implemented AdvancedAnalytics dashboard with comprehensive platform metrics and performance tracking
- Developed EnhancedSettings panel with security controls, email configuration, and system management
- Integrated RRF logo consistency across all admin dashboard components
- Added API routes for course creation, user management, and auto-marking assessments
- Enhanced admin can now add, edit, delete users with role management and status controls
- Auto-marking system supports multiple question types (multiple-choice, true-false, short-answer)
- Advanced analytics show user distribution, course statistics, and system performance metrics
- Comprehensive settings include security controls, email configuration, backup management
- All enhanced components fully functional with proper authentication and error handling
- June 30, 2025: DATABASE INTEGRATION AND GITHUB PREPARATION COMPLETED
- Successfully connected to PostgreSQL database with all 18 tables created
- Fixed authentication system - login and registration fully functional
- Test users working: admin@rrfuganda.org, instructor@rrfuganda.org, student@rrfuganda.org (all password: password123)
- Created comprehensive README.md and .gitignore for GitHub deployment
- Cleaned up temporary files and prepared production-ready codebase
- All TypeScript errors resolved and application ready for deployment
- June 30, 2025: MAJOR PLATFORM TRANSFORMATION TO COMPLETE ONLINE SCHOOL
- Enhanced database schema with comprehensive user profiles, privacy settings, and advanced features
- Added profile images, bio, emergency contacts, learning preferences, and privacy controls
- Implemented assignments, submissions, discussion forums, certificates, and learning analytics
- Created modern student dashboard with course progress, achievements, and community features
- Built comprehensive admin dashboard with full system control and user management
- Added user profile page with tabbed interface for personal info, privacy, achievements
- Enhanced slideshow hero section with real permaculture photos from user's work
- Integrated advanced course management with modules, assessments, and progress tracking
- Added forum system with categories, topics, posts, and community interaction
- Implemented certificate generation with verification codes and expiration dates
- Created learning analytics for tracking student engagement and performance
- Added notification system for real-time updates and communication
- Enhanced privacy controls allowing users to control profile visibility and data sharing
- Built study schedule and deadline management system
- Added achievement and badge system to gamify learning experience
- Integrated system health monitoring and administrative controls
- Created responsive modern UI with professional design and smooth user experience
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```