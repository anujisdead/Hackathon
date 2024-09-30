const User = require('../model/userModel');
const CarbonFootprint = require('../model/carbonFootprintModel');
const Goal = require('../model/goalModel');

const createUser = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const user = new User({ name, email: email.toLowerCase(), password, age });
    const savedUser = await user.save();

    res.status(201).json({ message: 'User created successfully', data: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Successful login: return userId and userName
      return res.status(200).json({ userId: user._id, userName: user.name });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

// Fetch a user by ID
const fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('carbonFootprints')
      .populate('goals');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User fetched successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = { createUser, loginUser, fetchUser };
