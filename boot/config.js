import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { ContextObject } from './context_object';
import { Util } from './util';

let _instance = null;

export class Config extends ContextObject {
  constructor(context) {
    if (_instance) {
      return _instance;
    }

    super(context);
    this._instance = this;

    this.configData = {};
    this.util = new Util(context);
  }

  async parseConfigValues(rootPath, currentEnv = 'develop') {
    let defaultConfigPath = path.join(rootPath, 'config.yaml');
    if (await this.exists(defaultConfigPath)) {
      try {
        this.configData = Object.assign(
          {},
          await YAML.parse(fs.readFileSync(defaultConfigPath, 'utf8'))
        );
      } catch (err) {
        this.logger.error(err, 'Default config could not be parsed');
      }
    }

    let envConfigPath = path.join(rootPath, `${currentEnv}.config.yaml`);
    if (await this.exists(envConfigPath)) {
      try {
        this.configData = Object.assign(
          this.configData,
          await YAML.parse(fs.readFileSync(envConfigPath, 'utf8'))
        );
      } catch (err) {
        this.logger.error(err, 'Environment config could not be parsed');
      }
    }

    if (this.util.isEmpty(this.configData)) {
      this.logger.error('No configs loaded');
      throw new Error('No configs loaded.');
    }

    this.logger.info('Successfully parsed config values');
  }

  getConfig(key) {
    try {
      return key.split('.').reduce((res, prop) => res[prop], this.configData);
    } catch (err) {
      this.logger.error(`The key: ${key} does not exists in config`);
      return null;
    }
  }

  async exists(path) {
    try {
      await fs.promises.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
