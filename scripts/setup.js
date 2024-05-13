import { readFile, writeFile, mkdir, unlink } from 'fs/promises';
import { exists, exec } from './utils.js';

try {
  if (!(await exists('src/web'))) await mkdir('src/web');

  await exec('pnpm i && cd src/web && pnpm create vite .');

  const viteConfigPath = `src/web/vite.config.ts`;

  let viteConfig = await readFile(viteConfigPath, 'utf8').catch((err) => {
    throw new Error(`Failed to read file ${viteConfigPath}`);
  });

  const lastCommaIndex = viteConfig.lastIndexOf(',');

  viteConfig = `${viteConfig.substring(0, lastCommaIndex)},
  base: './',
  build: {
    outDir: '../../dist/web',
    emptyOutDir: true,
  }${viteConfig.substring(lastCommaIndex)}`;

  try {
    await writeFile(viteConfigPath, viteConfig);
    console.log(`** Successfully updated ${viteConfigPath}.`);
  } catch (err) {
    throw new Error(`** Failed to update ${viteConfigPath}!\n${err}`);
  }

  try {
    const rootPackage = JSON.parse(await readFile('package.json', 'utf8'));
    const webPackage = JSON.parse(await readFile('src/web/package.json', 'utf8'));
    const newPackage = rootPackage;

    newPackage.dependencies = { ...newPackage.dependencies, ...webPackage.dependencies };
    newPackage.devDependencies = { ...newPackage.devDependencies, ...webPackage.devDependencies };

    await writeFile('package.json', JSON.stringify(newPackage, null, 2));

    console.log('** Successfully updated package.json.');
  } catch (err) {
    throw new Error(`** There was an error overriding package.json!\n${err}`);
  }

  try {
    await unlink('src/web/package.json');
  } catch (err) {
    throw new Error(`** Failed to remove package.json from the web directory!\n${err}`);
  }

  await exec('pnpm i');
} catch (err) {
  console.error(err);
  process.exit(1);
}
