const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv/config"); // Environment variables

// Route imports
const authRoutes = require("./routes/auth");
const limiter = require("./middlewares/rateLimiter");
const vehicleRoutes = require('./routes/VehicleRoutes');
const quoteRoutes = require('./routes/QouteRoutes');
const invoiceRoutes = require('./routes/InvoiceRoutes');
const loadRoutes = require('./routes/LoadRoutes');
const communicationLogRoutes = require('./routes/CommunicationLogRoutes');
const conditionReportRoutes = require('./routes/ConditionReportRoutes');
const driverRoutes = require('./routes/DriverRoutes');
const userRoutes = require('./routes/UserRoutes');
const customerRoutes = require('./routes/CustomerRoutes');

// -> Middlewares
app.use(cors());
app.use(express.json());
app.use(limiter);

// -> Route Middlewares
app.use("/api/user", authRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/load', loadRoutes);
app.use('/api/communication-log', communicationLogRoutes);
app.use('/api/condition-report', conditionReportRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customer',customerRoutes);

mongoose.set('strictQuery', true);

// Connect to Database
mongoose.connect(process.env.DB_URL, () => {
  console.log("Connected to Database");
});

// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Application running at http://localhost:${process.env.PORT}/`);
});
