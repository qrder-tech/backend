module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderItems', {
      orderUuid: {
        allowNull: false,
        primaryKey: 'true',
        type: Sequelize.UUID,
        references: {
          model: 'Orders',
          key: 'uuid',
          as: 'orderUuid',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      itemUuid: {
        allowNull: false,
        primaryKey: 'true',
        type: Sequelize.UUID,
        references: {
          model: 'Items',
          key: 'uuid',
          as: 'itemUuid',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      options: {
        allowNull: false,
        primaryKey: 'true',
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('OrderItems');
  },
};
