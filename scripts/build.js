import esbuild from 'esbuild';
import { readFile, writeFile, stat } from 'fs/promises';

// why is this so overly complicated
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (err) {}
}

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

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
let fxmanifest = `name '${packageJson.name}'
author '${packageJson.author}'
version '${packageJson.version}'
description '${packageJson.description}'

${await readFile('./src/fxmanifest.lua', 'utf8')}
`;

const environments = [];

if (await exists('./src/web')) {
  fxmanifest += `ui_page 'dist/web/index.html'\n`;
}

if (await exists('./src/client')) {
  environments.push('client');
  fxmanifest += `client_script 'dist/client.js'\n`;
}

if (await exists('./src/server')) {
  environments.push('server');
  fxmanifest += `server_script 'dist/server.js'\n`;
}

await writeFile('.yarn.installed', new Date().toISOString());
await writeFile('fxmanifest.lua', fxmanifest);

const production = process.argv.includes('--mode=production');
const buildCmd = production ? esbuild.build : esbuild.context;

for (const context of ['client', 'server']) {
  buildCmd({
    bundle: true,
    entryPoints: [`./src/${context}/index.ts`],
    outfile: `dist/${context}.js`,
    keepNames: true,
    dropLabels: production ? ['DEV'] : undefined,
    legalComments: 'inline',
    plugins: production
      ? undefined
      : [
          {
            name: 'rebuild',
            setup(build) {
              const cb = (result) => {
                if (!result || result.errors.length === 0) console.log(`Successfully built ${context}`);
              };
              build.onEnd(cb);
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
