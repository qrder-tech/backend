const moment = require('moment');
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Items', [{
      uuid: 'c49532af-3256-442f-9f0d-aa4300e7c400',
      name: 'Adana Kebab',
      desc: 'Real adana kebab from adana to bilkent',
      type: 'ana yemek',
      options: 'sumakli sogan;salata',
      price: 35.00,
      img: null,
      enabled: true,
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '527e7794-254a-4385-af20-90314dcfda9c',
      name: 'Lehmacun',
      desc: 'Lehmacun from anteb to bilkent',
      type: 'ara sicak',
      options: 'acili;maydanoz',
      price: 12.00,
      img: null,
      enabled: true,
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '4de77898-70eb-49a2-80ca-583fd3d3ba84',
      name: 'Kola',
      desc: null,
      type: 'soguk icecekler',
      options: null,
      price: 8.00,
      img: null,
      enabled: true,
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '26bc78e9-05fd-454c-99ad-18d479aa8ad9',
      name: 'Filtre Kahve',
      desc: null,
      type: 'filtrelenmis kahveler',
      options: 'süt',
      price: 15.00,
      img: null,
      enabled: true,
      restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Items', null, {});
  },
};
