# Deployment Guide: Frontend (Vercel) + Backend (Render)

## Prerequisites

### For Backend (Render):
1. **MongoDB Database**: You'll need a MongoDB database. Options:
   - [MongoDB Atlas](https://www.mongodb.com/atlas) (Recommended - Free tier available)
   - [Railway](https://railway.app/) (Free tier available)
   - [MongoDB Cloud](https://cloud.mongodb.com/)

2. **Render Account**: Sign up at [render.com](https://render.com)

### For Frontend (Vercel):
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository

## Backend Deployment on Render

### Step 1: Prepare Your Backend

1. **Environment Variables**: Create a `.env` file in your backend directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   PORT=10000
   ```

2. **MongoDB Setup**:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Replace `your_mongodb_connection_string` with your actual MongoDB URI

### Step 2: Deploy to Render

1. **Connect GitHub Repository**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**:
   - **Name**: `job-tracker-backend` (or your preferred name)
   - **Root Directory**: `backend` (since your backend is in a subdirectory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

3. **Environment Variables**:
   Add these environment variables in Render dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically deploy your backend
   - Note down the generated URL (e.g., `https://your-app-name.onrender.com`)

## Frontend Deployment on Vercel

### Step 1: Prepare Your Frontend

1. **Update API URL**: 
   - In your frontend code, make sure the API URL points to your Render backend
   - The `REACT_APP_API_URL` environment variable should be set to your Render backend URL

2. **Environment Variables**:
   Create a `.env` file in your frontend directory:
   ```env
   REACT_APP_API_URL=https://your-backend-name.onrender.com
   ```

### Step 2: Deploy to Vercel

1. **Connect GitHub Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure the Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend` (since your frontend is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   Add this environment variable in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-name.onrender.com
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note down the generated URL (e.g., `https://your-app-name.vercel.app`)

### Step 3: Update Backend CORS

After getting your frontend URL, update the `CLIENT_URL` environment variable in your Render backend to point to your Vercel frontend URL.

## Important Notes

### Security Considerations:
1. **JWT Secret**: Use a strong, random string for JWT_SECRET
2. **MongoDB**: Use MongoDB Atlas with proper authentication
3. **Environment Variables**: Never commit `.env` files to Git

### Performance:
1. **Render Free Tier**: Has cold starts and limited resources
2. **Vercel**: Excellent performance with global CDN
3. **MongoDB Atlas**: Free tier has limitations

### Monitoring:
1. **Render**: Built-in logs and monitoring
2. **Vercel**: Built-in analytics and performance monitoring
3. **MongoDB Atlas**: Database monitoring and alerts

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure `CLIENT_URL` in backend matches your frontend URL exactly
   - Check that the URL includes `https://` protocol

2. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility

3. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

4. **Environment Variables**:
   - Double-check all environment variables are set correctly
   - Remember to restart services after changing environment variables

### Support:
- **Render**: [docs.render.com](https://docs.render.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## Cost Estimation

### Free Tier Limits:
- **Render**: 750 hours/month, 512MB RAM, shared CPU
- **Vercel**: 100GB bandwidth, 100GB storage
- **MongoDB Atlas**: 512MB storage, shared RAM

### Paid Plans (if needed):
- **Render**: Starting at $7/month
- **Vercel**: Starting at $20/month
- **MongoDB Atlas**: Starting at $9/month 