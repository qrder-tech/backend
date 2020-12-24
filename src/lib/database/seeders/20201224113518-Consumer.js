const md5 = require('md5');
const moment = require('moment');
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Consumers', [{
      uuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
      name: 'John',
      surname: 'Doe',
      email: 'john_doe@postman.com',
      phoneNumber: '555-55-55',
      balance: 100,
      img: 'https://www.nicepng.com/png/detail/186-1866063_dicks-out-for-harambe-sample-avatar.png',
      username: 'postman',
      password: md5('postman'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'eaeacebc-2d3a-4c4a-af04-341557785b79',
      name: 'Hannah',
      surname: 'O\'Conner',
      email: 'hannah.oconner@dummy.com',
      phoneNumber: '555-55-54',
      balance: 0,
      img: null,
      username: 'hoconner',
      password: md5('hoconner'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'a7283685-f14f-4b08-88ac-5ca7def3ae21',
      name: 'Berta',
      surname: 'O\'Conner',
      email: 'berta.oconner@dummy.com',
      phoneNumber: '555-55-53',
      balance: 0,
      img: null,
      username: 'boconner',
      password: md5('boconner'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Consumers', null, {});
  },
};
