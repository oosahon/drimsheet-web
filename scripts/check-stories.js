import fs from 'fs';
import path from 'path';

function findMissingStories(dir) {
  const missing = [];

  function scan(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(currentDir, entry.name));
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.tsx') &&
        entry.name !== 'index.tsx' &&
        !entry.name.endsWith('.stories.tsx') &&
        !entry.name.endsWith('.test.tsx') &&
        !entry.name.endsWith('.container.tsx')
      ) {
        const filePath = path.join(currentDir, entry.name);
        const parts = filePath.split(path.sep);

        const isInUI = parts.includes('components');
        const isPartsComponent =
          /[\\/][^\\/]*components[\\/][^\\/]+[\\/]parts([\\/]|$)/.test(
            filePath
          );

        if (isInUI && !isPartsComponent) {
          const dirname = path.dirname(filePath);
          const basename = path.basename(entry.name, '.tsx');

          const storyPath = path.join(dirname, `${basename}.stories.tsx`);
          const legacyStoryPath = path.join(
            dirname,
            '__stories__',
            `${basename}.stories.tsx`
          );
          const iconSetStoryPath = path.join(dirname, 'icons.stories.tsx');

          if (
            !(
              path.basename(dirname) === 'icons' &&
              fs.existsSync(iconSetStoryPath)
            ) &&
            !fs.existsSync(storyPath) &&
            !fs.existsSync(legacyStoryPath)
          ) {
            missing.push(filePath);
          }
        }
      }
    }
  }

  scan(dir);
  return missing;
}

const srcPath = path.join(process.cwd(), 'src');
const missing = findMissingStories(srcPath);

if (missing.length > 0) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'Error: Missing Storybook documentation for the following components:'
  );
  missing.forEach((file) => {
    const relPath = path.relative(process.cwd(), file);
    console.error(`  - ${relPath}`);
  });
  console.error(
    '\x1b[33m%s\x1b[0m',
    'Please create the corresponding co-located stories before pushing.'
  );
  process.exit(1);
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    '✅ All UI components have corresponding Storybook documentation.'
  );
  process.exit(0);
}
