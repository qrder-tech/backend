const url = require('url');

const env = process.env.NODE_ENV || "development";

if (env === 'production') {
  const parsed = process.env.CLEARDB_DATABASE_URL && url.parse(process.env.CLEARDB_DATABASE_URL);
  
  module.exports = {
    "username": parsed && parsed.auth.split(":")[0],
    "password": parsed && parsed.auth.split(":")[1],
    "database": parsed && parsed.pathname.slice(1),
    "host": parsed && parsed.hostname,
    "dialect": "mysql"
  }
} else {
  module.exports = {
    "username": process.env.MYSQL_ROOT_USERNAME,
    "password": process.env.MYSQL_ROOT_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql"
  }
}