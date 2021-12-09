import Vultr from '@vultr/vultr-node';
import { Helpers } from './helpers';
import { NodeSSH } from 'node-ssh';
import { performance } from 'node:perf_hooks';
import {
  writeFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
  rmdirSync
} from 'node:fs';
const ssh = new NodeSSH();
const Table = require('cli-table');
const scriptPath = __dirname + `/../hosting/`;
const prompt = require('prompt-sync')();

class VultrVSCode extends Helpers {
  private Vultr: any = undefined;

  /**
   * Initializes Vultr Client
   * @param {vultrKey} string API KEY
   */

  constructor(vultrKey: string) {
    super();
    if (!vultrKey) {
      throw new Error(
        'Vultr Clinet can not be initialized without a Vultr API Key!'
      );
    }
    this.Vultr = Vultr.initialize({ apiKey: vultrKey });
  }

  /**
   *  Creats an Instance on Vultr with the given object
   * @param {Object} Options
   * @returns Object Containing the Instance Information
   */

  async createInstance(Options: any = {}): Promise<{}> {
    if (!Options) throw new Error('Please provide Your Instance options!');

    let serverInfo: any = {};
    let data: any = {};

    this.helpers.logger('Creating the Server, Please wait....');
    const instance = await this.Vultr.instances.createInstance({
      region: `${Options.region}`,
      plan: `${Options.plan}`,
      os_id: `${Options.os}`
    });

    serverInfo.rootPassword = instance.instance.default_password;
    serverInfo.ID = instance.instance.id;
    serverInfo.status = instance.instance.status;
    serverInfo.serverStatus = instance.instance.server_status;

    this.helpers.logger(
      'Server Created Successfully, Waiting for the Server to become responsive'
    );

    while (serverInfo.status === 'pending') {
      const listInstance = await this.Vultr.instances.getInstance({
        'instance-id': serverInfo.ID
      });
      data = listInstance;
      if (
        data.instance.status !== 'pending' &&
        data.instance.server_status !== 'none'
      ) {
        serverInfo.status = data.instance.status;
        serverInfo.serverStatus = data.instance.server_status;
        this.helpers.logger(
          'Server became responsive, A SSH Connection will be made now. This could take up to 40 seconds!'
        );
        console.log('I am getting out of the loop');

        break;
      }
    }
    serverInfo.IP = data.instance.main_ip;
    serverInfo.OS = data.instance.os;
    serverInfo.REGION = data.instance.region;
    writeFileSync(`${__dirname}/instance.json`, JSON.stringify(serverInfo));

    return serverInfo;
  }

  /**
   * Connects to the newly created virtual machine per SSH and tries to run this shell script!
   * @param {IP: string} host
   * @param {Password: string} password
   * @returns void
   */

  private async connectWithSSH(host: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        ssh
          .connect({
            host: host,
            username: 'root',
            password: password
          })
          .then(() => {
            this.helpers.logger('Connected to server!');
            this.helpers.logger(
              'Uploading the shell script to start the hosting process!'
            );
            return ssh
              .putFiles([
                {
                  local: scriptPath + 'install.sh',
                  remote: '/root/install.sh'
                },
                {
                  local: scriptPath + 'code-server',
                  remote: '/root/code-server'
                }
              ])
              .then(
                () => {
                  this.helpers.logger(
                    'Script has been Uploaded to the server!'
                  );
                },
                (err) => {
                  console.log('Files could not be transfered!');
                  console.log(err);
                }
              );
          })
          .then(() => {
            this.helpers.logger('Executing the Script.....');
            ssh
              .execCommand('chmod +x install.sh && ./install.sh', {
                cwd: '/root'
              })
              .then(() => {
                this.helpers.logger('Execution done!');
                ssh.dispose();
                this.helpers.logger('Disconnecting from Server....');
                resolve();
              });
          });
      } catch (error) {
        let errorMessage = 'Failed';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        reject(this.helpers.logger(errorMessage, 'error'));
      }
    });
  }

  /**
   * Starts the Instance
   * @param {Object} config object containing the instance specs
   * @returns void
   */

  async startInstance(config: any = {}) {
    let startTime = performance.now();
    let table = new Table({
      head: ['Info', 'Specs'],
      colWidths: [20, 40]
    });
    const details: any = await this.createInstance(config);
    setTimeout(async () => {
      await this.connectWithSSH(details.IP, details.rootPassword);
      await this.getConfigFromRoot(details.IP, details.rootPassword);
      const vscode_password = this.parsePasswordFromConfig(
        __dirname + '/config.yaml'
      );
      table.push(
        ['ID', details.ID],
        ['IP', details.IP],
        ['Password', details.rootPassword],
        ['OS', details.OS],
        ['Status', details.status],
        ['Region', details.REGION],
        ['VS Code Password', vscode_password]
      );
      unlinkSync(__dirname + '/config.yaml');
      let endTime = performance.now();
      let total = (endTime - startTime) / 1000;
      this.helpers.logger(`Execution took ${total.toFixed(2)} seconds`);
      console.log(table.toString());
    }, 60000);
  }

  /**
   * Creates a Config File
   * @returns void
   */

  InitializeConfig() {
    const vultrKey = prompt(`Please provide your Vultr API Key: `);
    if (!vultrKey) return console.log('Please provide a vultr api key!');

    const plan = prompt(
      'What Vultr Server Plan do you wish to have as default: '
    );
    if (!plan) return console.log('Please provide a server plan');

    const region = prompt('Please enter the region id: ');

    if (!region) return console.log('Please provide a region id!');

    const os = prompt('Please enter the os id: ');
    if (!os) return console.log('Please provide a os id!');

    if (existsSync(__dirname + '/../' + 'Config')) {
      try {
        rmdirSync(__dirname + '/../' + 'Config', { recursive: true });
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Could not Remove File, ${err.message}`);
        }
      }
    }

    mkdirSync(__dirname + '/../' + 'Config');
    const vultr_data = {
      key: vultrKey,
      plan: plan,
      region: region,
      os: os
    };
    writeFileSync(
      __dirname + '/..' + '/Config/vultr_config.json',
      JSON.stringify(vultr_data)
    );
  }

  /**
   * Destroys the created Instance
   * @returns void
   */

  async StopInstance() {
    if (existsSync('../instance.json')) {
      const instanceObject = require('../instance.json');
      try {
        await this.Vultr.instances.deleteInstance({
          'instance-id': `${instanceObject.ID}`
        });
        this.helpers.logger(`Server Stopped Successfully!`);
        return;
      } catch (err) {
        if (err instanceof Error) {
          this.helpers.logger(`Error: ${err.message}`, `error`);
        }
      }
    }

    this.helpers.logger(
      `Instance Object not found in the Config Folder, defaulting to prompts!`
    );

    const instanceID = prompt(`Instance ID: `);
    const getInstance = await this.Vultr.instances.getInstance({
      'instance-id': instanceID
    });

    if (!getInstance)
      return this.helpers.logger(
        `No instance found with this ID or maybe it does not exist!`,
        `error`
      );
    try {
      await this.Vultr.instances.deleteInstance({
        'instance-id': `${instanceID}`
      });
      this.helpers.logger(`Server Stopped Successfully!`);
    } catch (error) {
      this.helpers.logger(`Error: ${error}`, `error`);
    }
  }
}

export { VultrVSCode };
