
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Table.belongsTo(models.Restaurant, { as: 'Tables', foreignKey: 'restaurantUuid' });
      Table.hasMany(models.Order, { as: 'RecentOrders', foreignKey: 'tableUuid' });
      Table.hasMany(models.Service, { as: 'Services', foreignKey: 'tableUuid' });

    }
  };
  Table.init({
    uuid: {
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
    restaurantUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Restaurants',
        key: 'uuid',
        as: 'restaurantUuid'
      },
      
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Table',
  });
  return Table;
};