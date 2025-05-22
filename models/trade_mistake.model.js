module.exports = (sequelize, DataTypes) => {
    return sequelize.define("TradeMistake", {
      tradeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Trades",
          key: "id",
        },
        primaryKey: true,
      },
      mistakeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Mistakes",
          key: "id",
        },
        primaryKey: true,
      },
    });
  };
  