import { Utils } from '..';
import { NodeSSH } from 'node-ssh';
import { readFileSync } from 'fs';
const ssh = new NodeSSH();

export class Helpers {
  protected helpers = new Utils();

  /**
   * Connects to the newly created virtual machine per SSH and downloads the config file to get the password after the installation is done
   * @param {host} host
   * @param {password} password
   * @returns void
   */

  async getConfigFromRoot(host: string, password: string): Promise<void> {
    try {
      await ssh.connect({ host: host, username: 'root', password: password });
      await ssh.getFile(
        __dirname + '/../config.yaml',
        '/root/.config/code-server/config.yaml'
      );
      this.helpers.logger('Downloaded the Config File!');
      return ssh.dispose();
    } catch (error) {
      this.helpers.logger(error, 'error');
    }
  }

  /**
   * Parses the password from the Config file
   * @param {path} path
   * @returns Password from Config file
   */

  parsePasswordFromConfig(path: string): string {
    let password;
    const data = readFileSync(path, 'utf8');
    let trim = data.trim().split(' ');
    let filter = trim[3].indexOf('cert');
    password = trim[3].slice(0, filter).trim();
    return password;
  }
}
