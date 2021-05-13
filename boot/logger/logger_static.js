import pino from 'pino';
import { pinoDefaults } from './defaults';
import { LoggerBase } from './logger_base';

let defaultLogger = null;

export class LoggerStatic extends LoggerBase {
  constructor() {
    super();

    defaultLogger = pino(pinoDefaults);
  }

  get _pino() {
    return defaultLogger;
  }
}
