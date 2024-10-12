require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');


const port = process.env.PORT || 5001;
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);




app.listen(port, () => console.log(`Listening on port ${port}`));