const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  quantiteStock: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);
