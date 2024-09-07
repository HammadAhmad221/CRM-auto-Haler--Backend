const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv/config"); // Environment variables

// Route imports
const authRoutes = require("./routes/auth");
// const limiter = require("./middlewares/rateLimiter");
const vehicleRoutes = require('./routes/VehicleRoutes');
const quoteRoutes = require('./routes/QouteRoutes');
const invoiceRoutes = require('./routes/InvoiceRoutes');
const loadRoutes = require('./routes/LoadRoutes');
const communicationLogRoutes = require('./routes/CommunicationLogRoutes');
// const conditionReportRoutes = require('./routes/ConditionReportRoutes');
const driverRoutes = require('./routes/DriverRoutes');
const userRoutes = require('./routes/UserRoutes');
const customerRoutes = require('./routes/CustomerRoutes');
const counts = require('./routes/counts');
const driverDashboardRoutes = require("./routes/driverDashboardRoutes");
const reportRoutes = require('./routes/reportRoutes');

// -> Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// app.use(limiter);

// -> Route Middlewares
app.use("/api/user", authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/communicationLogs', communicationLogRoutes);
// app.use('/api/condition-reports', conditionReportRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers',customerRoutes);
app.use('/api/counts', counts );
app.use('/api/driver-loads',driverDashboardRoutes);
app.use('/api/reports',reportRoutes);


mongoose.set('strictQuery', true);
// Connect to Database
mongoose.connect(process.env.DB_URL, () => {
  console.log("Connected to Database");
});

// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Application running at http://localhost:${process.env.PORT}/`);
});
