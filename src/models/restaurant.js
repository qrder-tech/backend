const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurant.hasMany(models.Table, { foreignKey: 'restaurantUuid' });
      Restaurant.hasMany(models.Item, { foreignKey: 'restaurantUuid' });
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantUuid' });
      Restaurant.hasMany(models.Offer, { foreignKey: 'restaurantUuid' });
    }
  }
  Restaurant.init({
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    serviceType: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [['normal', 'self']],
      },
    },
    img: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};
