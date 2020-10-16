const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOSTNAME: process.env.CLOUDAMQP_MQTT_HOSTNAME,
  PORT: process.env.CLOUDAMQP_MQTT_PORT,
  PORT_TLS: process.env.CLOUDAMQP_MQTT_PORT_TLS,
  USERNAME: process.env.CLOUDAMQP_MQTT_USERNAME,
  PASSWORD: process.env.CLOUDAMQP_MQTT_PASSWORD
}