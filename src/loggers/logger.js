import winston from "winston";
import * as dotenv from "dotenv";
import __dirname from "../utils.js";
import path from "path";

dotenv.config();

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

// desarrollo debe loggear a partir del nivel debug sólo en consola
const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});
// producción debe loggear a partir del nivel info sólo en consola y enviar en un transporte de archivos a partir del nivel error
const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "/logs/errors.log"),
      level: "error",
    }),
  ],
});

// middleware
const currentEnv = process.env.NODE_ENV || "development";

export const addLogger = (req, res, next) => {
  if (currentEnv === "development") {
    req.logger = devLogger;
  } else {
    req.logger = prodLogger;
  }
  req.logger.http(`${req.url} - method: ${req.method} - ${new Date().toLocaleTimeString()}`);
  next();
};
