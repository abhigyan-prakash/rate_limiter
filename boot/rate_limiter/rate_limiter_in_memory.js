import { RateLimiter } from './rate_limiter.';

export class InMemoryRateLimter extends RateLimiter {
  constructor(context, options = {}) {
    super(context, options);

    this.storage = {};
    this.ttls = {};
  }

  async clear(id) {
    delete this.storage[id];
    const ttl = this.ttls[id];

    if (ttl) {
      clearTimeout(ttl);
      delete this.ttls[id];
    }
  }

  async getTimestamps(id, addNewTimestamp) {
    const currentTimestamp = this.getCurrentMicrotime();

    // Update the stored timestamps, filter out old ones, and add the new one.
    const clearBefore = currentTimestamp - this.interval;
    const storedTimestamps = (this.storage[id] || []).filter(
      t => t > clearBefore
    );

    if (addNewTimestamp) {
      storedTimestamps.push(currentTimestamp);

      // Setting a new TTL, and cancel the old one, if present.
      const ttl = this.ttls[id];
      if (ttl) clearTimeout(ttl);
      this.ttls[id] = setTimeout(() => {
        delete this.storage[id];
        delete this.ttls[id];
      }, this.microsecondsToMilliseconds(this.interval));
    }

    // Return the new stored timestamps.
    this.storage[id] = storedTimestamps;
    return storedTimestamps;
  }
}
