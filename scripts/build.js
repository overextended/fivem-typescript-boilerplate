//@ts-check

import { exists, exec, getFiles } from './utils.js';
import { createBuilder, createFxmanifest } from '@communityox/fx-utils';

const watch = process.argv.includes('--watch');
const web = await exists('./web');
const dropLabels = ['$BROWSER'];

if (!watch) dropLabels.push('$DEV');

createBuilder(
  watch,
  {
    keepNames: true,
    legalComments: 'inline',
    bundle: true,
    treeShaking: true,
  },
  [
    {
      name: 'server',
      options: {
        platform: 'node',
        target: ['node22'],
        format: 'cjs',
        dropLabels: [...dropLabels, '$CLIENT'],
      },
    },
    {
      name: 'client',
      options: {
        platform: 'browser',
        target: ['es2021'],
        format: 'iife',
        dropLabels: [...dropLabels, '$SERVER'],
      },
    },
  ],
  async (outfiles) => {
    const files = await getFiles('dist/web', 'static', 'locales');
    await createFxmanifest({
      client_scripts: [outfiles.client],
      server_scripts: [outfiles.server],
      files: ['lib/init.lua', 'lib/client/**.lua', 'locales/*.json', ...files],
      dependencies: ['/server:13068', '/onesync'],
      metadata: {
        ui_page: 'dist/web/index.html',
        node_version: '22'
      },
    });

    if (web && !watch) await exec("cd ./web && vite build");
  }
);

if (web && watch) await exec("cd ./web && vite build --watch");
