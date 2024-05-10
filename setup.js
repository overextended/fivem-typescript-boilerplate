import fs from 'fs';

const viteConfigBasePath = 'src/web/vite.config';
let viteConfigExtension = '';

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

if (fileExists(viteConfigBasePath + '.js')) viteConfigExtension = '.js';
else if (fileExists(viteConfigBasePath + '.ts')) viteConfigExtension = '.ts';
else {
  throw new Error('No vite config file found.');
}

let viteConfig = fs.readFileSync(viteConfigBasePath + viteConfigExtension, { encoding: 'utf-8' });

const lastCommaIndex = viteConfig.lastIndexOf(',');
const configs = `,\n\tbase: './',\n\tbuild: { outDir: '../../dist/web' }`;

viteConfig = viteConfig.substring(0, lastCommaIndex) + configs + viteConfig.substring(lastCommaIndex);

try {
  fs.writeFileSync(viteConfigBasePath + viteConfigExtension, viteConfig);
  console.log('** Vite config sucessfully updated.');
} catch (err) {
  console.log('** Something went wrong writing to vite config file.');
}

// TODO: cut packages from web/package.json and add them to root package.json
