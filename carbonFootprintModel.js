const mongoose = require('mongoose');

const carbonFootprintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    homeEnergy: {
        electricity: { type: Number, default: 0 }, // in kWh
        gas: { type: Number, default: 0 }, // in cubic meters
        water: { type: Number, default: 0 } // in liters
    },
    transport: {
        mode: { type: String, enum: ['car', 'bike', 'public_transport', 'walk'], required: true },
        distance: { type: Number, default: 0 } // in km
    },
    waste: {
        paper: { type: Number, default: 0 }, // in kg
        plastic: { type: Number, default: 0 }, // in kg
        glass: { type: Number, default: 0 } // in kg
    },
    totalCarbonEmission: { type: Number, default: 0 } // in kg CO2
});

// Method to calculate total carbon emission based on inputs
carbonFootprintSchema.methods.calculateTotalEmission = function () {
    let totalEmission = 0;

    // Simple example calculations for illustration
    totalEmission += this.homeEnergy.electricity * 0.5; // Each kWh contributes 0.5 kg CO2
    totalEmission += this.homeEnergy.gas * 2.5; // Each cubic meter of gas contributes 2.5 kg CO2
    totalEmission += this.transport.distance * 0.2; // Each km traveled by car contributes 0.2 kg CO2

    // Waste management
    totalEmission += this.waste.paper * 0.1; // Each kg of paper waste contributes 0.1 kg CO2
    totalEmission += this.waste.plastic * 0.2; // Each kg of plastic waste contributes 0.2 kg CO2

    this.totalCarbonEmission = totalEmission;
    return totalEmission;
};

const CarbonFootprint = mongoose.model('CarbonFootprint', carbonFootprintSchema);
module.exports = CarbonFootprint;
