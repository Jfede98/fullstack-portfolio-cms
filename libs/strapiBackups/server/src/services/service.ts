import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const service = ({ strapi }: { strapi: any }): any => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  async listBackups() {
    const { s3Bucket, s3Path } = await strapi
      .plugin('strapi-backups')
      .service('settings')
      .getSettings();
    const stage = process.env.APP_STAGE || 'unknown';
    const s3Url = `s3://${s3Bucket}/${s3Path}/${stage}/`;

    try {
      const { stdout } = await execAsync(`aws s3 ls ${s3Url}`);

      const lines = stdout.split('\n').filter((line) => line.trim().length > 0);
      const backups = lines
        .map((line) => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 4) {
            return {
              date: parts[0],
              hour: parts[1],
              size: parts[2],
              filename: parts[3],
            };
          }
          return null;
        })
        .filter((item) => item !== null && item.filename.endsWith('.gz'));

      backups.sort((a: any, b: any) => b.date.localeCompare(a.date));

      return { backups };
    } catch (error: any) {
      console.error('Error listing s3 backups:', error.message);
      return { error: error.message, backups: [] };
    }
  },

  async createBackup() {
    try {
      const path = require('path');
      const fs = require('fs');

      const scriptPath = path.resolve(process.cwd(), '.scripts', 'backups-sync.sh');
      if (!fs.existsSync(scriptPath)) throw new Error('Script not found');

      const { stdout } = await execAsync(`bash ${scriptPath}`);
      return { success: true, message: stdout };
    } catch (error: any) {
      console.error('Error creating backup:', error.message);
      return { success: false, message: error.message };
    }
  },

  async restoreBackup(filename: string) {
    if (!filename) {
      return { success: false, message: 'Filename not provided' };
    }

    try {
      const { s3Bucket, s3Path } = await strapi
        .plugin('strapi-backups')
        .service('settings')
        .getSettings();
      const path = require('path');
      const fs = require('fs');
      const { spawn } = require('child_process');

      // TODO: Revisar esta variable | llega compilada en el codigo y no se extrae del .env en tiempo de ejecución
      const stage = process.env.APP_STAGE;

      strapi.log.info(`Varable en tiempo de ejecución APP_STAGE: ${stage}`);

      if (!stage) throw new Error('No se encontró la variable APP_STAGE en el .env');

      const s3Url = `s3://${s3Bucket}/${s3Path}/${stage}/${filename}`;

      const scriptPath = path.resolve(process.cwd(), '.scripts', 'restore-db.sh');
      if (!fs.existsSync(scriptPath)) throw new Error('Restore script not found at ' + scriptPath);

      const logDir = (() => {
        try {
          fs.accessSync('/var/log', fs.constants.W_OK);
          return '/var/log';
        } catch {
          return '/tmp';
        }
      })();
      const out = fs.openSync(`${logDir}/strapi-restore-worker-${stage}-out.log`, 'a');
      const err = fs.openSync(`${logDir}/strapi-restore-worker-${stage}-err.log`, 'a');

      const child = spawn('bash', [scriptPath, s3Url], {
        detached: true,
        stdio: ['ignore', out, err],
      });

      child.unref();

      return { success: true, message: 'Restoration process started in the background.' };
    } catch (error: any) {
      console.error('Error starting restore:', error.message);
      return { success: false, message: error.message };
    }
  },

  async deleteBackup(filename: string) {
    if (!filename) {
      return { success: false, message: 'Filename not provided' };
    }

    const { s3Bucket, s3Path } = await strapi
      .plugin('strapi-backups')
      .service('settings')
      .getSettings();
    const stage = process.env.APP_STAGE || 'unknown';
    const s3Url = `s3://${s3Bucket}/${s3Path}/${stage}/${filename}`;

    try {
      await execAsync(`aws s3 rm ${s3Url}`);
      return { success: true, message: `Backup ${filename} eliminado exitosamente de S3` };
    } catch (error: any) {
      console.error('Error deleting s3 backup:', error.message);
      return { success: false, message: error.message };
    }
  },
});

export default service;
