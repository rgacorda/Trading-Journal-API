const permissions = require("../config/permissions");

function roleMiddleware(requiredPermission) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;
    if (!userRole) {
      return res.status(401).json({ message: "User role not found" });
    }
    const allowedPermissions = permissions[userRole] || [];
    if (allowedPermissions.includes(requiredPermission)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Forbidden: insufficient permissions" });
  };
}

module.exports = roleMiddleware;
