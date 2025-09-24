const sendToProvider = (level, message, extra) => {};

export const logger = {
  error: (message, extra = {}) => {
    console.error(message, extra);
    sendToProvider("error", message, extra);
  },
  warn: (message, extra = {}) => {
    console.warn(message, extra);
    sendToProvider("warn", message, extra);
  },
  info: (message, extra = {}) => {
    console.log(message, extra);
    sendToProvider("info", message, extra);
  },
  debug: (message, extra = {}) => {
    console.debug(message, extra);
    sendToProvider("debug", message, extra);
  },
};
