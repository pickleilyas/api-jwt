const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const JWT_SECRET = process.env.JWT_SECRET || 'api-jwt-secret-key';

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role?.name || 'consultation'
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function safeUser(user) {
  return {
    _id: user._id,
    nomComplet: user.nomComplet,
    email: user.email,
    role: user.role
  };
}

exports.register = async (req, res) => {
  try {
    const { nomComplet, email, password, roleName } = req.body;

    if (!nomComplet || !email || !password) {
      return res.status(400).json({ message: 'nomComplet, email et password sont obligatoires' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur deja existant' });
    }

    const consultationRole = await Role.findOne({ name: 'consultation' });
    const isAdminRequester = req.user?.role?.name === 'admin';
    const requestedRoleName = typeof roleName === 'string' ? roleName.toLowerCase() : null;
    const targetRoleName = isAdminRequester && requestedRoleName ? requestedRoleName : 'consultation';
    const role = await Role.findOne({ name: targetRoleName }) || consultationRole;

    if (!role) {
      return res.status(500).json({ message: 'Aucun role disponible pour la creation utilisateur' });
    }

    const user = await User.create({
      nomComplet,
      email: email.toLowerCase(),
      password,
      role: role._id
    });

    const createdUser = await User.findById(user._id).populate('role');

    res.status(201).json({
      message: 'Utilisateur cree avec succes',
      user: safeUser(createdUser)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email et password sont obligatoires' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('role');

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = createToken(user);

    res.status(200).json({
      message: 'Connexion reussie',
      token,
      user: safeUser(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: 'roleId est obligatoire' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role non trouve' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role._id },
      { new: true }
    ).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }

    res.status(200).json({
      message: 'Role utilisateur mis a jour',
      user: safeUser(user)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};