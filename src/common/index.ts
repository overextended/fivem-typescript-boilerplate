import { cache } from '@overextended/ox_lib';
export * from 'config';

export const ResourceContext = IsDuplicityVersion() ? 'server' : 'client';

console.info = (...args: any[]) => console.log(`^3${args.join('\t')}^0`);

DEV: console.info(`Resource ${cache.resource}/dist/${ResourceContext}.js is running in development mode!`);
