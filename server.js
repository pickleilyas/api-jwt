const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// Connect to MongoDB directly
mongoose.connect('mongodb://localhost:27017/projet_cc2')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Auto-seed some data if empty
    const Client = require('./models/Client');
    if ((await Client.countDocuments()) === 0) {
      await Client.create({
        nomComplet: "Test User",
        email: "test@test.com",
        telephone: "000000000",
        ville: "Test City"
      });
      console.log('Dummy data seeded! The routes will now return something.');
    }
  })
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.json({ 
    message: "Bienvenue sur l'API REST", 
    routes: [
      "/api/clients",
      "/api/products",
      "/api/orders"
    ] 
  });
});

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
