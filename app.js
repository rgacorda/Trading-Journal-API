const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');


//INIT
dotenv.config();
const app = express();

//MIDDLEWARE
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true 
  }));
app.use(express.json());
app.use(cookieParser());

//ROUTES
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);




//DB and PORT server
const PORT = process.env.PORT;
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to DB:', err);
});


