const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models");


//AUTO DB
require("./cron/cleanupTokens");

//INIT
dotenv.config();
const app = express();

//MIDDLEWARE
const allowedOrigins = [
  'http://localhost:3000',   
  'https://trade2learn.site',
  'http://trade2learn.site',
];
if (process.env.NODE_ENV !== 'development') {
  console.log("CORS is enabled");
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      exposedHeaders: ['set-cookie']
    })
  );
} else {
  console.log("CORS is disabled for development");
}
app.use(express.json());
app.use(cookieParser());


//ROUTES
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
const tradeRoutes = require("./routes/trade.routes");
app.use("/trade", tradeRoutes);
const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);
const planRoutes = require("./routes/plan.routes");
app.use("/plan", planRoutes);
const accountRoutes = require("./routes/account.routes");
app.use("/account", accountRoutes);

//DB and PORT server
const PORT = process.env.PORT;
db.sequelize
  .sync({alter: true})
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to DB:", err);
  });
