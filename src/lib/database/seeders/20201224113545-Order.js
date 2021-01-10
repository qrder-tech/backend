const moment = require('moment');
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Orders', [{
      uuid: '0dd93f2b-3c59-4f60-9b4c-733d8733f0f9',
      status: 'waiting',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d23',
      consumerUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '08f025b6-3e73-4fe1-a243-fcaeec227d9f',
      status: 'served',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d23',
      consumerUuid: 'eaeacebc-2d3a-4c4a-af04-341557785b79',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '5627b0a6-0e67-42db-8cd7-eccc5ee7958a',
      status: 'paid',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      tableUuid: 'af92bacf-a01a-4903-99d6-2887359c1d23',
      consumerUuid: 'a7283685-f14f-4b08-88ac-5ca7def3ae21',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'ea6ef736-177d-434b-beff-2593460fcb6d',
      status: 'paid',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      tableUuid: '99ead805-8428-430b-be2b-ffdc31f6ee63',
      consumerUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
      createdAt: '2020-12-23 12:05:17',
      updatedAt: '2020-12-23 14:13:28',
    }, {
      uuid: 'e5c4e909-045d-4fe1-ad65-a9a29963a166',
      status: 'waiting',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      tableUuid: '99ead805-8428-430b-be2b-ffdc31f6ee63',
      consumerUuid: 'a7283685-f14f-4b08-88ac-5ca7def3ae21',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '59b5c77d-2434-4367-9f01-bf75fb3be55f',
      status: 'waiting',
      restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      tableUuid: null,
      consumerUuid: null,
      deviceId: 1,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
