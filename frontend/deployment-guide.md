# Deployment Guide for Job Board Application

This guide will help you deploy the Job Board application with the frontend on Vercel and the backend on Render.

## Backend Deployment (Render)

1. **Create a new Web Service on Render**:
   - Sign up or log in to [Render](https://render.com)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository or use the "Manual Deploy" option

2. **Configure the Web Service**:
   - Name: `job-board-api` (or your preferred name)
   - Root Directory: `backend` (important: specify the backend folder)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Select the appropriate plan (Free tier works for testing)

3. **Set Environment Variables**:
   - Go to the "Environment" tab and add the following variables:
     - `PORT`: 10000 (Render will use this internally)
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `JWT_EXPIRES_IN`: 7d
     - `NODE_ENV`: production
     - `FRONTEND_URL`: Your Vercel frontend URL (add this after deploying the frontend)

4. **Deploy the Service**:
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the URL provided by Render (e.g., `https://job-board-api.onrender.com`)

## Frontend Deployment (Vercel)

1. **Create a new Project on Vercel**:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure the Project**:
   - Framework Preset: Next.js
   - Root Directory: `frontend` (important: specify the frontend folder)
   - Build Command: (leave as default)
   - Output Directory: (leave as default)

3. **Set Environment Variables**:
   - Add the following environment variable:
     - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://job-board-api.onrender.com/api`)

4. **Deploy the Project**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Note the URL provided by Vercel (e.g., `https://job-board.vercel.app`)

5. **Update Backend CORS Configuration**:
   - Go back to your Render dashboard
   - Update the `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend service

## Post-Deployment Steps

1. **Test the Application**:
   - Visit your Vercel URL
   - Try to register, login, and use the application features
   - Verify that API calls are working correctly

2. **Login Credentials**:
   - Admin:
     - Email: admin@jobboard.com
     - Password: admin123
   - Employer (Tech Corp):
     - Email: hr@techcorp.com
     - Password: employer123
   - Employer (Data Systems):
     - Email: careers@datasystems.com
     - Password: employer123
   - Employer (Creative Minds):
     - Email: jobs@creativeminds.com
     - Password: employer123
   - Job Seeker (John Doe):
     - Email: john@example.com
     - Password: jobseeker123
   - Job Seeker (Jane Smith):
     - Email: jane@example.com
     - Password: jobseeker123

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, double-check that the `FRONTEND_URL` in your backend environment variables matches exactly with your Vercel URL.
- **API Connection Issues**: Verify that `NEXT_PUBLIC_API_URL` in your frontend environment variables is correct and includes the `/api` path.
- **Database Connection**: Ensure your MongoDB connection string is correct and that your IP address is whitelisted in MongoDB Atlas.
\`\`\`

Let's also create a .env.local file for the frontend:
