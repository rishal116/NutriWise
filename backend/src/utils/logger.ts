import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";
import type Transport from "winston-transport";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors, colorize } = format;

const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

const isProduction = process.env.NODE_ENV === "production";

const LOG_RETENTION = isProduction ? "14d" : "3d";

/* -----------------------
   Pretty log format
----------------------- */

const readableFormat = combine(
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString =
      Object.keys(meta).length > 0
        ? ` ${JSON.stringify(meta)}`
        : "";

    return `${timestamp} [${level}]: ${stack || message}${metaString}`;
  })
);

/* -----------------------
   Console format
----------------------- */

const consoleFormat = combine(
  colorize(),
  readableFormat
);

/* -----------------------
   File transports
----------------------- */

const transportList: Transport[] = [

  new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxSize: "10m",
    maxFiles: LOG_RETENTION,
    zippedArchive: true,
    auditFile: path.join(logDir, "error-audit.json"),
    format: readableFormat
  }),

  new DailyRotateFile({
    filename: path.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "info",
    maxSize: "20m",
    maxFiles: LOG_RETENTION,
    zippedArchive: true,
    auditFile: path.join(logDir, "app-audit.json"),
    format: readableFormat
  })

];

/* -----------------------
   Console only in dev
----------------------- */

if (!isProduction) {
  transportList.unshift(
    new transports.Console({
      format: consoleFormat
    })
  );
}

/* -----------------------
   Logger
----------------------- */

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  transports: transportList,

  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: LOG_RETENTION,
      auditFile: path.join(logDir, "exceptions-audit.json"),
      format: readableFormat
    })
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: LOG_RETENTION,
      auditFile: path.join(logDir, "rejections-audit.json"),
      format: readableFormat
    })
  ]

});

export default logger;