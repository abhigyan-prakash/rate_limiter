export class LoggerBase {
  debug(...args) {
    return this.log('debug', ...args);
  }

  warn(...args) {
    return this.log('warn', ...args);
  }

  error(...args) {
    return this.log('error', ...args);
  }

  info(...args) {
    return this.log('info', ...args);
  }

  trace(...args) {
    return this.log('trace', ...args);
  }

  log(method, ...args) {
    return this._pino[method](...args);
  }
}
