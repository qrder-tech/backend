const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Service.belongsTo(models.Table, { as: 'Services', foreignKey: 'tableUuid' });
    }
  }
  Service.init({
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
    modelName: 'Service',
  });
  return Service;
};
