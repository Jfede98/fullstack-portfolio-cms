/**
 * Application methods
 */
import bootstrap from './bootstrap';
import destroy from './destroy';
import register from './register';

/**
 * Plugin server methods
 */
import config from './config';
import contentTypes from './content-types';
import controllers from './controllers';
import middlewares from './middlewares';
import policies from './policies';
import routes from './routes';
import services from './services';

export default {
  register: register as Record<string, any>,
  bootstrap: bootstrap as Record<string, any>,
  destroy: destroy as Record<string, any>,
  config: config as Record<string, any>,
  controllers: controllers as Record<string, any>,
  routes: routes as Record<string, any>,
  services: services as Record<string, any>,
  contentTypes: contentTypes as Record<string, any>,
  policies: policies as Record<string, any>,
  middlewares: middlewares as Record<string, any>,
} as Record<string, any>;
