const User = require('../models/userModel');

// @desc    Get all trainees
// @route   GET /api/trainees
// @access  Private/Admin
const getTrainees = async (req, res) => {
  try {
    // Find all users with role 'trainee'
    const trainees = await User.find({ role: 'trainee' }).select('-password');
    res.json(trainees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainee by ID
// @route   GET /api/trainees/:id
// @access  Private/Admin
const getTraineeById = async (req, res) => {
  try {
    const trainee = await User.findById(req.params.id).select('-password');

    if (trainee && trainee.role === 'trainee') {
      res.json(trainee);
    } else {
      res.status(404);
      throw new Error('Trainee not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a trainee
// @route   POST /api/trainees
// @access  Private/Admin
const createTrainee = async (req, res) => {
  try {
    const { name, email, password, department, gender } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create new trainee
    const trainee = await User.create({
      name,
      email,
      password,
      department,
      gender,
      role: 'trainee',
    });

    if (trainee) {
      res.status(201).json({
        _id: trainee._id,
        name: trainee.name,
        email: trainee.email,
        department: trainee.department,
        gender: trainee.gender,
        role: trainee.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid trainee data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a trainee
// @route   PUT /api/trainees/:id
// @access  Private/Admin
const updateTrainee = async (req, res) => {
  try {
    const trainee = await User.findById(req.params.id);

    if (trainee && trainee.role === 'trainee') {
      // Update only the fields that are sent in the request
      trainee.name = req.body.name || trainee.name;
      trainee.department = req.body.department || trainee.department;
      trainee.gender = req.body.gender || trainee.gender;
      
      // Only update email if it's provided
      if (req.body.email) {
        // Check if email is already taken by another user
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists && emailExists._id.toString() !== trainee._id.toString()) {
          res.status(400);
          throw new Error('Email already in use');
        }
        trainee.email = req.body.email;
      }
      
      // Only update password if it's provided
      if (req.body.password) {
        trainee.password = req.body.password;
      }

      const updatedTrainee = await trainee.save();

      res.json({
        _id: updatedTrainee._id,
        name: updatedTrainee.name,
        email: updatedTrainee.email,
        department: updatedTrainee.department,
        gender: updatedTrainee.gender,
        role: updatedTrainee.role,
      });
    } else {
      res.status(404);
      throw new Error('Trainee not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a trainee
// @route   DELETE /api/trainees/:id
// @access  Private/Admin
const deleteTrainee = async (req, res) => {
  try {
    const trainee = await User.findById(req.params.id);

    if (trainee && trainee.role === 'trainee') {
      await User.deleteOne({ _id: trainee._id });
      res.json({ message: 'Trainee removed' });
    } else {
      res.status(404);
      throw new Error('Trainee not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getTrainees,
  getTraineeById,
  createTrainee,
  updateTrainee,
  deleteTrainee,
};