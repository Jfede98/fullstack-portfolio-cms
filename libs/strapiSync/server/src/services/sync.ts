import type { Core } from '@strapi/strapi';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const runFullSequence = async (strapi: Core.Strapi) => {
  const settings = await strapi.plugin('strapi-sync').service('settings').getSettings();
  const {
    destinationIp,
    destinationEnv,
    sourceBucketPath,
    destinationBucketPath,
    sourceCloudfrontPath,
    destinationCloudfrontPath,
    isLocal,
  } = settings;

  if (
    !destinationEnv ||
    !sourceBucketPath ||
    !destinationBucketPath ||
    !sourceCloudfrontPath ||
    !destinationCloudfrontPath
  )
    throw new Error('Configuración incompleta: Faltan parámetros para la sincronización.');

  strapi.log.info('>>> INICIANDO Sincronización...');

  const path = require('path');
  const fs = require('fs');

  const args = [
    'sync',
    String(isLocal),
    destinationIp,
    destinationEnv,
    sourceBucketPath,
    destinationBucketPath,
    sourceCloudfrontPath,
    destinationCloudfrontPath,
  ];

  strapi.log.info('Ejecutando script de sincronización con los siguientes parámetros:');
  strapi.log.info(`- isLocal: ${isLocal}`);
  strapi.log.info(`- destinationIp: ${destinationIp}`);
  strapi.log.info(`- destinationEnv: ${destinationEnv}`);
  strapi.log.info(`- sourceBucketPath: ${sourceBucketPath}`);
  strapi.log.info(`- destinationBucketPath: ${destinationBucketPath}`);
  strapi.log.info(`- sourceCloudfrontPath: ${sourceCloudfrontPath}`);
  strapi.log.info(`- destinationCloudfrontPath: ${destinationCloudfrontPath}`);

  const scriptPath = path.resolve(process.cwd(), '.scripts', 'backups-sync.sh');
  if (!fs.existsSync(scriptPath)) throw new Error(`Script no encontrado en: ${scriptPath}`);

  const { stdout } = await execAsync(`bash ${scriptPath} ${args.join(' ')}`);
  strapi.log.info('PROCESO DE SINCRONIZACIÓN TOTAL FINALIZADO CON ÉXITO.');
  return { success: true, message: stdout };
};

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async sync() {
    try {
      await runFullSequence(strapi);
    } catch (err: any) {
      strapi.log.error(`Sincronización fallida: ${err.message}`);
      throw err;
    }
  },
});

export default service;
