'use strict';
const md5 = require('md5');
const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants', [{
      uuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      name: 'Bilkent Kebab',
      address: 'Bilkent Merkez Kampüs, Çankaya/ANKARA',
      email: 'kebab@bilkent.com',
      phoneNumber: '555-00-00',
      serviceType: 'normal',
      username: 'postman',
      password: md5('postman'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      name: 'Blue Jay',
      address: 'Ankuva Avm, Çankaya/ANKARA',
      phoneNumber: '555-00-01',
      email: 'bluejay@ankuva.com',
      serviceType: 'self',
      username: 'bluejay',
      password: md5('bluejay'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {});
  }
};
