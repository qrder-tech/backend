const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Services', [{
    uuid: uuid(),
    tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d03',
    name: 'garson',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: uuid(),
    tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d03',
    name: 'siparis',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: uuid(),
    tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d03',
    name: 'siparis2',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Services', null, {}),
};
