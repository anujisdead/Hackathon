import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Precautions from '../precautions/Precautions';
import './CarbonFootprintForm.css';

function CarbonFootprintForm({ userId }) {
  const [formData, setFormData] = useState({
    date: '',
    homeEnergy: { electricity: 0, gas: 0, water: 0 },
    transport: { mode: 'car', distance: 0 },
    waste: { paper: 0, plastic: 0, glass: 0 },
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalEmission, setTotalEmission] = useState(null);
  const [showPrecautions, setShowPrecautions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, userName } = location.state || {}; // Get username from location.state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [parent]: { ...prevData[parent], [child]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = btoa(`${email}:${password}`);
      const response = await axios.post(
        'http://localhost:8080/api/carbon-footprint',
        { userId, carbonFootprintData: formData },
        { headers: { Authorization: `Basic ${auth}` } }
      );

      setTotalEmission(response.data.data.totalCarbonEmission);
      setSuccessMessage('Carbon footprint data submitted successfully!');
      setError('');
      navigate('/dashboard', {
        state: { formData, totalEmission: response.data.data.totalCarbonEmission, userName },
      });
      setShowPrecautions(true);
    } catch (err) {
      setError('Error submitting data. Please try again.');
      setSuccessMessage('');
      console.error('Carbon footprint submission error:', err);
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {userName}!</h2> {/* Display the username */}
      <h2>Enter Your Carbon Footprint Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {totalEmission !== null && <p>Total Carbon Emission: {totalEmission} kg CO2</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          {/* Date Section */}
          <div className="form-group">
            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          {/* Home Energy Section */}
          <div className="form-group">
            <h3>Home Energy</h3>
            <label>Electricity (kWh):</label>
            <input
              type="number"
              name="homeEnergy.electricity"
              value={formData.homeEnergy.electricity}
              onChange={handleChange}
            />
            <label>Gas (cubic meters):</label>
            <input
              type="number"
              name="homeEnergy.gas"
              value={formData.homeEnergy.gas}
              onChange={handleChange}
            />
            <label>Water (liters):</label>
            <input
              type="number"
              name="homeEnergy.water"
              value={formData.homeEnergy.water}
              onChange={handleChange}
            />
          </div>

          {/* Transport Section */}
          <div className="form-group">
            <h3>Transport</h3>
            <label>Mode:</label>
            <select
              name="transport.mode"
              value={formData.transport.mode}
              onChange={handleChange}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="public_transport">Public Transport</option>
              <option value="walk">Walk</option>
            </select>
            <label>Distance (km):</label>
            <input
              type="number"
              name="transport.distance"
              value={formData.transport.distance}
              onChange={handleChange}
            />
          </div>

          {/* Waste Section */}
          <div className="form-group">
            <h3>Waste</h3>
            <label>Paper (kg):</label>
            <input
              type="number"
              name="waste.paper"
              value={formData.waste.paper}
              onChange={handleChange}
            />
            <label>Plastic (kg):</label>
            <input
              type="number"
              name="waste.plastic"
              value={formData.waste.plastic}
              onChange={handleChange}
            />
            <label>Glass (kg):</label>
            <input
              type="number"
              name="waste.glass"
              value={formData.waste.glass}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>

      {showPrecautions && <Precautions carbonFootprintData={formData} />}
    </div>
  );
}

export default CarbonFootprintForm;
