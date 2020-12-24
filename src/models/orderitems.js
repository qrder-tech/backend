'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItems.belongsTo(models.Order, { foreignKey: 'orderUuid' });
      OrderItems.belongsTo(models.Item, { foreignKey: 'itemUuid' });
    }
  };
  OrderItems.init({
    orderUuid: {
      allowNull: false,
      primaryKey: 'true',
      type: DataTypes.UUID,
      references: {
        model: 'Orders',
        key: 'uuid',
        as: 'orderUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    itemUuid: {
      allowNull: false,
      primaryKey: 'true',
      type: DataTypes.UUID,
      references: {
        model: 'Items',
        key: 'uuid',
        as: 'itemUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    options: {
      allowNull: false,
      primaryKey: 'true',
      type: DataTypes.STRING
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'OrderItems',
    timestamps: false
  });
  return OrderItems;
};