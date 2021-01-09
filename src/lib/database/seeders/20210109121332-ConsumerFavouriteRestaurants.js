// const { v4: uuid } = require('uuid');
const moment = require('moment');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('ConsumerFavouriteRestaurants', [{
      consumerUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
      restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      consumerUuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
      restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      consumerUuid: 'eaeacebc-2d3a-4c4a-af04-341557785b79',
      restaurantUuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ConsumerFavouriteRestaurants', null, {});
  },
};
