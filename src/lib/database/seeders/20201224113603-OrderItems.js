'use strict';
const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('OrderItems', [{
      orderUuid: '0dd93f2b-3c59-4f60-9b4c-733d8733f0f9',
      itemUuid: 'c49532af-3256-442f-9f0d-aa4300e7c400',
      options: 'salata',
      quantity: 1,
    }, {
      orderUuid: '0dd93f2b-3c59-4f60-9b4c-733d8733f0f9',
      itemUuid: '4de77898-70eb-49a2-80ca-583fd3d3ba84',
      options: '',
      quantity: 1,
    }, {
      orderUuid: '08f025b6-3e73-4fe1-a243-fcaeec227d9f',
      itemUuid: '527e7794-254a-4385-af20-90314dcfda9c',
      options: 'acili;maydanoz',
      quantity: 1,
    }, {
      orderUuid: '08f025b6-3e73-4fe1-a243-fcaeec227d9f',
      itemUuid: '527e7794-254a-4385-af20-90314dcfda9c',
      options: 'maydanoz',
      quantity: 1,
    }, {
      orderUuid: '08f025b6-3e73-4fe1-a243-fcaeec227d9f',
      itemUuid: '4de77898-70eb-49a2-80ca-583fd3d3ba84',
      options: '',
      quantity: 1,
    }, {
      orderUuid: '5627b0a6-0e67-42db-8cd7-eccc5ee7958a',
      itemUuid: 'c49532af-3256-442f-9f0d-aa4300e7c400',
      options: 'sumakli sogan',
      quantity: 1,
    }, {
      orderUuid: '5627b0a6-0e67-42db-8cd7-eccc5ee7958a',
      itemUuid: '4de77898-70eb-49a2-80ca-583fd3d3ba84',
      options: '',
      quantity: 1,
    }, {
      orderUuid: 'ea6ef736-177d-434b-beff-2593460fcb6d',
      itemUuid: '527e7794-254a-4385-af20-90314dcfda9c',
      options: 'acili',
      quantity: 1,
    }, {
      orderUuid: 'ea6ef736-177d-434b-beff-2593460fcb6d',
      itemUuid: '4de77898-70eb-49a2-80ca-583fd3d3ba84',
      options: '',
      quantity: 1,
    }, {
      orderUuid: 'e5c4e909-045d-4fe1-ad65-a9a29963a166',
      itemUuid: '4de77898-70eb-49a2-80ca-583fd3d3ba84',
      options: '',
      quantity: 1,
    }, {
      orderUuid: '59b5c77d-2434-4367-9f01-bf75fb3be55f',
      itemUuid: '26bc78e9-05fd-454c-99ad-18d479aa8ad9',
      options: '',
      quantity: 2,
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {});
  }
};
