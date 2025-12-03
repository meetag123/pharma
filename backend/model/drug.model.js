const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
  code: { type: String, required: true},
  genericName: { type: String, required: true },
  brandName: { type: String },
  company: { type: String, required: true },
  launchDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Drug', drugSchema);