const mongoose = require('mongoose');

const fuelEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    date: { type: Date, required: true },
    odometer: { type: Number, required: true },
    liters: { type: Number, required: true },
    unitPrice: { type: Number },
    price: { type: Number, required: true },
    location: { type: String },
    fuelType: { type: String, default: 'benzin'},
    consumption: { type: Number }
}, {
    timestamps: true
});

module.exports = mongoose.model('FuelEntry', fuelEntrySchema);