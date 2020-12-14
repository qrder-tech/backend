// const md5 = require('md5');
const moment = require('moment');
// const { v4: uuid } = require('uuid');
module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Subtopics', [{
    uuid: '26bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'corba',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: '5339690e-dfa1-4c6b-9e19-45c182d2b66b',
    name: 'anayemek',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    uuid: '5334690e-dfa1-4c6b-9e19-45c182d2b66b',
    name: 'icecek',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Subtopics', null, {}),
};
