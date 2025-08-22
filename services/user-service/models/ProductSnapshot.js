const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  const ProductSnapshot = sequelize.define(
    'ProductSnapshot',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      tableName: 'product_snapshots',
      timestamps: false,
      indexes: [
        {
          fields: ['userId'],
        },
      ],
    }
  );

  return ProductSnapshot;
};
