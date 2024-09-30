const express = require('express');
const router = express.Router();
const {
  createUser,
  fetchUser,
  loginUser
} = require('../controller/userController');
const { createCarbonFootprint, fetchUserCarbonFootprint, checkUserHasCarbonFootprint } = require('../controller/carbonFootprintController');
const { authenticateUser } = require('../middleware/basicAuth');
const { addGoal, fetchUserGoals } = require('../controller/goalController');

// User Routes
router.post('/users', createUser);
router.post('/login', loginUser);
router.get('/users/:id', fetchUser);


// Carbon Footprint Routes
router.post('/carbon-footprint', authenticateUser, createCarbonFootprint);
router.get('/users/:userId/carbon-footprint', fetchUserCarbonFootprint);
router.get('/check-carbon-footprint/:userId', checkUserHasCarbonFootprint);

// Add a new goal for a user
router.post('/users/:userId/goals', addGoal);

// Fetch goals for a user
router.get('/users/:userId/goals', fetchUserGoals);

module.exports = router;
