const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConsumerFavouriteRestaurants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConsumerFavouriteRestaurants.belongsTo(models.Consumer, { foreignKey: 'consumerUuid' });
      ConsumerFavouriteRestaurants.belongsTo(models.Restaurant, { foreignKey: 'restaurantUuid' });
    }
  }
  ConsumerFavouriteRestaurants.init({
    consumerUuid: {
      allowNull: false,
      primaryKey: 'true',
      type: DataTypes.UUID,
      references: {
        model: 'Consumers',
        key: 'uuid',
        as: 'consumerUuid',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    restaurantUuid: {
      allowNull: false,
      primaryKey: 'true',
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
    modelName: 'ConsumerFavouriteRestaurants',
  });
  return ConsumerFavouriteRestaurants;
};
