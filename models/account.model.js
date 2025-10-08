module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Account", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // platform: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      }
    },
    isAnalyticsIncluded: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isCommissionsIncluded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
