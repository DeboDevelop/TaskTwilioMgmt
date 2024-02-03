import winston from 'winston';
import path from 'path';

// Set the path to the logs folder
const logsFolder = path.resolve(__dirname, '../../logs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'typescript-rest-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsFolder, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logsFolder, 'combined.log') }),
  ],
});

export default logger;
