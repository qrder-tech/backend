const md5 = require('md5');
const moment = require('moment');
// const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Restaurants', [{
      uuid: '56bc78e9-05fd-454c-99ad-18d479aa8ad9',
      name: 'Bilkent Kebab',
      address: 'Bilkent Merkez Kampüs, Çankaya/ANKARA',
      email: 'kebab@bilkent.com',
      phoneNumber: '555-00-00',
      serviceType: 'normal',
      img: 'https://media.istockphoto.com/vectors/doner-kebab-logo-templates-vector-id954909832?k=6&m=954909832&s=170667a&w=0&h=p6TolMJV5CRTBv0LmUWjiGjI0GnZcY1vR4VB5_7KY9M=',
      username: 'postman',
      password: md5('postman'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, {
      uuid: 'b239690e-dfa1-4c6b-9e19-45c182d2b66b',
      name: 'Blue Jay',
      address: 'Ankuva Avm, Çankaya/ANKARA',
      phoneNumber: '555-00-01',
      email: 'bluejay@ankuva.com',
      serviceType: 'self',
      img: 'https://img.freepik.com/free-vector/coffee-shop-badge-vintage-style_1176-95.jpg?size=626&ext=jpg',
      username: 'bluejay',
      password: md5('bluejay'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Restaurants', null, {});
  },
};
