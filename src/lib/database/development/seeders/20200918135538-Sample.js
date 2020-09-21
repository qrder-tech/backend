const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Samples', [{
    uuid: uuid(),
    firstName: 'Sample',
    lastName: 'Pepper',
    email: 'pepper@sample.com',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Samples', null, {})
};
