import { CallContext } from '../../../boot/call_context/call_context';
import { InMemoryRateLimter } from '../../../boot/rate_limiter/rate_limiter_in_memory';

let options = null;
let testContext = null;
let rateLimiter = null;

describe('RateLimiter implementations', () => {
  const id1 = 1;
  const id2 = 2;

  beforeEach(() => {
    jest.useFakeTimers();
    testContext = new CallContext();
  });

  afterEach(() => {
    jest.runAllTimers();

    if (rateLimiter && rateLimiter._instance) {
      delete rateLimiter._instance;
    }
  });

  afterAll(() => {
    if (rateLimiter && rateLimiter._instance) {
      delete rateLimiter._instance;
    }
  });

  let currentTime = 0;
  function setTime(rateLimiterObj, newTime) {
    jest
      .spyOn(rateLimiterObj, 'getCurrentMicrotime')
      .mockImplementation(() =>
        rateLimiterObj.millisecondsToMicroseconds(newTime)
      );
    jest.advanceTimersByTime(Math.max(0, newTime - currentTime));
    currentTime = newTime;
  }

  test('prevents more than maxRequests actions within interval', async () => {
    options = { interval: 10, maxRequests: 2 };
    rateLimiter = new InMemoryRateLimter(testContext, options);

    await rateLimiter.clear(id1);
    await rateLimiter.clear(id2);

    // Should allow first action through.
    setTime(rateLimiter, 0);
    expect(await rateLimiter.limitReached(id1)).toBe(false);

    // Should allow second action through.
    setTime(rateLimiter, 1);
    expect(await rateLimiter.limitReached(id1)).toBe(false);

    // Would not allow third action through, since not enough time has passed.
    setTime(rateLimiter, options.interval - 1);
    expect(await rateLimiter.limitReached(id1)).toBe(true);

    // Now only one action in the last 10 ms, so we're ok.
    setTime(rateLimiter, options.interval + 1);
    expect(await rateLimiter.limitReached(id1)).toBe(false);
  });

  test('blocked actions count as actions', async () => {
    options = { interval: 10, maxRequests: 2 };
    rateLimiter = new InMemoryRateLimter(testContext, options);

    // Block this id.
    setTime(rateLimiter, 0);
    rateLimiter.limitReached(id1);
    rateLimiter.limitReached(id1);

    // `interval` time has not passed, so we should still block all actions.
    setTime(rateLimiter, options.interval - 1);
    expect(await rateLimiter.limitReached(id1)).toBe(true);

    // The first 2 actions have cleared, but one still remain, so we should
    // only allow one more.
    setTime(rateLimiter, options.interval + 1);
    expect(await rateLimiter.limitReached(id1)).toBe(false);
    expect(await rateLimiter.limitReached(id1)).toBe(true);
  });

  test('keeps separate counts for separate users', async () => {
    const options = { interval: 10, maxInInterval: 2 };
    rateLimiter = new InMemoryRateLimter(testContext, options);

    setTime(rateLimiter, 0);
    expect(await rateLimiter.limitReached(id1)).toBe(false);
    expect(await rateLimiter.limitReached(id1)).toBe(false);
    expect(await rateLimiter.limitReached(id1)).toBe(true);

    setTime(rateLimiter, 1);
    expect(await rateLimiter.limitReached(id2)).toBe(false);
    expect(await rateLimiter.limitReached(id2)).toBe(false);
    expect(await rateLimiter.limitReached(id2)).toBe(true);

    setTime(rateLimiter, 10);
    expect(await rateLimiter.limitReached(id1)).toBe(false);
    expect(await rateLimiter.limitReached(id2)).toBe(true);
  });
});
