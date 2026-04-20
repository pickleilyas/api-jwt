const actionMap = {
  clients: ['create', 'read', 'update', 'delete'],
  products: ['create', 'read', 'update', 'delete'],
  orders: ['create', 'read', 'update', 'delete']
};

exports.authorize = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifie' });
    }

    if (req.user.role?.name === 'admin') {
      return next();
    }

    if (!actionMap[resource] || !actionMap[resource].includes(action)) {
      return res.status(500).json({ message: 'Configuration d\'autorisation invalide' });
    }

    const permissions = req.user.role?.permissions?.[resource];

    if (permissions && permissions[action]) {
      return next();
    }

    return res.status(403).json({
      message: `Acces refuse: permission ${action} sur ${resource} requise`
    });
  };
};