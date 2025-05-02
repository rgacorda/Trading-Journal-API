const rolePermissions = { free: [], silver: [], gold: [] };

exports.authorize = (permission) => {
    return (req, res, next) => {
        const role = req.session.user?.role;
        const permissions = rolePermissions[role] || [];
        if (!permissions.includes(permission)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

exports.setPermissions = (map) => Object.assign(rolePermissions, map);