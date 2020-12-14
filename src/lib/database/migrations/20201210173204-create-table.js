module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tables', {
      uuid: {
        primaryKey: true,
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      services: {
        type: Sequelize.STRING,
        allowNull: true,
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
  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.dropTable('Tables');
  },
};
