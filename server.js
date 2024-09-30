const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./router/userRoutes');
const cors = require('cors')

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
}));

// MongoDB connection URI for local instance
const MONGODB_URI = 'mongodb://localhost:27017/myDatabase'; // Replace with your database name

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI); 
        console.log('Connected to local MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

connectDB();

app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
