import pino from 'pino';
import expressPino from 'express-pino-logger';
import { pinoDefaults } from './defaults';
import { LoggerBase } from './logger_base';

let logger;

export class Logger extends LoggerBase {
  constructor() {
    super();

    let pinoLogger = pino(pinoDefaults);
    logger = expressPino({ logger: pinoLogger });
  }

  get _pino() {
    return logger;
  }
}
