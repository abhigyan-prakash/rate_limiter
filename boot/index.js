import express from 'express';
import { CallContextStatic } from './call_context/call_context_static';
import { Config } from './config';
import router from '../routes';
import {
  createRequestContext,
  handle404,
  handleErrors,
  rateLimit
} from './middlewares';

let staticContext = null;

export async function boot() {
  // Get the root path
  const rootPath = process.mainModule.path;

  // Create a static context
  staticContext = new CallContextStatic();

  // Get the current env
  const currentEnv = (process.env.ENV || 'develop').toLowerCase();

  // Parse and load the configs
  const config = new Config(staticContext);
  await config.parseConfigValues(rootPath, currentEnv);

  // Intialize the express app
  let app = express();

  app.set('trust proxy');

  // Initialize the request context
  app.use(createRequestContext);

  // Initialize rate limiter
  staticContext.logger.debug(`Initializing the rate limiter`);
  app.use(rateLimit);

  // Initalize routes
  app.use(router);

  const port = config.getConfig('listen.http.port');
  if (port === undefined) {
    staticContext.logger.error('listen port not configured');
    return process.exit(9);
  }

  // Reply with 404 for unmatched routes
  app.use('*', handle404);

  // handle errors
  app.use(handleErrors);

  // Start server listening
  let server = app.listen(port);

  server.keepAliveTimeout =
    config.getConfig('listen.http.keep_alive_timeout_seconds') * 1000;
  staticContext.logger.debug(
    `Using a keep-alive timeout of ${server.keepAliveTimeout}ms`
  );
  server.headersTimeout =
    config.getConfig('listen.http.headers_timeout_seconds') * 1000;
  staticContext.logger.debug(
    `Using a headers timeout of ${server.headersTimeout}ms`
  );

  staticContext.logger.info(`listening on ${port}`);
}
