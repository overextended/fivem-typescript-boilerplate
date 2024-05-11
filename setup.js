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

try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json'));
  const webPackage = JSON.parse(fs.readFileSync('src/web/package.json'));

  const newPackage = rootPackage;
  newPackage.dependencies = { ...newPackage.dependencies, ...webPackage.dependencies };
  newPackage.devDependencies = { ...newPackage.devDependencies, ...webPackage.devDependencies };

  fs.writeFileSync('package.json', JSON.stringify(newPackage, null, 2));

  console.log('** Successfully overriden root package.json');
} catch (err) {
  console.log('** There was an error overriding root package.json');
}

try {
  fs.unlinkSync('src/web/package.json');

  console.log('** Removed the package.json from web the directory.');
} catch (err) {
  console.log('** There was an error removing the package.json from the web directory.');
}
