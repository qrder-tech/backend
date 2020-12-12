const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Items', [{
    uuid: uuid(),
    name: 'Adana Kebab',
    price: 18.00,
    desc: 'Real adana kebab from adana to bilkent',
    img: '',
    subtopicUuid: '26bc78e9-05fd-454c-99ad-18d479aa8ad9',
    restaurantUuid: "56bc78e9-05fd-454c-99ad-18d479aa8ad9",
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: 'c49532af-3256-442f-9f0d-aa4300e7c400',
    name: 'Lehmacun',
    price: 10.00,
    desc: 'Lehmacun from anteb to bilkent',
    img: '',
    metadata: 'aci',
    subtopicUuid: '5339690e-dfa1-4c6b-9e19-45c182d2b66b',
    restaurantUuid: "56bc78e9-05fd-454c-99ad-18d479aa8ad9",
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: '527e7794-254a-4385-af20-90314dcfda9c',
    name: 'SSK Dürüm',
    price: 10.00,
    desc: 'ASPAVA Wrap',
    img: '',
    metadata: 'sos;sogan;sarimsak',
    subtopicUuid: '5339690e-dfa1-4c6b-9e19-45c182d2b66b',
    restaurantUuid: "56bc78e9-05fd-454c-99ad-18d479aa8ad9",
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: uuid(),
    name: 'Hamburger',
    price: 25.00,
    desc: 'simple hamburger',
    img: '',
    subtopicUuid: '5339690e-dfa1-4c6b-9e19-45c182d2b66b',
    restaurantUuid: "56bc78e9-05fd-454c-99ad-18d479aa8ad9",
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Items', null, {})
};
