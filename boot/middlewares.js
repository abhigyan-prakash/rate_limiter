import uuid4 from 'uuid-random';
import { CallContext } from './call_context/call_context';
import { Config } from './config';
import { HEADER_REQUESTID } from './defines';
import { GeneralError } from './errors';
import { InMemoryRateLimter } from './rate_limiter/rate_limiter_in_memory';

/**
 * Middleware that creates the request context and sets it on the request
 */
export async function createRequestContext(request, response, next) {
  const requestId = request.get(HEADER_REQUESTID) || uuid4();

  let context = new CallContext({
    requestId,
    request,
    response
  });

  // Set the response request ID
  response.set(HEADER_REQUESTID, context.requestId);

  // Create a new context for every request
  request.context = context;

  // Log the request URL
  request.context.logger.info(
    `Received a '${request.method}' request on path ${request.originalUrl}`
  );

  // Log the request end
  response.on('close', () => {
    context.logger.debug(`HTTP Requested ended on path ${request.originalUrl}`);
  });

  request.context.logger.trace(request);

  next();
}

export function handleErrors(error, request, response, next) {
  request.context.logger.error(error);

  if (error instanceof GeneralError) {
    return response.status(error.getCode()).json({
      status: 'error',
      message: error.message
    });
  }

  return response.status(500).json({
    status: 'error',
    message: error.message
  });
}

/**
 * Default route that handles all unmatched requests - returns 404
 */
export function handle404(request, response) {
  response.sendStatus(404);

  request.context.logger.info(
    `The request did not match any route; Returning StatusCode ${response.statusCode}`
  );
}

/**
 * Check if the rate limit has reached, if reached deny request
 */
export function rateLimit(request, response, next) {
  request.context.logger.info(
    `Checking the rate limit for: ${request.context.clientRemoteAddress}`
  );

  // Get the rate limiter config
  const config = new Config(request.context);
  const interval = config.getConfig('rate_limiter.interval_in_sec');
  const maxRequests = config.getConfig('rate_limiter.max_requests');
  let intervalMs = interval * 1000;

  const limiter = new InMemoryRateLimter(request.context, {
    interval: intervalMs,
    maxRequests
  });

  const isAllowed = limiter.limitReached(request.context.clientRemoteAddress);
  if (isAllowed) {
    request.context.logger.info(
      `Request allowed for: ${request.context.clientRemoteAddress}`
    );
    return next();
  }

  request.context.logger.error(
    `Request limit reached for: ${request.context.clientRemoteAddress}`
  );
  return res.status(429).send('Too many requests');
}
