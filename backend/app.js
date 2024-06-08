const express = require("express")

const bodyParser = require('body-parser')
const mongoose = require('mongoose'); 
require('dotenv').config(); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoute');
// const userRoutes= require('./routes/userRoute')

const app = express(); 
app.use(bodyParser.json());
app.use(express.json()); 
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = 4007; 
app.use('/api', todoRoutes);
// app.use('api/v1/',userRoutes)
const connectionString = process.env.MONGODB_URL; 
mongoose.connect(connectionString)
.then(() => console.log('Connected to the database…'))
.catch((err) => console.error('Connection error:', err));




app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));