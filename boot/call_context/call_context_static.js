import { UUID_EMPTY } from '../defines';
import { LoggerStatic } from '../logger/logger_static';
import { CallContextBase } from './call_context_base';

export class CallContextStatic extends CallContextBase {
  constructor() {
    super({
      requestId: UUID_EMPTY
    });

    this.logger = new LoggerStatic();
  }
}
