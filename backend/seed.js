const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/job-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB.');

    console.log('Clearing existing users...');
    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users cleared.');

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create regular user
    console.log('Creating regular user...');
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      name: 'Test User',
      email: 'user@example.com',
      password: userPassword,
      role: 'applicant'
    });

    // Save users
    console.log('Saving users...');
    await admin.save();
    await user.save();
    console.log('Users saved.');

    console.log('Test users created successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nRegular user credentials:');
    console.log('Email: user@example.com');
    console.log('Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error.message); // Log only the error message
    process.exit(1);
  }
};

seedUsers(); 