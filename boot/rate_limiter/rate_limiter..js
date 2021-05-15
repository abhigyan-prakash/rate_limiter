import { ContextObject } from '../context_object';
import microtime from 'microtime';

export class RateLimiter extends ContextObject {
  constructor(context, { interval, maxRequests }) {
    super(context);

    if (interval < 0) {
      this.logger.error('The interval is not a postive integer');
      throw new Error('The interval should be a positive integer');
    }

    if (maxRequests < 0) {
      this.logger.error('The max requests is not a postive integer');
      throw new Error('The max requests should be a positive integer');
    }

    this.interval = this.millisecondsToMicroseconds(interval);
    this.maxRequests = maxRequests;
  }

  /**
   * Returns the list of timestamps within `interval` for the provided ID. If
   * `addNewTimestamp` flag is set, adds a new current microsecond timestamp.
   */
  async getTimestamps(id, addNewTimestamp) {
    return Promise.reject(new Error('Not implemented'));
  }

  /**
   * Clears rate limiting state for the provided ID.
   */
  async clear(id) {
    return Promise.reject(new Error('Not implemented'));
  }

  /**
   * For a given id, calculate if rate limit reached.
   */
  async limitReached(id) {
    const timestamps = await this.getTimestamps(id, true);
    const numTimestamps = timestamps.length;

    return numTimestamps > this.maxInInterval;
  }

  getCurrentMicrotime() {
    return microtime.now();
  }

  millisecondsToMicroseconds(milliseconds) {
    return milliseconds * 1000;
  }

  microsecondsToMilliseconds(microseconds) {
    return Math.ceil(microseconds / 1000);
  }

  microsecondsToTTLSeconds(microseconds) {
    return Math.ceil(microseconds / 1000 / 1000);
  }
}
