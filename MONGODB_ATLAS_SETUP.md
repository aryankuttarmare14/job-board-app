# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up or log in to your account
3. Create a new cluster (free tier is fine)
4. Choose your preferred cloud provider and region
5. Click "Create Cluster"

## Step 2: Get Your Connection String

1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" as your driver
4. Copy the connection string

## Step 3: Create .env File

Create a file named `.env` in the `server` directory with the following content:

```
MONGO_URI= mongodb+srv://your_username:your_password@your_cluster.mongodb.net/jobboard?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Important:** Replace the following:
- `your_username` with your MongoDB Atlas username
- `your_password` with your MongoDB Atlas password
- `your_cluster` with your actual cluster name
- `your_secret_key_here` with a secure random string

## Step 4: Set Up Database Access

1. In Atlas dashboard, go to "Database Access"
2. Create a new database user with read/write permissions
3. Use this username and password in your connection string

## Step 5: Set Up Network Access

1. In Atlas dashboard, go to "Network Access"
2. Add your IP address or use "0.0.0.0/0" for all IPs (for development)

## Step 6: Test Connection

1. Start your server: `cd server && npm start`
2. You should see: "✅ MongoDB Atlas Connected: [your-cluster]"
3. If you see errors, check your connection string and credentials

## Troubleshooting

- Make sure your .env file is in the `server` directory
- Verify your MongoDB Atlas username and password
- Check that your IP is whitelisted in Network Access
- Ensure your cluster is running and accessible

## For Deployment

When deploying to Render or other platforms:
1. Add the MONGO_URI as an environment variable in your deployment platform
2. Make sure to use the production connection string
3. Set appropriate CORS origins for your deployed frontend 