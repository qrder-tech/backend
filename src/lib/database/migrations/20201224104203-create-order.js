module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
      },
      no: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      status: {
        allowNull: false,
        defaultValue: 'waiting',
        type: Sequelize.STRING,
        validate: {
          isIn: [['waiting', 'served', 'paid']],
        },
      },
      restaurantUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Restaurants',
          key: 'uuid',
          as: 'restaurantUuid',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      tableUuid: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Tables',
          key: 'uuid',
          as: 'tableUuid',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      consumerUuid: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Consumers',
          key: 'uuid',
          as: 'consumerUuid',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      deviceId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Orders');
  },
};
