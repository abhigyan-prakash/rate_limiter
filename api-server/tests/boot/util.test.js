import { CallContext } from '../../boot/call_context/call_context';
import { Util } from '../../boot/util';

let testContext = null;
let util = null;

describe('util', () => {
  beforeEach(() => {
    testContext = new CallContext();
    util = new Util(testContext);
  });

  describe('test - isEmpty', () => {
    test('undefined - should return true', () => {
      let result = util.isEmpty(undefined);
      expect(result).toEqual(true);
    });

    test('null - should return true', () => {
      let result = util.isEmpty(null);
      expect(result).toEqual(true);
    });

    test('empty object - should return true', () => {
      let result = util.isEmpty({});
      expect(result).toEqual(true);
    });

    test('non empty object - should return false', () => {
      let result = util.isEmpty({ 'mock prop': 'mock value' });
      expect(result).toEqual(false);
    });
  });

  describe('test - isObjectLike', () => {
    test('undefined - should return false', () => {
      let result = util.isObjectLike(undefined);
      expect(result).toEqual(false);
    });

    test('null - should return false', () => {
      let result = util.isObjectLike(null);
      expect(result).toEqual(false);
    });

    test('empty object - should return true', () => {
      let result = util.isObjectLike({});
      expect(result).toEqual(true);
    });

    test('non empty object - should return true', () => {
      let result = util.isObjectLike({ 'mock prop': 'mock value' });
      expect(result).toEqual(true);
    });
  });
});
