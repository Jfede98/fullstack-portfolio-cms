import service from './service';
import revalidate from './revalidate';
import settings from './settings';

export default {
  service: service as Record<string, any>,
  revalidate: revalidate as Record<string, any>,
  settings: settings as Record<string, any>,
};
