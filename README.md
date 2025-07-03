# RRF Learning Platform

A comprehensive online learning management system for permaculture education, specifically designed for refugee and rural communities.

## Features

### 🎓 Complete Learning Management System
- **Multi-role Authentication**: Admin, Instructor, and Student roles
- **Course Management**: Create, manage, and deliver structured permaculture courses
- **Progress Tracking**: Detailed student progress monitoring and analytics
- **Assignments & Assessments**: Chapter-based assessments with scoring
- **Certificate Generation**: Digital certificates with verification codes

### 🌱 Permaculture Education Focus
- **14 Structured Chapters**: Comprehensive permaculture curriculum
- **Community Learning**: Discussion forums and peer interaction
- **Practical Applications**: Real-world permaculture techniques
- **Cultural Adaptation**: Multi-language support and local context

### 💬 Community Features
- **Discussion Forums**: Course-specific and general community forums
- **Real-time Chat**: Public and private messaging systems
- **Study Groups**: Collaborative learning environments
- **Peer Support**: Community-driven help and mentoring

### 📊 Advanced Administration
- **User Management**: Complete user lifecycle management
- **Analytics Dashboard**: Learning analytics and performance metrics
- **Content Moderation**: Admin approval workflows
- **System Monitoring**: Health checks and performance tracking

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for responsive design
- **TanStack Query** for state management
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Drizzle ORM
- **bcrypt** for password security
- **Express sessions** for authentication
- **TypeScript** throughout the stack

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rrf-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Test Accounts

The system includes pre-configured test accounts:

- **Admin**: `admin@rrfuganda.org` / `password123`
- **Instructor**: `instructor@rrfuganda.org` / `password123`  
- **Student**: `student@rrfuganda.org` / `password123`

## User Registration

New users can register with the following information:
- Personal details (name, contact information)
- Location data (district, subcounty, village)
- Education level and course preferences
- Learning language and timezone

**Supported Languages**: English, Swahili, Luganda, French
**Course Types**: Online, Physical

## Database Schema

The platform uses 18+ database tables including:
- **users**: User profiles and authentication
- **courses**: Course content and metadata
- **enrollments**: Student-course relationships
- **course_modules**: Structured learning content
- **assignments**: Assessments and submissions
- **forums**: Discussion categories and topics
- **certificates**: Digital credentials
- **learning_analytics**: Progress and performance data

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - List public courses
- `POST /api/courses` - Create new course (instructor)
- `GET /api/courses/:id` - Get course details
- `POST /api/enrollments` - Enroll in course

### Administration
- `GET /api/admin/users` - Manage users (admin)
- `GET /api/admin/analytics` - System analytics (admin)
- `POST /api/admin/approve-course` - Approve courses (admin)

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio

### Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utilities and API client
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   └── storage.ts       # Database operations
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is developed for educational purposes to support refugee and rural communities in learning sustainable practices.

## Support

For questions or support, please contact the RRF Learning Platform team.