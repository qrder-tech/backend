const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consumer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consumer.hasMany(models.Order, { foreignKey: 'consumerUuid' });
      Consumer.belongsToMany(models.Restaurant, { through: models.ConsumerFavouriteRestaurants, foreignKey: 'consumerUuid' });
    }
  }
  Consumer.init({
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
    surname: {
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
    balance: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.FLOAT,
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
    modelName: 'Consumer',
  });
  return Consumer;
};
