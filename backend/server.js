require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route-ok
const refuelRoutes = require('./routes/refuel');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');

app.use('/api/refuel', refuelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Teszt route
app.get('/ping', (req, res) => {
    res.send('pong');
})

// MongoDB kapcsolódás
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB csatlakoztatva'))
    .catch(err => console.error('MongoDB hiba: ', err));

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);
});