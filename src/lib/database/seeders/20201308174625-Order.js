const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Orders', [{
    uuid: '0dd93f2b-3c59-4f60-9b4c-733d8733f0f9',
    tableUuid: "af92bacf-a01a-4903-99d6-2887359c1d23",
    items: [
      {
        "uuid": "527e7794-254a-4385-af20-90314dcfda9c",
        "metadata": "1;1;1",
        "quantity": 1
      },
      {
        "uuid": "c49532af-3256-442f-9f0d-aa4300e7c400",
        "metadata": "1",
        "quantity": 2
      }
    ].map(item => JSON.stringify(item)).join(', '),
    isPaid: false,
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    userUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: uuid(),
    tableUuid: "af92bacf-a01a-4903-99d6-2887359c1d23",
    items: [
      {
        "uuid": "527e7794-254a-4385-af20-90314dcfda9c",
        "metadata": "1;1;1",
        "quantity": 1
      },
    ].map(item => JSON.stringify(item)).join(', '),
    isPaid: true,
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    userUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: '08f025b6-3e73-4fe1-a243-fcaeec227d9f',
    tableUuid: "af92bacf-a01a-4903-99d6-2887359c1d23",
    items: [
      {
        "uuid": "c49532af-3256-442f-9f0d-aa4300e7c400",
        "metadata": "1",
        "quantity": 2
      }
    ].map(item => JSON.stringify(item)).join(', '), 
    isPaid: true,
    restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
    userUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Orders', null, {})
};
