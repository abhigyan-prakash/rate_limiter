import uuid4 from 'uuid-random';
import uuidValidate from 'uuid-validate';

export class CallContextBase {
  constructor(contextData) {
    contextData = contextData || null;

    this.requestId = null;

    if (contextData !== null) {
      if (uuidValidate(contextData.requestId)) {
        this.requestId = contextData.requestId;
      }
    }

    if (!this.requestId) {
      this.requestId = uuid4();
    }
  }
}
