import fs from 'fs';
import path from 'path';

const root = process.cwd();
const sharedRoot = path.join(root, 'src/shared');
const obsoleteSharedDirs = ['config', 'context', 'services', 'ui', 'utils'];
const errors = [];

for (const dir of obsoleteSharedDirs) {
  const fullPath = path.join(sharedRoot, dir);
  if (fs.existsSync(fullPath)) {
    errors.push(
      `Remove obsolete shared directory: ${path.relative(root, fullPath)}`
    );
  }
}

const sharedComponentsRoot = path.join(sharedRoot, 'components');
if (fs.existsSync(sharedComponentsRoot)) {
  for (const entry of fs.readdirSync(sharedComponentsRoot, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(sharedComponentsRoot, entry.name);
    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      errors.push(
        `Move flat shared component file into its own directory: ${path.relative(root, fullPath)}`
      );
    }
  }
}

if (errors.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Structure check failed:');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', 'Shared structure check passed.');
