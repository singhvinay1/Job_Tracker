# Job Application Tracker

A full-stack web application for tracking job applications with real-time notifications.

## Features

- User Authentication (JWT)
- Job Application CRUD operations
- Status tracking (Applied, Interview, Offer, Rejected, Accepted)
- Filtering and sorting capabilities
- Admin panel for overview
- Real-time notifications
- Responsive design

## Tech Stack

- Frontend: React, Material-UI, Formik, Yup
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: Socket.IO
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd job-application-tracker
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

4. Start the development servers:
```bash
npm start
```

This will start both the frontend (port 3000) and backend (port 5000) servers.

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Job Applications
- GET /api/jobs - Get all jobs for current user
- POST /api/jobs - Create new job application
- GET /api/jobs/:id - Get single job application
- PATCH /api/jobs/:id - Update job application
- DELETE /api/jobs/:id - Delete job application

### Admin
- GET /api/jobs/admin/all - Get all job applications (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
