const express = require('express');
const bodyParser = require('body-parser');
const session = require('./config/auth/session');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const { setPermissions } = require('./middlewares/rbac.middleware');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(session);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

setPermissions({
  free: ['read:own-profile'],
  silver: ['read:data'],
  gold: ['read:data', 'write:data']
});

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
  }
})();
