const express = require('express');
const connectDB = require('./src/config/db');
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const authRoutes = require('./src/routes/auth');
const customerRoutes = require('./src/routes/customer');
const leadRoutes = require('./src/routes/leads'); 

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.json({"msg": "Hello world"});
});

connectDB();

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
})

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});