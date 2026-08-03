import { access, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const buildDir = resolve('build');
const html = await readFile(resolve(buildDir, 'index.html'), 'utf8');
const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(
  ([, path]) => path,
);

if (!assetPaths.some((path) => path.endsWith('.css'))) {
  throw new Error('Build verification failed: index.html has no CSS asset.');
}
if (!assetPaths.some((path) => path.endsWith('.js'))) {
  throw new Error('Build verification failed: index.html has no JS asset.');
}

for (const assetPath of assetPaths) {
  const filePath = resolve(buildDir, assetPath.replace(/^\//, ''));
  await access(filePath);
  const fileStat = await stat(filePath);
  if (fileStat.size === 0) throw new Error(`Build asset is empty: ${assetPath}`);
}

await access(resolve(buildDir, '_redirects'));
await access(resolve(buildDir, '_headers'));
console.log(`Build verified: ${assetPaths.length} referenced assets are present.`);
