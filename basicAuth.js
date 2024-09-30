const User = require('../model/userModel');
const basicAuth = require('basic-auth');

const authenticateUser = async (req, res, next) => {
  const credentials = basicAuth(req);

  // Check if credentials are present
  if (!credentials || !credentials.name || !credentials.pass) {
    console.log('No credentials provided or incomplete.');
    return res.status(401).json({ message: 'Access denied. No credentials provided.' });
  }

  try {
    // Convert email to lowercase to match stored format
    const email = credentials.name.toLowerCase();
    console.log('Received email:', email);
    
    // Find the user by email
    const user = await User.findOne({ email: email });
    console.log('User found:', user);

    if (!user) {
      console.log('User not found.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Directly compare the plaintext password
    if (credentials.pass !== user.password) {
      console.log('Password mismatch.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Attach user to the request object
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Error in authentication:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { authenticateUser };
