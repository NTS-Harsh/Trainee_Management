const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'ishathakur@admin.com',
      password: 'password123',
      department: 'Administration',
      gender: 'female',
      role: 'admin',
    });

    // Create sample trainees
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      department: 'IT',
      gender: 'male',
      role: 'trainee',
    });

    await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      department: 'HR',
      gender: 'female',
      role: 'trainee',
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}