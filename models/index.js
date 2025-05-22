const sequelize = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const User = require("./user.model")(sequelize, DataTypes);
const Trade = require("./trade.model")(sequelize, DataTypes);
const Mistake = require("./mistake.model")(sequelize, DataTypes);
const Plan = require("./plan.model")(sequelize, DataTypes);
const TradeMistake = require("./trade_mistake.model")(sequelize, DataTypes);

// Add models to the db object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Mistake = Mistake;
db.Plan = Plan;
db.TradeMistake = TradeMistake;
db.Trade = Trade;

//associations
User.hasMany(Trade, { foreignKey: "userId" });
Trade.belongsTo(User, { foreignKey: "userId" });

Plan.hasOne(Trade, { foreignKey: "planId" });
Trade.belongsTo(Plan, { foreignKey: "planId" });

Trade.belongsToMany(Mistake, {
  through: TradeMistake,
  foreignKey: "tradeId",
});

Mistake.belongsToMany(Trade, {
  through: TradeMistake,
  foreignKey: "mistakeId",
});

module.exports = db;
