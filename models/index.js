const sequelize = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const User = require("./user.model")(sequelize, DataTypes);
const Trade = require("./trade.model")(sequelize, DataTypes);
const Plan = require("./plan.model")(sequelize, DataTypes);
const Account = require("./account.model")(sequelize, DataTypes);
const RefreshToken = require("./token.model")(sequelize, DataTypes);

// Add models to the db object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Plan = Plan;
db.Trade = Trade;
db.Account = Account;
db.RefreshToken = RefreshToken;

//associations
User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Account, {foreignKey: "userId", onDelete: "CASCADE"});
Account.belongsTo(User, {foreignKey: "userId"});

User.hasMany(Plan, { foreignKey: "userId" });
Plan.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Trade, { foreignKey: "userId" });
Trade.belongsTo(User, { foreignKey: "userId" });

Plan.hasOne(Trade, { foreignKey: "planId" });
Trade.belongsTo(Plan, { foreignKey: "planId" });

Account.hasMany(Trade, {foreignKey: "accountId"});
Trade.belongsTo(Account, {foreignKey: "accountId"});



module.exports = db;
