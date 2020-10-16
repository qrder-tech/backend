const url = require('url');
const parsed = process.env.CLEARDB_DATABASE_URL && url.parse(process.env.CLEARDB_DATABASE_URL);

module.exports = {
  development: {
    "username": "root",
    "password": "bilkent",
    "database": "qrder_api",
    "host": "qrder_db",
    "dialect": "mysql"
  },
  test: {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    "username": parsed && parsed.auth.split(":")[0],
    "password": parsed && parsed.auth.split(":")[1],
    "database": parsed && parsed.pathname.slice(1),
    "host": parsed && parsed.hostname,
    "dialect": "mysql"
  }
};