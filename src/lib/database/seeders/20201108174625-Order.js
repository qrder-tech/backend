const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Orders', [{
    uuid: uuid(),
    items: '',
    isPaid: true,
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    userUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Orders', null, {})
};
