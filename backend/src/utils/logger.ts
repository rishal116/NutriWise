import fs from "fs";
import path from "path";

import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, errors, printf, colorize } = format;

// CONFIG
const isProduction = process.env.NODE_ENV === "production";

const logDirectory = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logRetention = isProduction ? "14d" : "3d";

// FORMATS
const logFormatter = printf(
  ({ timestamp, level, message, stack, service, ...meta }) => {
    const metadata =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : "";

    const serviceName = service ? `[${service}] ` : "";

    return `${timestamp} ${serviceName}[${level}] ${stack ?? message}${metadata}`;
  },
);

const fileFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  errors({
    stack: true,
  }),
  logFormatter,
);

const consoleFormat = combine(
  colorize(),
  timestamp({
    format: "HH:mm:ss",
  }),
  errors({
    stack: true,
  }),
  logFormatter,
);

// LOGGER
const logger = createLogger({
  level: isProduction ? "info" : "debug",
  defaultMeta: {
    service: "nutriwise-backend",
  },
  format: fileFormat,
  exitOnError: false,
  transports: [
    new DailyRotateFile({
      filename: path.join(logDirectory, "app-%DATE%.log"),
      level: isProduction ? "info" : "debug",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: logRetention,
      zippedArchive: true,
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, "error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: logRetention,
      zippedArchive: true,
    }),
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDirectory, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: logRetention,
      zippedArchive: true,
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDirectory, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: logRetention,
      zippedArchive: true,
    }),
  ],
});

// DEVELOPMENT CONSOLE
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    }),
  );
}

// MORGAN STREAM (OPTIONAL)
export const loggerStream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

export default logger;
