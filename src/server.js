import http from 'http';
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import logger from "morgan";
import passport from "passport";
import path from "path";

import authenticationMiddleware from "./lib/auth/middleware";
import JwtPassportStrategy from "./lib/auth/jwt-strategy";
import { initializeRoutes, initializeErrorHandlers } from "./routes";

// Setup express
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Setup passport
app.use(passport.initialize());
passport.use(JwtPassportStrategy);
app.use(authenticationMiddleware);

// Custom middlewares
app.use((req, res, next) => {
  console.log("Time:", new Date());
  next();
});

// Setup routes and error catch
initializeRoutes(app);
initializeErrorHandlers(app);

// Setup server
const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});