import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import Precautions from '../precautions/Precautions';
import './UserDashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData = {}, totalEmission = 0, userName = 'User', userId } = location.state || {}; 

  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ description: '', targetEmissionReduction: 0, endDate: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing. Redirecting to login.');
      navigate('/'); // Redirect to login
      return;
    }

    // Fetch user goals when the dashboard loads
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}/goals`);
        setGoals(response.data.goals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        setErrorMessage('Error fetching goals. Please try again.');
      }
    };

    fetchGoals();
  }, [userId, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  // Handle adding a new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/users/${userId}/goals`, {
        userId,
        description: newGoal.description,
        targetEmissionReduction: newGoal.targetEmissionReduction,
        endDate: newGoal.endDate,
      });

      if (response.status === 201) {
        setGoals([...goals, response.data.goal]); // Update local state with the newly added goal
        setNewGoal({ description: '', targetEmissionReduction: 0, endDate: '' }); // Reset form
        setSuccessMessage('Goal added successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to add goal. Please try again.');
      }

      setTimeout(() => setSuccessMessage(''), 3000); // Clear the success message after 3 seconds
    } catch (error) {
      console.error('Error adding goal:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrorMessage(`Failed to add goal: ${error.response.data.error}`);
      } else {
        setErrorMessage('Failed to add goal. Please try again.');
      }
    }
  };

  // Rest of your code...
  

  // Prepare data for the pie chart
  const pieData = {
    labels: ['Home Energy', 'Transport', 'Waste'],
    datasets: [
      {
        data: [
          formData.homeEnergy?.electricity + formData.homeEnergy?.gas + formData.homeEnergy?.water || 0,
          formData.transport?.distance || 0,
          formData.waste?.paper + formData.waste?.plastic + formData.waste?.glass || 0,
        ],
        backgroundColor: ['#1e3a8a', '#f59e0b', '#10b981'],
      },
    ],
  };

  // Prepare data for the bar chart
  const barData = {
    labels: ['Electricity', 'Gas', 'Water', 'Transport Distance', 'Paper', 'Plastic', 'Glass'],
    datasets: [
      {
        label: 'Carbon Emissions (kg CO2)',
        data: [
          formData.homeEnergy?.electricity || 0,
          formData.homeEnergy?.gas || 0,
          formData.homeEnergy?.water || 0,
          formData.transport?.distance || 0,
          formData.waste?.paper || 0,
          formData.waste?.plastic || 0,
          formData.waste?.glass || 0,
        ],
        backgroundColor: '#1e3a8a',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h2>{userName}'s Dashboard</h2> {/* Display the user's name */}
        
        {/* Display fetched data */}
        <div className="section">
          <h3>Your Inputs</h3>
          <p><strong>Date:</strong> {formData.date || 'N/A'}</p>
          <h4>Home Energy</h4>
          <p>Electricity: {formData.homeEnergy?.electricity || 0} kWh</p>
          <p>Gas: {formData.homeEnergy?.gas || 0} cubic meters</p>
          <p>Water: {formData.homeEnergy?.water || 0} liters</p>
          <h4>Transport</h4>
          <p>Mode: {formData.transport?.mode || 'N/A'}</p>
          <p>Distance: {formData.transport?.distance || 0} km</p>
          <h4>Waste</h4>
          <p>Paper: {formData.waste?.paper || 0} kg</p>
          <p>Plastic: {formData.waste?.plastic || 0} kg</p>
          <p>Glass: {formData.waste?.glass || 0} kg</p>
        </div>

        <div className="section">
          <h3>Total Carbon Emission</h3>
          <p>{totalEmission} kg CO₂</p>
        </div>

        {/* Graphs Section */}
        <div className="section">
          <h3>Carbon Footprint Overview</h3>
          <div className="chart-container">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="section">
          <h3>Detailed Emissions Breakdown</h3>
          <div className="chart-container">
            <Bar data={barData} />
          </div>
        </div>

        {/* Goals Section */}
        <div className="section">
          <h3>Your Sustainability Goals</h3>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {goals.length > 0 ? (
            <ul>
              {goals.map((goal, index) => (
                <li key={index}>
                  <strong>{goal.description}</strong> - Target Reduction: {goal.targetEmissionReduction} kg CO2 - Progress: {goal.progress}%
                </li>
              ))}
            </ul>
          ) : (
            <p>No goals set yet.</p>
          )}
          
          {/* Add New Goal Form */}
          <h3>Set a New Goal</h3>
          <form onSubmit={handleAddGoal}>
            <input
              type="text"
              placeholder="Goal Description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Target Emission Reduction (kg CO2)"
              value={newGoal.targetEmissionReduction}
              onChange={(e) => setNewGoal({ ...newGoal, targetEmissionReduction: e.target.value })}
              required
            />
            <input
              type="date"
              value={newGoal.endDate}
              onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
              required
            />
            <button type="submit">Add Goal</button>
          </form>
        </div>

        <div className="button-container">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Precautions */}
      <div className="precautions-wrapper">
        <Precautions carbonFootprintData={{ ...formData, totalCarbonEmission: totalEmission }} />
      </div>
    </div>
  );
}

export default UserDashboard;
