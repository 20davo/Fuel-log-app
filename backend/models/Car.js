const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  engine: { type: String },
  plate: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);
