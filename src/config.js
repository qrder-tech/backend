import dotenv from "dotenv";
import databaseConfig from "../config/database.config.json";
// import mailConfig from '../config/mail.config.json';

dotenv.config();
const env = process.env.NODE_ENV || "development";
console.log("🔷 NODE_ENV:", env);

export default {
  sequelize: databaseConfig[env],
  JWT_SECRET: process.env.JWT_SECRET,
};
