// const { v4: uuid } = require('uuid');
const moment = require('moment');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Offers', [{
      uuid: '0ac45eb1-3da8-4b18-aeac-35942c9a95e1',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      img: 'https://image.freepik.com/free-vector/american-food-horizontal-banner-template_23-2148810335.jpg',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: '5b49ebc2-c630-46a2-8ee9-4d888d93c99c',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      img: 'https://image.freepik.com/free-vector/american-food-banners_23-2148633784.jpg',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'fa5aee21-a576-4b53-8b8a-0eacd83c6dfc',
      restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      img: 'https://image.freepik.com/free-vector/breakfast-banner-template_23-2148591442.jpg',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'bd9ecb54-6e51-4f86-a207-bedf9f46aa05',
      restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      img: 'https://www.azfoodandwine.com/wp-content/uploads/2018/06/happy_hour_400x800_webtile.jpg',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Offers', null, {});
  },
};
