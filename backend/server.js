// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database pool
db.initialize().catch(err => {
    console.error("Failed to initialize database pool:", err);
    process.exit(1);
});

// Routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
