import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Import the CSS file

function Login({ setUserId }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data && response.data.userId) {
        const userId = response.data.userId;
        const userName = response.data.userName; // Assume the backend returns the user's name
        setUserId(userId); // Set the userId in the parent component state if needed

        try {
          const carbonFootprintResponse = await axios.get(`http://localhost:8080/api/users/${userId}/carbon-footprint`);
          if (carbonFootprintResponse.status === 200) {
            const carbonFootprintData = carbonFootprintResponse.data.data;
            navigate('/dashboard', {
              state: {
                userId, // Pass the userId
                userName, // Pass the user's name
                formData: carbonFootprintData,
                totalEmission: carbonFootprintData.totalCarbonEmission,
              },
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            navigate('/carbon-footprint', {
              state: { userId, email: formData.email, password: formData.password, userName },
            });
          } else {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data. Please try again.');
          }
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Error during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
}

export default Login;
