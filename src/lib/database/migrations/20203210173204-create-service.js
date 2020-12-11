module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Services', {
      uuid: {
        primaryKey: true,
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Services');
  }
};