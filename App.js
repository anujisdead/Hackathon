import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import CarbonFootprintForm from './components/carbonfootprint/CarbonFootprintForm';
import UserDashboard from './components/dashboard/UserDashboard';

function App() {
  const [userId, setUserId] = useState(null); // State to store userId

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login setUserId={setUserId} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/carbon-footprint" element={<CarbonFootprintForm userId={userId} />} />
          <Route path="/dashboard" element={<UserDashboard />} /> {/* New dashboard route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
