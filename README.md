# Job Board Application

A full-stack job board application built with React, Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based user registration & login with two roles (job_seeker and employer)
- **Job Listings**: CRUD operations for employers to manage job postings
- **Resume Upload**: Job seekers can upload PDF resumes when applying
- **Search & Filter**: Search jobs by keywords, location, and job type
- **Dashboards**: Separate dashboards for job seekers and employers

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer for resume storage

## Project Structure

\`\`\`
job-board-app/
├── client/ (React frontend)
├── server/ (Node.js backend)
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Server Setup

1. Navigate to the server directory:
   \`\`\`
   cd job-board-app/server
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the server directory with the following variables:
   \`\`\`
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-board
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   \`\`\`

4. Create the uploads directory:
   \`\`\`
   mkdir uploads
   \`\`\`

5. Start the server:
   \`\`\`
   npm run dev
   \`\`\`

### Client Setup

1. Navigate to the client directory:
   \`\`\`
   cd job-board-app/client
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the client directory:
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000
   \`\`\`

4. Start the client:
   \`\`\`
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create a job (employers only)
- `PUT /api/jobs/:id` - Update a job (employers only)
- `DELETE /api/jobs/:id` - Delete a job (employers only)
- `GET /api/jobs/employer/myjobs` - Get all jobs created by the employer

### Applications
- `POST /api/applications/:jobId` - Apply for a job (job seekers only)
- `GET /api/applications/jobs/:jobId` - Get all applications for a job (employers only)
- `GET /api/applications/me` - Get all applications by the logged in user (job seekers only)
- `PUT /api/applications/:id` - Update application status (employers only)

## Usage

### As an Employer
1. Register as an employer
2. Post job listings with details
3. View and manage applications
4. Update application statuses

### As a Job Seeker
1. Register as a job seeker
2. Browse and search for jobs
3. Apply to jobs with resume upload
4. Track application status

## Job Board Application Setup

### Running the Seed Script

To populate your database with sample data, follow these steps:

1. Make sure your MongoDB connection is set up correctly in your `.env` file
2. Navigate to the server directory:
   \`\`\`
   cd server
   \`\`\`
3. Run the seed script:
   \`\`\`
   node seed.js
   \`\`\`
4. You should see confirmation messages that users and jobs were created

### Sample User Credentials

After running the seed script, you can log in with these credentials:

#### Employer Accounts:
- Email: recruiter@techcorp.com
- Password: password123

- Email: recruiter@datasystems.com
- Password: password123

- Email: recruiter@creativeminds.com
- Password: password123

#### Job Seeker Account:
- Email: seeker@example.com
- Password: password123

### Starting the Application

1. Start the server:
   \`\`\`
   cd server
   npm run dev
   \`\`\`

2. In a new terminal, start the client:
   \`\`\`
   cd client
   npm start
   \`\`\`

3. Visit http://localhost:3000 to see the application

## License

MIT
