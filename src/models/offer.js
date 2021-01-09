const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RestaurantOffers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RestaurantOffers.belongsTo(models.Restaurant, { foreignKey: 'restaurantUuid' });
    }
  }
  RestaurantOffers.init({
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
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
    img: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return RestaurantOffers;
};
