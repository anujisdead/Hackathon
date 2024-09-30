// controller/goalController.js
const Goal = require('../model/goalModel');
const User = require('../model/userModel');

// Add a new goal for the user
// Add a new goal for the user
const addGoal = async (req, res) => {
    const { userId, description, targetEmissionReduction, endDate } = req.body;
    console.log(`Adding goal for userId: ${userId}`); // Debug log
    console.log(`Goal data:`, req.body); // Log the incoming request data

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const newGoal = new Goal({
            userId: user._id,
            description,
            targetEmissionReduction,
            endDate,
            startDate: Date.now(),
            progress: 0, // Default progress to 0
        });

        await newGoal.save();
        user.goals.push(newGoal._id);
        await user.save();

        console.log('Goal added successfully:', newGoal); // Log the added goal
        res.status(201).json({ message: 'Goal added successfully', goal: newGoal });
    } catch (error) {
        console.error('Error adding goal:', error); // Log the error
        res.status(500).json({ error: error.message });
    }
};

// Fetch goals for a user
const fetchUserGoals = async (req, res) => {
    const { userId } = req.params;

    try {
        const goals = await Goal.find({ userId });
        if (!goals) {
            return res.status(404).json({ message: 'No goals found for this user.' });
        }

        res.status(200).json({ goals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addGoal, fetchUserGoals };
