module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConsumerFavouriteRestaurants', {
      consumerUuid: {
        allowNull: false,
        primaryKey: 'true',
        type: Sequelize.UUID,
        references: {
          model: 'Consumers',
          key: 'uuid',
          as: 'consumerUuid',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      restaurantUuid: {
        allowNull: false,
        primaryKey: 'true',
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('ConsumerFavouriteRestaurants');
  },
};
