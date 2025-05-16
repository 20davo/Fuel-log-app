const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const fuelRoutes = require('./routes/fuel');
app.use('/api/fuel', fuelRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Teszt route
app.get('/ping', (req, res) => {
    res.send('pong');
})

// MongoDB kapcsolódás
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/beadando')
.then(() => console.log('MongoDB csatlakoztatva'))
.catch(err => console.error('MongoDB hiba: ', err));

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);
});