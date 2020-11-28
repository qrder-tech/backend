const md5 = require('md5');
const moment = require('moment');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface /* Sequelize */) => queryInterface.bulkInsert('Users', [{
    uuid: uuid(),
    name: 'Sample',
    surname: 'Pepper',
    email: 'pepper@sample.com',
    username: 'pepper',
    password: md5('sample'),
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    uuid: '3d9b7b60-741f-45aa-b94a-68daa30b7ea6',
    name: 'John',
    surname: 'Doe',
    email: 'john_doe@postman.com',
    username: 'postman',
    password: md5('postman'),
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }], {}),
  down: async (queryInterface /* Sequelize */) => queryInterface.bulkDelete('Users', null, {})
};
