const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('client')
      .populate('produits.produit');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client')
      .populate('produits.produit');
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    let montantTotal = req.body.montantTotal;
    

    if (!montantTotal && req.body.produits) {
      montantTotal = 0;
      for (const item of req.body.produits) {
        const product = await Product.findById(item.produit);
        if (product) {
          montantTotal += product.prix * item.quantite;
        }
      }
      req.body.montantTotal = montantTotal;
    }

    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('client')
      .populate('produits.produit');
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.status(200).json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
