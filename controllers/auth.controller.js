const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const cookieConfig = require('../config/cookie'); 

exports.register = async (req, res) => {
    const { email, password, firstname, lastname, middlename, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await User.create({
        email,
        password: hashedPassword,
        firstname,
        lastname,
        middlename,
        phone,
        role: 'free'
      });
  
      const token = generateToken(user);
      res.cookie('token', token, cookieConfig);
      return res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError' && err.errors[0].path === 'email') {
        return res.status(409).json({ message: 'Email already exists.' });
      }
  
      console.error('User creation error:', err);
      res.status(400).json({ message: 'User creation failed', error: err.message });
    }
  };
  

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.cookie('token', token, cookieConfig);
        return res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
    }
};
