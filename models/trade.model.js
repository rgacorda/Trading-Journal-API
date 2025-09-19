module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Trade", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    side: {
      type: DataTypes.ENUM("long", "short"),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entry: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    exit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    // setup: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // plan: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mistakes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    realized: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    security: {
      type: DataTypes.ENUM("stock"),
      allowNull: false,
      defaultValue: "stock",
    },
    broker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Plans",
        key: "id",
      },
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Accounts",
        key: "id"
      }
    }
  });
};
