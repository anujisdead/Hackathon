import React from 'react';

function Precautions({ carbonFootprintData }) {
  // Set default values using destructuring
  const {
    homeEnergy = { electricity: 0, gas: 0, water: 0 },
    transport = { mode: '', distance: 0 },
    waste = { paper: 0, plastic: 0, glass: 0 },
    totalCarbonEmission = 0,
  } = carbonFootprintData || {};

  // Generate precautions based on user inputs
  const generatePrecautions = () => {
    const precautions = [];

    // Home Energy Precautions
    if (homeEnergy.electricity > 500) {
      precautions.push('Consider using energy-efficient appliances and turning off devices when not in use.');
    }
    if (homeEnergy.gas > 100) {
      precautions.push('Ensure your heating system is well-maintained to reduce gas consumption.');
    }
    if (homeEnergy.water > 1000) {
      precautions.push('Install water-saving devices to reduce water consumption.');
    }

    // Transport Precautions
    if (transport.mode === 'car' && transport.distance > 50) {
      precautions.push('Consider carpooling, using public transportation, or biking to reduce your carbon footprint.');
    }
    if (transport.mode === 'public_transport' && transport.distance > 100) {
      precautions.push('Try to use non-motorized modes of transport, such as cycling or walking, for short distances.');
    }

    // Waste Precautions
    if (waste.plastic > 10) {
      precautions.push('Reduce plastic use by opting for reusable bags, bottles, and containers.');
    }
    if (waste.paper > 10) {
      precautions.push('Recycle paper waste and try to use digital documents to minimize paper usage.');
    }
    if (waste.glass > 5) {
      precautions.push('Recycle glass waste and avoid single-use glass products.');
    }

    // Overall Emission Precautions
    if (totalCarbonEmission > 1000) {
      precautions.push('Your total carbon emission is high. Consider reviewing your habits and implementing sustainable practices.');
    }

    return precautions;
  };

  const precautionsList = generatePrecautions();

  return (
    <div className="precautions-container">
      <h2>Precautions Based on Your Inputs</h2>
      {precautionsList.length > 0 ? (
        <ul>
          {precautionsList.map((precaution, index) => (
            <li key={index}>{precaution}</li>
          ))}
        </ul>
      ) : (
        <p>Great job! Your current inputs suggest you have a low carbon footprint.</p>
      )}
    </div>
  );
}

export default Precautions;
