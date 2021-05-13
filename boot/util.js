import { ContextObject } from './context_object';

export class Util extends ContextObject {
  constructor(context) {
    super(context);
  }

  isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
  }

  isObjectLike(obj) {
    return !obj && typeof obj === Object;
  }
}
