const md5 = require('md5');
const moment = require('moment');
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Restaurants', [{
    uuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'Bilkent Kebab',
    address: 'Bilkent Merkez Kampüs, Çankaya/ANKARA',
    phoneNumber: '(0312) 266 00 00',
    email: 'kebab@bilkent.com',
    username: 'postman',
    password: md5('postman'),
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
    name: 'Lokal 71',
    address: 'Ankuva Avm, Çankaya/ANKARA',
    phoneNumber: '(0312) 266 00 00',
    email: 'lokal71@ankuva.com',
    username: 'lokal71',
    password: md5('lokal71'),
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Restaurants', null, {})
};
