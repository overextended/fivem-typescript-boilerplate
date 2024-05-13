import { readFile, writeFile, stat, mkdir, unlink } from 'fs/promises';
import child_process from 'child_process';

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (err) {}
}

function exec(command) {
  return new Promise((resolve, reject) => {
    const child = child_process.spawn(command, {
      stdio: 'inherit', // Use 'inherit' to share the parent's stdio streams
      shell: true, // Use the shell to interpret the command
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve({ code, signal });
      } else {
        reject(new Error(`Command '${command}' exited with code ${code} and signal ${signal}`));
      }
    });
  });
}

if (!exists('src/web')) await mkdir('src/web');

await exec('pnpm i');
await exec('cd src/web && pnpm create vite .');

const viteConfigPath = `src/web/vite.config.ts`;

let viteConfig = await readFile(viteConfigPath, 'utf8');

const lastCommaIndex = viteConfig.lastIndexOf(',');
const configs = `,
  base: './',
  build: {
    outDir: '../../dist/web',
    emptyOutDir: true
  }`;

viteConfig = viteConfig.substring(0, lastCommaIndex) + configs + viteConfig.substring(lastCommaIndex);

try {
  await writeFile(viteConfigPath, viteConfig);
  console.info('** Successfully updated Vite config file.');
} catch (err) {
  console.error(`** Something went wrong writing to vite config file!\n${err}`);
  process.exit();
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
  console.log(`** There was an error overriding root package.json!\n${err}`);
}

try {
  await unlink('src/web/package.json');
} catch (err) {
  console.log(`** Failed to remove package.json from the web directory!\n${err}`);
}

await exec('pnpm i');
