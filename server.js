const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// Connect to MongoDB directly
mongoose.connect('mongodb://localhost:27017/projet_cc2')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Load routers
const clients = require('./routes/clientRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');

// Mount routers
app.use('/api/clients', clients);
app.use('/api/products', products);
app.use('/api/orders', orders);

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
