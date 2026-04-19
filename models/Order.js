const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  dateCommande: {
    type: Date,
    default: Date.now
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true
  },
  produits: [
    {
      produit: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      quantite: {
        type: Number,
        required: true
      }
    }
  ],
  montantTotal: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Order', OrderSchema);
