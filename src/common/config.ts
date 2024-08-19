import type StaticConfig from '~/static/config.json';
import { LoadJsonFile } from 'utils';

export default LoadJsonFile<typeof StaticConfig>('static/config.json');
