# RRF Learning Platform - Deployment Guide

## Table of Contents
- [Database Setup](#database-setup-complete-)
- [Test Accounts](#test-accounts-available)
- [GitHub Deployment](#github-deployment-instructions)
- [Environment Variables](#environment-variables-for-production)
- [Deployment Platforms](#deployment-platforms)
- [Features Ready](#features-ready-for-production)
- [Post-Deployment](#post-deployment-steps)
- [Support & Maintenance](#support--maintenance)

## Database Setup Complete ✅

The application is now connected to the production PostgreSQL database:
- **Database URL**: `postgresql://rrfuganda_user:bKyRl7ZqAuJltStYsWEtLk7nOBT5sHQc@dpg-d1hbbcfgi27c73chd5s0-a.oregon-postgres.render.com/rrfuganda`
- **All 18 tables created** with proper schema and relationships
- **Test users created** and authentication verified working

> **Note**: This is your production database URL. Keep this secure and don't share publicly.

## Test Accounts Available

| Role | Email | Username | Password |
|------|-------|----------|----------|
| Admin | admin@rrfuganda.org | admin | password123 |
| Instructor | instructor@rrfuganda.org | instructor | password123 |
| Student | student@rrfuganda.org | student | password123 |

## GitHub Deployment Instructions

To push this project to your GitHub repository (`https://github.com/djumzy/rwamwanjarural.git`), follow these commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete RRF Learning Platform with PostgreSQL integration"

# Add your GitHub repository as remote
git remote add origin https://github.com/djumzy/rwamwanjarural.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Environment Variables for Production

When deploying to hosting platforms (Vercel, Render, Railway, etc.), set these environment variables:

```
DATABASE_URL=postgresql://rrfuganda_user:bKyRl7ZqAuJltStYsWEtLk7nOBT5sHQc@dpg-d1hbbcfgi27c73chd5s0-a.oregon-postgres.render.com/rrfuganda
SESSION_SECRET=your-secure-session-secret-here
NODE_ENV=production
```

**Security Notes:**
- Generate a strong SESSION_SECRET using: `openssl rand -base64 32`
- Never commit real credentials to version control
- Use environment-specific database URLs for different deployments

## Deployment Platforms

### Render
1. Connect your GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables above

### Vercel
1. Connect GitHub repository
2. Framework: Other
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

## Features Ready for Production

✅ **Authentication System**
- User registration and login
- Role-based access control (Admin, Instructor, Student)
- Session management with PostgreSQL store

✅ **Course Management**
- Course creation and approval workflow
- Module-based learning structure
- Progress tracking and analytics

✅ **Community Features**
- Discussion forums
- Real-time messaging
- Study groups and peer interaction

✅ **Administrative Dashboard**
- User management
- System analytics
- Content moderation

✅ **Modern UI/UX**
- Responsive design for all devices
- Professional permaculture-focused interface
- Accessibility features

## Post-Deployment Steps

1. **Update Database Connection**: If moving to a different database, update the `DATABASE_URL`
2. **SSL Configuration**: Ensure SSL is properly configured for production
3. **Domain Setup**: Configure custom domain if needed
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Backups**: Configure regular database backups

## Troubleshooting Common Issues

**Database Connection Errors:**
- Verify DATABASE_URL format and credentials
- Check if database is accessible from deployment platform
- Ensure SSL requirements are met

**Build Failures:**
- Verify all dependencies are in package.json
- Check Node.js version compatibility
- Review build logs for specific error messages

**Authentication Issues:**
- Confirm SESSION_SECRET is properly set
- Verify database tables are created
- Check user role assignments

## Support & Maintenance

- Application logs available through hosting platform
- Database monitoring through PostgreSQL provider
- Regular updates can be deployed via GitHub integration

The application is production-ready with all core features implemented and tested!