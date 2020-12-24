'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Restaurant, { foreignKey: 'restaurantUuid' });
      Item.belongsToMany(models.Order, { through: models.OrderItems, foreignKey: 'itemUuid' });
    }
  };
  Item.init({
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    desc: {
      allowNull: true,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    options: {
      allowNull: true,
      type: DataTypes.STRING
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    img: {
      allowNull: true,
      type: DataTypes.STRING
    },
    enabled: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN
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
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};