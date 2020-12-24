'use strict';
const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tables', [{
      uuid: 'af92bacf-a01a-4903-99d6-2887359c1d23',
      name: 'A1',
      status: 'occupied',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '99ead805-8428-430b-be2b-ffdc31f6ee63',
      name: 'A2',
      status: null,
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: uuid(),
      name: 'B1',
      status: null,
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tables', null, {});
  }
};
