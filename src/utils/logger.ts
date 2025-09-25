type LogLevel = 'error' | 'warn' | 'info' | 'debug';
type LogExtra = Record<string, unknown>;

const sendToProvider = (level: LogLevel, message: string, extra: LogExtra = {}): void => {
  console.log('Sending to provider', level, message, extra);
};

export const logger = {
  error: (message: string, extra: LogExtra = {}): void => {
    console.error(message, extra);
    sendToProvider('error', message, extra);
  },
  warn: (message: string, extra: LogExtra = {}): void => {
    console.warn(message, extra);
    sendToProvider('warn', message, extra);
  },
  info: (message: string, extra: LogExtra = {}): void => {
    console.log(message, extra);
    sendToProvider('info', message, extra);
  },
  debug: (message: string, extra: LogExtra = {}): void => {
    console.debug(message, extra);
    sendToProvider('debug', message, extra);
  },
};
