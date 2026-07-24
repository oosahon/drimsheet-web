import fs from 'fs';
import path from 'path';

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const sharedRoot = path.join(root, 'src/shared');
const obsoleteSharedDirs = ['config', 'context', 'services', 'ui', 'utils'];
const obsoleteSharedComponentDirs = ['ui', 'lib'];
const staleImportPatterns = [
  /@\/components\/ui(\/|['"])/,
  /@\/lib\/utils(\/|['"])/,
  /@\/hooks(\/|['"])/,
  /@\/shared\/components\/ui(\/|['"])/,
  /@\/shared\/components\/lib(\/|['"])/,
];
const errors = [];

function walk(dir, visitor) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      visitor(fullPath, entry);
      walk(fullPath, visitor);
      continue;
    }

    visitor(fullPath, entry);
  }
}

function relative(filePath) {
  return path.relative(root, filePath);
}

for (const dir of obsoleteSharedDirs) {
  const fullPath = path.join(sharedRoot, dir);
  if (fs.existsSync(fullPath)) {
    errors.push(`Remove obsolete shared directory: ${relative(fullPath)}`);
  }
}

const sharedComponentsRoot = path.join(sharedRoot, 'components');
if (fs.existsSync(sharedComponentsRoot)) {
  for (const dir of obsoleteSharedComponentDirs) {
    const fullPath = path.join(sharedComponentsRoot, dir);
    if (fs.existsSync(fullPath)) {
      errors.push(
        `Remove obsolete shadcn landing bucket: ${relative(fullPath)}`
      );
    }
  }

  for (const entry of fs.readdirSync(sharedComponentsRoot, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(sharedComponentsRoot, entry.name);
    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      errors.push(
        `Move flat shared component file into its own directory: ${relative(fullPath)}`
      );
    }
  }
}

walk(srcRoot, (fullPath, entry) => {
  if (
    !entry.isDirectory() ||
    path.basename(path.dirname(fullPath)) !== 'components'
  ) {
    return;
  }

  const name = path.basename(fullPath);
  if (name.startsWith('__')) {
    return;
  }

  const indexPath = path.join(fullPath, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    errors.push(`Add component public entry point: ${relative(indexPath)}`);
  }
});

const featureRoots = fs
  .readdirSync(srcRoot, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      entry.name !== 'shared' &&
      entry.name !== '_app' &&
      !entry.name.startsWith('.')
  )
  .map((entry) => entry.name);

walk(srcRoot, (fullPath, entry) => {
  if (entry.isFile() && path.basename(path.dirname(fullPath)) === 'lib') {
    errors.push(
      `Move file into a responsibility directory under lib: ${relative(fullPath)}`
    );
  }
});

walk(sharedRoot, (fullPath, entry) => {
  if (!entry.isFile() || !/\.(ts|tsx)$/.test(entry.name)) {
    return;
  }

  const source = fs.readFileSync(fullPath, 'utf8');

  for (const pattern of staleImportPatterns) {
    if (pattern.test(source)) {
      errors.push(
        `Rewrite stale shadcn landing import in ${relative(fullPath)}`
      );
      break;
    }
  }

  for (const feature of featureRoots) {
    const featureImport = new RegExp(`@/${feature}(/|['"])`);
    if (featureImport.test(source)) {
      errors.push(
        `Remove shared-to-feature import from ${relative(fullPath)} to src/${feature}`
      );
      break;
    }
  }
});

if (errors.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Structure check failed:');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', 'Shared structure check passed.');
