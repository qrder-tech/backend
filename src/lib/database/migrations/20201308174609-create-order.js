module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      uuid: {
        primaryKey: true,
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
      },
      items: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isPaid: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      restaurantUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Restaurants',
          key: 'uuid',
          as: 'restaurantUuid'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      userUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'uuid',
          as: 'userUuid'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      tableUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Tables',
          key: 'uuid',
          as: 'tableUuid'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface /* Sequelize */) => {
    await queryInterface.dropTable('Orders');
  }
};