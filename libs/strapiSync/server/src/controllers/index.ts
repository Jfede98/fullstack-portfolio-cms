import controller from './controller';
import sync from './sync';
import settings from './settings';
import config from './config';

export default {
  controller: controller as Record<string, any>,
  sync: sync as Record<string, any>,
  settings: settings as Record<string, any>,
  config: config as Record<string, any>,
};
