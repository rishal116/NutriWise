import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";
import type Transport from "winston-transport";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors, colorize } = format;

const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

const LOG_RETENTION =
  process.env.NODE_ENV === "production" ? "14d" : "3d";

const isProduction = process.env.NODE_ENV === "production";

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString =
    Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${stack || message}${metaString}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
  format.json()
);

const transportList: Transport[] = [
  new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxSize: "10m",
    maxFiles: LOG_RETENTION,
    zippedArchive: true,
  }),

  new DailyRotateFile({
    filename: path.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: LOG_RETENTION,
    zippedArchive: true,
  }),
];

if (!isProduction) {
  transportList.unshift(
    new transports.Console({
      format: devFormat,
    })
  );
}

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: isProduction ? prodFormat : devFormat,
  transports: transportList,

  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: LOG_RETENTION,
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: LOG_RETENTION,
    }),
  ],
});


export default logger;