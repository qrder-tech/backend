const moment = require('moment');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Tables', [{

    uuid: 'af92bacf-a01a-4903-99d6-2887359c1d23',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'masa',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),

  },
  {

    uuid: 'af92bacf-a01a-4903-99d6-2887359c1d43',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'masa1',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),

  },
  {

    uuid: 'af92bacf-a01a-4903-99d6-2887359c1d73',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'masa2',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),

  },
  {

    uuid: 'af92bacf-a01a-4903-99d6-2887359c1d93',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'masa3',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),

  },
  {

    uuid: 'af92bacf-a01a-4903-99d6-2887359c1d03',
    restaurantUuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
    name: 'masa4',
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),

  },
  ]),

  down: async (queryInterface/* Sequelize */) => queryInterface.bulkDelete('Tables', null, {}),
};
