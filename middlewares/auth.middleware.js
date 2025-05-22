const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = 
    req.cookies?.token || // from Next.js browser
    req.headers.authorization?.split(' ')[1]; // from mobile app

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
