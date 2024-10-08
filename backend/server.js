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
// app.use(helmet()); // Use helmet for security

// Initialize database pool
db.initialize().catch(err => {
    console.error('Failed to initialize database pool:', err);
    process.exit(1);
});

// Routes
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment_method');
const productReportRoutes = require('./routes/report');
const employeeRevenueRoutes = require('./routes/employeeRevenue');
const revenue = require('./routes/revenue');
const profileRouter = require('./routes/profile');
const transactionRoutes = require("./routes/transaction");
const logoutRoutes = require('./routes/logout'); // Import the logout route

// const reportRoutes = require('./routes/report');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes); // Prefix for user routes
app.use('/api/products', productRoutes); // Prefix for product routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reports', productReportRoutes);
app.use('/api/employeerevenue', employeeRevenueRoutes);
app.use('/api/revenue', revenue);
app.use('/api/profile', profileRouter);
app.use('/api/transactions', transactionRoutes);
app.use('/api/logout', logoutRoutes); // Use the logout route

// app.use('/api/report', reportRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
