import dotenv from "dotenv";
import databaseConfig from "../config/database.config";
import mqttConfig from "../config/mqtt.config";
// import mailConfig from '../config/mail.config.json';

dotenv.config();
const env = process.env.NODE_ENV || "development";
console.log("🔷 NODE_ENV:", env);

if (!process.env.JWT_SECRET) {
  console.log("❌ Please control your environment variables! (JWT_SECRET is empty)");
  process.exit(1);
}

if (!process.env.CLOUDAMQP_MQTT_HOSTNAME) {
  console.log("❌ Please control your environment variables! (CLOUDAMQP_MQTT_HOSTNAME is empty)");
  //process.exit(1);
}

export default {
  db: databaseConfig,
  env,
  mqtt: mqttConfig,
  JWT_SECRET: process.env.JWT_SECRET,
  timestamp: {
    updatedAt: Date.now()
  }
};
