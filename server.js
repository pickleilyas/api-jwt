const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const Client = require('./models/Client');
const Role = require('./models/Role');
const User = require('./models/User');

const defaultRoles = [
  {
    name: 'admin',
    description: 'Acces complet a toutes les ressources',
    permissions: {
      clients: { create: true, read: true, update: true, delete: true },
      products: { create: true, read: true, update: true, delete: true },
      orders: { create: true, read: true, update: true, delete: true }
    }
  },
  {
    name: 'commercial',
    description: 'Gestion des clients et des commandes',
    permissions: {
      clients: { create: true, read: true, update: true, delete: false },
      products: { create: false, read: true, update: false, delete: false },
      orders: { create: true, read: true, update: true, delete: false }
    }
  },
  {
    name: 'magasinier',
    description: 'Gestion du stock et consultation des commandes',
    permissions: {
      clients: { create: false, read: true, update: false, delete: false },
      products: { create: true, read: true, update: true, delete: false },
      orders: { create: false, read: true, update: false, delete: false }
    }
  },
  {
    name: 'consultation',
    description: 'Consultation seule des donnees',
    permissions: {
      clients: { create: false, read: true, update: false, delete: false },
      products: { create: false, read: true, update: false, delete: false },
      orders: { create: false, read: true, update: false, delete: false }
    }
  }
];

async function seedDefaults() {
  for (const roleData of defaultRoles) {
    await Role.findOneAndUpdate(
      { name: roleData.name },
      roleData,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }

  const adminRole = await Role.findOne({ name: 'admin' });
  const commercialRole = await Role.findOne({ name: 'commercial' });
  const magasinierRole = await Role.findOne({ name: 'magasinier' });
  const consultationRole = await Role.findOne({ name: 'consultation' });

  const seededUsers = [
    {
      email: 'admin@api-jwt.local',
      nomComplet: 'Admin API',
      password: 'Admin123!',
      role: adminRole
    },
    {
      email: 'commercial@api-jwt.local',
      nomComplet: 'Commercial API',
      password: 'Commer123!',
      role: commercialRole
    },
    {
      email: 'magasinier@api-jwt.local',
      nomComplet: 'Magasinier API',
      password: 'Magasin123!',
      role: magasinierRole
    },
    {
      email: 'consultation@api-jwt.local',
      nomComplet: 'Consultation API',
      password: 'Consult123!',
      role: consultationRole
    }
  ];

  for (const userData of seededUsers) {
    const exists = await User.findOne({ email: userData.email });
    if (!exists && userData.role) {
      await User.create({
        nomComplet: userData.nomComplet,
        email: userData.email,
        password: userData.password,
        role: userData.role._id
      });
      console.log(`Seeded user: ${userData.email}`);
    }
  }

  if ((await Client.countDocuments()) === 0) {
    await Client.create({
      nomComplet: 'Test User',
      email: 'test@test.com',
      telephone: '000000000',
      ville: 'Test City'
    });
    console.log('Dummy client seeded!');
  }
}

// Connect to MongoDB directly
mongoose.connect('mongodb://localhost:27017/projet_cc2')
  .then(async () => {
    console.log('MongoDB Connected');
    await seedDefaults();
  })
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.json({ 
    message: "Bienvenue sur l'API REST", 
    routes: [
      "/api/auth",
      "/api/roles",
      "/api/clients",
      "/api/products",
      "/api/orders"
    ] 
  });
});

// Load routers
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const clients = require('./routes/clientRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/clients', clients);
app.use('/api/products', products);
app.use('/api/orders', orders);

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
