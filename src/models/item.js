const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.Subtopic, { as: 'Items', foreignKey: 'subtopicUuid' });
      Item.belongsTo(models.Restaurant, { as: 'restaurantItems', foreignKey: 'restaurantUuid' });

    }
  };
  Item.init({
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
    price: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    desc: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    img: {
      allowNull: true,
      type: DataTypes.STRING
    },
    metadata: {
      allowNull: true,
      type: DataTypes.STRING
    },
    subtopicUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Subtopics',
        key: 'uuid',
        as: 'subtopicUuid'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
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
    modelName: 'Item',
  });
  return Item;
};