import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@medibook.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email: admin@medibook.com');
      console.log('Password: admin123');
    } else {
      // Create admin user
      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@medibook.com',
        password: 'admin123', // This will be hashed automatically by the User model
        role: 'admin',
        phone: '+1234567890',
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log('Email: admin@medibook.com');
      console.log('Password: admin123');
      console.log('You can now login as admin');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdminUser();