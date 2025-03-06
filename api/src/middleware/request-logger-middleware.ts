import morgan from "morgan";

export const requestLoggerMiddleware = morgan(
  ":method :url :status :remote-addr :res[content-length] - :response-time ms :user-agent",
  {
    stream: {
      write: (message) => console.log(message.trim()),
    },
  }
);

export default requestLoggerMiddleware;
