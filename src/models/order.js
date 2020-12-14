const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Restaurant, { as: 'Orders', foreignKey: 'restaurantUuid' });
      Order.belongsTo(models.User, { as: 'UserOrders', foreignKey: 'userUuid' });
      Order.belongsTo(models.Table, { as: 'RecentOrders', foreignKey: 'tableUuid' });
    }
  }
  Order.init({
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
    },
    items: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isPaid: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
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
    userUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'uuid',
        as: 'userUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    tableUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Tables',
        key: 'uuid',
        as: 'tableUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
