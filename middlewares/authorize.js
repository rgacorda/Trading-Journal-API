const permissions = require('../config/permissions');

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user;
    const role = user?.role;

    if (!role || !permissions[role]?.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};

module.exports = authorize;
