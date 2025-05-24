module.exports = (sequelize, DataTypes) => {
    return sequelize.define("TradeMistake", {
      tradeId: {
        type: DataTypes.UUID,
        references: {
          model: "Trades",
          key: "id",
        },
        primaryKey: true,
      },
      mistakeId: {
        type: DataTypes.UUID,
        references: {
          model: "Mistakes",
          key: "id",
        },
        primaryKey: true,
      },
    });
  };
  