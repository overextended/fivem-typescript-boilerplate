import { readFile, writeFile, stat, mkdir, unlink } from 'fs/promises';
import { spawn } from 'child_process';

/**
 * Check if a filepath is valid.
 * @param path {string}
 */
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (err) {}
}

/**
 * Spawn a child process and executes the command asynchronously.
 * @param command {string}
 */
function exec(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: 'inherit', shell: true });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve({ code, signal });
      } else {
        reject(new Error(`Command '${command}' exited with code ${code} and signal ${signal}`));
      }
    });
  });
}

try {
  if (!(await exists('src/web'))) await mkdir('src/web');

  await exec('pnpm i');
  await exec('cd src/web && pnpm create vite .');

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
