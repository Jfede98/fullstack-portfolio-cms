import { exec } from 'child_process';
import path from 'path';

export default () => ({
  async reload() {
    return new Promise((resolve, reject) => {
      const scriptPath = path.resolve(process.cwd(), '.scripts', 'pm2.sh');
      
      exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          reject({ error: error.message, stderr });
          return;
        }
        resolve({ stdout, stderr });
      });
    });
  },
});
