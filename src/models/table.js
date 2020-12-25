const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Table.belongsTo(models.Restaurant, { foreignKey: 'restaurantUuid' });
      Table.hasMany(models.Order, { foreignKey: 'tableUuid' });
    }
  }
  Table.init({
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
      type: DataTypes.STRING,
    },
    status: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        isIn: [[null, 'occupied']],
      },
    },
    services: {
      allowNull: true,
      type: DataTypes.STRING,
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
    modelName: 'Table',
  });
  return Table;
};
