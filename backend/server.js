const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb'); // Import the OracleDB module
const db = require('./config/db'); // Adjust path if needed
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database pool
db.initialize().catch(err => {
    console.error('Failed to initialize database pool:', err);
    process.exit(1);
});

// Routes
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes); // Prefix for user routes
app.use('/api/products', productRoutes); // Prefix for product routes

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
