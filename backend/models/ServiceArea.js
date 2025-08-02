const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  postcode: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);
