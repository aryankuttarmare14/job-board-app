# Job Board Backend API

This is the backend API for the Job Board application. It provides endpoints for user authentication, job listings, and job applications.

## Setup Instructions

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Create a `.env` file in the root directory with the following variables:
   \`\`\`
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobboard
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   \`\`\`

3. Seed the database with initial data:
   \`\`\`
   npm run seed
   \`\`\`

4. Start the server:
   \`\`\`
   npm run dev
   \`\`\`

## Admin Access

After seeding the database, you can log in as an admin with the following credentials:
- Email: admin@jobboard.com
- Password: admin123

The admin has access to additional endpoints for managing users, jobs, and viewing dashboard statistics.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Jobs

- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (employers only)
- `PUT /api/jobs/:id` - Update job (job owner only)
- `DELETE /api/jobs/:id` - Delete job (job owner only)
- `GET /api/jobs/employer/me` - Get jobs posted by employer (employers only)

### Applications

- `POST /api/applications` - Apply for a job (job seekers only)
- `GET /api/applications/me` - Get applications by job seeker (job seekers only)
- `GET /api/applications/job/:jobId` - Get applications for a job (employer only)
- `PUT /api/applications/:id` - Update application status (employer only)
- `DELETE /api/applications/:id` - Delete application (job seeker only)
- `GET /api/applications/:id/resume` - Download resume (employer only)

### Admin Routes (Admin only)

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/jobs` - Get all jobs (admin view)
- `PUT /api/admin/jobs/:id` - Update job (admin)
- `DELETE /api/admin/jobs/:id` - Delete job (admin)
- `GET /api/admin/stats` - Get dashboard statistics

## Models

### User

- name: String (required)
- username: String (required, unique)
- email: String (required, unique)
- password: String (required)
- role: String (enum: ['jobseeker', 'employer'], default: 'jobseeker')
- company: String
- location: String
- bio: String
- skills: [String]

### Job

- title: String (required)
- company: String (required)
- location: String (required)
- type: String (required, enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'])
- description: String (required)
- requirements: [String]
- responsibilities: [String]
- salary: Object
- deadline: Date (required)
- employer: ObjectId (ref: 'User', required)
- status: String (enum: ['active', 'closed', 'draft'], default: 'active')
- applications: Number (default: 0)

### Application

- job: ObjectId (ref: 'Job', required)
- applicant: ObjectId (ref: 'User', required)
- coverLetter: String (required)
- resumeUrl: String (required)
- status: String (enum: ['pending', 'accepted', 'rejected'], default: 'pending')
- feedback: String
