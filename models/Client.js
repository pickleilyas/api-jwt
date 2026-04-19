const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  nomComplet: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telephone: {
    type: String
  },
  ville: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Client', ClientSchema);
