import uuid4 from 'uuid-random';
import uuidValidate from 'uuid-validate';
import { Logger } from '../logger/Logger';
import { CallContextBase } from './call_context_base';

export class CallContext extends CallContextBase {
  constructor(contextData) {
    super(contextData);

    contextData = contextData || null;

    this.request = null;
    this.response = null;

    if (contextData !== null) {
      this.request = contextData.request || null;
      this.response = contextData.response || null;
    }

    this.logger = new Logger();
  }
}
