import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, errors, printf, colorize } = format;

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const isProduction = process.env.NODE_ENV === "production";

const LOG_RETENTION = isProduction ? "14d" : "3d";

const logFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  const metadata =
    Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

  return `${timestamp} [${level}] ${stack || message}${metadata}`;
});

const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  logFormat,
);

const consoleFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  logFormat,
);

const logger = createLogger({
  level: isProduction ? "info" : "debug",

  format: fileFormat,

  exitOnError: false,

  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: LOG_RETENTION,
      zippedArchive: true,
    }),

    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      level: "info",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: LOG_RETENTION,
      zippedArchive: true,
    }),
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: LOG_RETENTION,
      zippedArchive: true,
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: LOG_RETENTION,
      zippedArchive: true,
    }),
  ],
});

if (!isProduction) {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    }),
  );
}

export default logger;
