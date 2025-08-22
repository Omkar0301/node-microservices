const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const UserSnapshot = sequelize.define(
    'UserSnapshot',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'user_snapshots',
      timestamps: false,
    }
  );

  return UserSnapshot;
};
