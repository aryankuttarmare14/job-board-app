# Job Board Application

A full-stack job board application with React frontend and Node.js backend.

## Project Structure

- `frontend/`: React frontend code (deployed on Vercel)
- `backend/`: Node.js backend code (deployed on Render)

## Features

- User authentication (job seekers, employers, admin)
- Job listings with search and filtering
- Job applications with resume upload
- Employer dashboard for managing jobs and applications
- Admin dashboard for managing users and jobs

## Deployment

See [deployment-guide.md](./deployment-guide.md) for detailed instructions on deploying the application.

## Login Credentials

### Admin
- Email: admin@jobboard.com
- Password: admin123

### Employers
- Tech Corp:
  - Email: hr@techcorp.com
  - Password: employer123
- Data Systems:
  - Email: careers@datasystems.com
  - Password: employer123
- Creative Minds:
  - Email: jobs@creativeminds.com
  - Password: employer123

### Job Seekers
- John Doe:
  - Email: john@example.com
  - Password: jobseeker123
- Jane Smith:
  - Email: jane@example.com
  - Password: jobseeker123

## Local Development

### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm run dev`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file based on `.env.local.example`
4. Start the development server: `npm run dev`
