module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subtopics', {
      uuid: {
        primaryKey: true,
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Subtopics');
  },
};
