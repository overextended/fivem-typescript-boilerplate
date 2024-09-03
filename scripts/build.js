//@ts-check

import esbuild from 'esbuild';
import { readFile, writeFile } from 'fs/promises';
import { exists, exec, getFiles, getPackage } from './utils.js';

/** @type {import('esbuild').BuildOptions} */
const server = {
  platform: 'node',
  target: ['node16'],
  format: 'cjs',
};

/** @type {import('esbuild').BuildOptions} */
const client = {
  platform: 'browser',
  target: ['es2021'],
  format: 'iife',
};

const pkg = await getPackage();
let fxmanifest = `name '${pkg.name}'
author '${pkg.author}'
version '${pkg.version}'
description '${pkg.description}'

${await readFile('./src/fxmanifest.lua', 'utf8')}\n`;

const environments = [];
const production = process.argv.includes('--mode=production');
const web = await exists('./web');

if (web) fxmanifest += `ui_page 'dist/web/index.html'\n`;
if (await exists('./src/client')) environments.push('client');
if (await exists('./src/server')) environments.push('server');

const buildCmd = production ? esbuild.build : esbuild.context;

for (const context of environments) {
  fxmanifest += `${context}_script 'dist/${context}.js'\n`;

  await buildCmd({
    bundle: true,
    entryPoints: [`./src/${context}/index.ts`],
    outfile: `dist/${context}.js`,
    keepNames: true,
    dropLabels: production ? ['DEV'] : undefined,
    legalComments: 'inline',
    treeShaking: true,
    plugins: production
      ? undefined
      : [
          {
            name: 'rebuild',
            setup(build) {
              build.onEnd((result) => console.log(`built ${context}.js with ${result.errors.length} errors`));
            },
          },
        ],
    ...(context === 'client' ? client : server),
  })
    .then((build) => {
      if (production) return console.log(`Successfully built ${context}`);

      build.watch();
    })
    .catch(() => process.exit(1));
}

if (web) await exec(`cd ./web && vite ${production ? 'build' : 'build --watch'}`);

const files = await getFiles('dist/web', 'static', 'locales');

fxmanifest += `\nfiles {\n\t'${files.filter((file) => !file.includes('/server')).join("',\n\t'")}',\n}`;

writeFile('.yarn.installed', new Date().toISOString());
writeFile('fxmanifest.lua', fxmanifest);
