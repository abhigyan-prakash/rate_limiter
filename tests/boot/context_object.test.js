import { CallContext } from '../../boot/call_context/call_context';
import { ContextObject } from '../../boot/context_object';

describe('ContextObject', () => {
  describe('Constructor', () => {
    test('No context - should fail', async () => {
      try {
        new ContextObject();
      } catch (err) {
        expect(err.message).toEqual(
          'Cannot create a context object without a context'
        );
      }
    });
  });

  describe('Logger', () => {
    test('Getter - valid', async () => {
      let callContext = new CallContext();
      let contextObject = new ContextObject(callContext);

      expect(contextObject.logger).toBe(callContext.logger);
    });

    test('Getter - null', async () => {
      let callContext = new CallContext();
      callContext.logger = null;
      let contextObject = new ContextObject(callContext);

      expect(contextObject.logger).toBe(null);
    });
  });
});
