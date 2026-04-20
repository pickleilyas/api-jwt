exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifie' });
  }

  if (req.user.role?.name !== 'admin') {
    return res.status(403).json({ message: 'Acces reserve a l\'admin' });
  }

  return next();
};