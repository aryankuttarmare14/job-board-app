# Job Board Portal - Deployment Guide

## Live Demo Setup

This guide will help you deploy your Job Board Portal to create a live demo link.

### Prerequisites
- GitHub repository: https://github.com/aryankuttarmare14/Job-Board-Portal.git
- MongoDB Atlas account (free tier available)

### Step 1: Set up MongoDB Atlas (Backend Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/jobboard?retryWrites=true&w=majority`)

### Step 2: Deploy Backend to Render

1. Go to [Render](https://render.com) and sign up with your GitHub account
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: job-board-backend
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secret string (e.g., "your-super-secret-jwt-key-2024")
   - `NODE_ENV`: production
6. Click "Create Web Service"
7. Wait for deployment and copy the URL (e.g., `https://job-board-backend.onrender.com`)

### Step 3: Deploy Frontend to Netlify

1. Go to [Netlify](https://netlify.com) and sign up with your GitHub account
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure the build settings:
   - **Base directory**: client
   - **Build command**: `npm run build`
   - **Publish directory**: build
5. Add environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://job-board-backend.onrender.com`)
6. Click "Deploy site"
7. Wait for deployment and get your live URL (e.g., `https://amazing-job-board.netlify.app`)

### Step 4: Update Configuration Files

After getting your backend URL, update the `client/netlify.toml` file:

```toml
[build.environment]
  REACT_APP_API_URL = "https://your-actual-backend-url.onrender.com"
```

### Step 5: Test Your Live Demo

1. Visit your Netlify URL
2. Test the following features:
   - User registration and login
   - Job browsing and searching
   - Job applications
   - Admin dashboard (if you have admin credentials)

### Troubleshooting

- If the frontend can't connect to the backend, check that the `REACT_APP_API_URL` environment variable is set correctly
- If the backend fails to start, check the MongoDB connection string and JWT secret
- Check Render logs for any deployment issues

### Demo Credentials

You can create test accounts or use these sample credentials:
- **Admin**: admin@jobboard.com / admin123
- **Employer**: employer@company.com / employer123
- **Job Seeker**: seeker@email.com / seeker123

### GitHub Repository

Your project is available at: https://github.com/aryankuttarmare14/Job-Board-Portal

---

**Note**: The free tiers of Render and Netlify may have some limitations, but they're perfect for demo purposes! 