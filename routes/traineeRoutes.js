const express = require('express');
const router = express.Router();
const {
  getTrainees,
  getTraineeById,
  createTrainee,
  updateTrainee,
  deleteTrainee,
} = require('../controllers/traineeController');
const { protect, admin } = require('../middleware/authMiddleware');

// All trainee routes are protected and require admin access
router.route('/')
  .get(protect, admin, getTrainees)
  .post(protect, admin, createTrainee);

router.route('/:id')
  .get(protect, admin, getTraineeById)
  .put(protect, admin, updateTrainee)
  .delete(protect, admin, deleteTrainee);

module.exports = router;