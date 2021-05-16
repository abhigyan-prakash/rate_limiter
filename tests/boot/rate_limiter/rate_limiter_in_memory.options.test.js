import { CallContext } from '../../../boot/call_context/call_context';
import { InMemoryRateLimter } from '../../../boot/rate_limiter/rate_limiter_in_memory';

let options = null;
let testContext = null;
let rateLimiter = null;

describe('options validation', () => {
  beforeEach(() => {
    testContext = new CallContext();

    options = {
      interval: 10000,
      maxRequests: 5
    };
  });

  afterEach(() => {
    if (rateLimiter && rateLimiter._instance) {
      delete rateLimiter._instance;
    }
  });

  afterAll(() => {
    if (rateLimiter && rateLimiter._instance) {
      delete rateLimiter._instance;
    }
  });

  test('throws if interval is missing', () => {
    delete options.interval;
    expect(() => new InMemoryRateLimter(testContext, options)).toThrow();
  });

  test('throws if maxRequests is missing', () => {
    delete options.maxRequests;
    expect(() => new InMemoryRateLimter(testContext, options)).toThrow();
  });

  test('throws if interval is zero', () => {
    options.interval = 0;
    expect(() => new InMemoryRateLimter(testContext, options)).toThrow();
  });

  test('throws if interval is negative', () => {
    options.interval = -1;
    expect(() => new InMemoryRateLimter(testContext, options)).toThrow();
  });

  test('throws if maxRequests is zero', () => {
    options.maxRequests = 0;
    expect(() => new InMemoryRateLimter(testContext, options)).toThrow();
  });

  test('throws if maxRequests is negative', () => {
    options.maxRequests = -1;
    expect(() => new InMemoryRateLimter(testContext, options)).toThrow();
  });

  test('passes with full options', () => {
    expect(() => new InMemoryRateLimter(testContext, options)).not.toThrow();
  });
});
