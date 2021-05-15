import uuid4 from 'uuid-random';
import uuidValidate from 'uuid-validate';
import { HEADER_X_FORWARDED_FOR } from '../defines';
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

    this.setRemoteAddressFromRequest(this.request);
  }

  setRemoteAddressFromRequest(request) {
    if (!request) {
      return;
    }

    let forwardedForHeader = HEADER_X_FORWARDED_FOR.toLocaleLowerCase();
    let ip = '';

    if (request && request.headers && request.headers[forwardedForHeader]) {
      ip = request.headers[forwardedForHeader];
    }

    if (!ip) {
      if (request.connection && request.connection.remoteAddress) {
        ip = request.connection.remoteAddress;
      }

      if (request.socket && request.socket.remoteAddress) {
        ip = request.socket.remoteAddress;
      }

      if (ip) {
        ip = ip.split(',')[0];
        ip = ip.split(':').slice(-1);
        ip = ip[0] || '';
      }

      // Skip local addresses
      if (ip == '1') {
        ip = '';
      }
    }

    if (ip) {
      this.clientRemoteAddress = ip;
    }
  }
}
