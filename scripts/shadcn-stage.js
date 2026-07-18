import { spawnSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const args = process.argv.slice(2);
const componentsConfigPath = path.join(root, 'components.json');

if (args.length === 0) {
  console.error('Usage: npm run shadcn:stage -- <registry-item...>');
  process.exit(1);
}

if (args.includes('--overwrite')) {
  console.error(
    'Refusing to run shadcn with --overwrite. Use .agents/workflow/shadcn-ui.md and get explicit user approval first.'
  );
  process.exit(1);
}

if (!fs.existsSync(componentsConfigPath)) {
  console.error('components.json was not found.');
  process.exit(1);
}

const componentsConfig = JSON.parse(
  fs.readFileSync(componentsConfigPath, 'utf8')
);
const landingDirs = collectLandingDirs(componentsConfig.aliases ?? {});
const collisions = findCanonicalCollisions(args);

if (collisions.length > 0) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'Refusing to stage over owned components:'
  );
  for (const collision of collisions) {
    console.error(`  - ${collision}`);
  }
  console.error('Use .agents/workflow/shadcn-ui.md for these items.');
  process.exit(1);
}

const before = snapshot(landingDirs);
const commandArgs = ['add', ...args];
const shadcnBin = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'shadcn.cmd' : 'shadcn'
);

if (!fs.existsSync(shadcnBin)) {
  console.error(
    'Local shadcn executable was not found. Run npm install first.'
  );
  process.exit(1);
}

const result = spawnSync(shadcnBin, commandArgs, {
  cwd: root,
  stdio: 'inherit',
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const after = snapshot(landingDirs);
const changes = diffSnapshots(before, after);

console.log('\nShadcn landing-file inventory:');

if (changes.length === 0) {
  console.log('  No landing files were created or modified.');
} else {
  for (const change of changes) {
    console.log(
      `  ${change.status.padEnd(8)} ${path.relative(root, change.file)}`
    );
  }
}

function collectLandingDirs(aliases) {
  return [
    aliases.components,
    aliases.ui,
    aliases.hooks,
    aliases.lib,
    aliases.utils,
  ]
    .filter(Boolean)
    .map(resolveAliasPath)
    .filter((value, index, all) => all.indexOf(value) === index);
}

function resolveAliasPath(aliasPath) {
  if (aliasPath.startsWith('@/')) {
    return path.join(root, 'src', aliasPath.slice(2));
  }

  return path.resolve(root, aliasPath);
}

function findCanonicalCollisions(items) {
  return items
    .filter((item) => !item.startsWith('-'))
    .map((item) => item.split('/').pop())
    .map((item) => item?.replace(/\.json$/, ''))
    .filter(Boolean)
    .flatMap((name) => {
      const matches = [];
      walk(path.join(root, 'src'), (fullPath, entry) => {
        if (
          entry.isDirectory() &&
          path.basename(path.dirname(fullPath)) === 'components' &&
          path.basename(fullPath) === name
        ) {
          matches.push(path.relative(root, fullPath));
        }
      });
      return matches;
    });
}

function snapshot(dirs) {
  const files = new Map();

  for (const dir of dirs) {
    walk(dir, (fullPath, entry) => {
      if (!entry.isFile()) {
        return;
      }

      files.set(fullPath, hashFile(fullPath));
    });
  }

  return files;
}

function diffSnapshots(before, after) {
  const changes = [];

  for (const [file, hash] of after.entries()) {
    if (!before.has(file)) {
      changes.push({ file, status: 'created' });
      continue;
    }

    if (before.get(file) !== hash) {
      changes.push({ file, status: 'modified' });
    }
  }

  for (const file of before.keys()) {
    if (!after.has(file)) {
      changes.push({ file, status: 'removed' });
    }
  }

  return changes.sort((a, b) => a.file.localeCompare(b.file));
}

function hashFile(filePath) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(filePath))
    .digest('hex');
}

function walk(dir, visitor) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      visitor(fullPath, entry);
      walk(fullPath, visitor);
      continue;
    }

    visitor(fullPath, entry);
  }
}
