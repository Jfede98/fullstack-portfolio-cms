import baseController from './controller';
import revalidateController from './revalidate';
import configController from './config';
import settingsController from './settings';

export default {
  baseController: baseController as Record<string, any>,
  revalidate: revalidateController as Record<string, any>,
  config: configController as Record<string, any>,
  settings: settingsController as Record<string, any>,
};
