module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Consumers', {
      uuid: {
        allowNull: false,
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
      surname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      balance: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.FLOAT,
      },
      img: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Consumers');
  },
};
