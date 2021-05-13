export class ContextObject {
  constructor(context) {
    if (!context) {
      throw new Error('Cannot create a context object without a context');
    }

    this.context = context;
  }

  get logger() {
    return this.context.logger;
  }
}
