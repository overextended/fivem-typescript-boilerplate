import type StaticConfig from '../../static/config.json';
import { LoadJsonFile } from 'utils';

export default LoadJsonFile('static/config') as typeof StaticConfig;
