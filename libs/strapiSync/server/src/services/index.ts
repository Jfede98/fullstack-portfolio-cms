import service from './service';
import sync from './sync';
import settings from './settings';

export default {
  service: service as Record<string, any>,
  sync: sync as Record<string, any>,
  settings: settings as Record<string, any>,
};
