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
      img: 'https://img.acunn.com/uploads/icerikler/2020/08/16/adana-kebap-tarifi9282933605f38595ea5fa8.jpg',
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
      img: 'https://cdn.yemek.com/mnresize/940/940/uploads/2020/04/lahmacun-yeni-one-cikan.jpg',
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
      img: 'https://ayb.akinoncdn.com/products/2019/01/18/1796/b792f041-5479-4d5f-a74e-233d5da474bc.jpg',
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
      img: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
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
