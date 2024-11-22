// Import dependencies
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for front-end communication
app.use(express.json()); // To parse JSON request bodies
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Define routes
const router = require('./routes/api'); // Import API routes
app.use(router);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
