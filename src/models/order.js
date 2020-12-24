'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Consumer, { foreignKey: 'consumerUuid' });
      Order.belongsTo(models.Restaurant, { foreignKey: 'restaurantUuid' });
      Order.belongsTo(models.Table, { foreignKey: 'tableUuid' });
      Order.belongsToMany(models.Item, { through: models.OrderItems, foreignKey: 'orderUuid' });
    }
  };
  Order.init({
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
    },
    no: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      allowNull: false,
      defaultValue: 'waiting',
      type: DataTypes.STRING,
      validate: {
        isIn: [['waiting', 'served', 'paid']]
      }
    },
    restaurantUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Restaurants',
        key: 'uuid',
        as: 'restaurantUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    tableUuid: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'Tables',
        key: 'uuid',
        as: 'tableUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    consumerUuid: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'Consumers',
        key: 'uuid',
        as: 'consumerUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};