import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../../config';

const dirname = `${__dirname}/../../models`;
const db = {};

// init sequelize
const sequelize = new Sequelize(
  config.sequelize.database,
  config.sequelize.username,
  config.sequelize.password,
  config.sequelize,
);

sequelize.authenticate({ logging: console.log }).then(() => {
  console.log('📚 Database connection has been established successfully');
}).catch((error) => {
  console.error('🔶 Unable to connect to the database:', { name: error.name, parent: error.parent });
});

// init models
fs.readdirSync(dirname).filter((file) => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js')).forEach((file) => {
  const model = require(path.join(dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;