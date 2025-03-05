import type StaticConfig from '~/static/config.json';
import { LoadJsonFile } from 'utils';

let config = LoadJsonFile('static/config.json');

$BROWSER: {
  config = await config;
}

export default config as typeof StaticConfig;
