const User = require('../model/userModel');
const CarbonFootprint = require('../model/carbonFootprintModel');

// Create a new carbon footprint entry
const createCarbonFootprint = async (req, res) => {
    try {
      const { userId, carbonFootprintData } = req.body;
      console.log(`Creating carbon footprint for userId: ${userId}`); // Log userId
      console.log('Carbon Footprint Data:', carbonFootprintData); // Log incoming data
  
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      const existingCarbonFootprint = await CarbonFootprint.findOne({ userId, date: carbonFootprintData.date });
      if (existingCarbonFootprint) {
        console.log('Carbon footprint for this date already exists');
        return res.status(400).json({ message: 'Carbon footprint data for this date already exists.' });
      }
  
      const newCarbonFootprint = new CarbonFootprint({
        userId: user._id,
        date: carbonFootprintData.date,
        homeEnergy: carbonFootprintData.homeEnergy,
        transport: carbonFootprintData.transport,
        waste: carbonFootprintData.waste,
      });
  
      newCarbonFootprint.calculateTotalEmission();
      const savedCarbonFootprint = await newCarbonFootprint.save();
  
      user.carbonFootprints.push(savedCarbonFootprint._id);
      await user.save();
  
      console.log('Carbon footprint created successfully:', savedCarbonFootprint); // Log the saved footprint
      res.status(201).json({ message: 'Carbon footprint created successfully', data: savedCarbonFootprint });
    } catch (error) {
      console.error('Error creating carbon footprint:', error); // Log the error
      res.status(500).json({ error: error.message });
    }
  };
  
// Fetch carbon footprint data for a specific user
const fetchUserCarbonFootprint = async (req, res) => {
  try {
    const { userId } = req.params;
    const carbonFootprintData = await CarbonFootprint.findOne({ userId });

    if (!carbonFootprintData) {
      return res.status(404).json({ message: 'No carbon footprint data found for this user.' });
    }

    res.status(200).json({ data: carbonFootprintData });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Check if a user has carbon footprint data
const checkUserHasCarbonFootprint = async (req, res) => {
  const { userId } = req.params;

  try {
    const carbonFootprint = await CarbonFootprint.findOne({ userId });

    if (carbonFootprint) {
      return res.status(200).json({ hasData: true });
    } else {
      return res.status(200).json({ hasData: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { createCarbonFootprint, fetchUserCarbonFootprint, checkUserHasCarbonFootprint };
