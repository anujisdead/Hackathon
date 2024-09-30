const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    targetEmissionReduction: { 
        type: Number, 
        required: true 
    }, // Target reduction in kg CO2
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    progress: { 
        type: Number, 
        default: 0 
    } // Progress as a percentage
  });
  
  const Goal = mongoose.model('Goal', goalSchema);
  module.exports = Goal;