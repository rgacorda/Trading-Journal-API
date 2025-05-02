const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (req, res) => {
  const { username, password, role = 'free' } = req.body;
  try {
    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash, role });
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.json({ message: 'Logged in' });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
};

exports.forgotPassword = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: `Password reset link sent to ${username}'s email` });
};
