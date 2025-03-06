import morgan from "morgan";
import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()],
});

export const requestLoggerMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

export default requestLoggerMiddleware;
