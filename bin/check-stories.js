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
        entry.name !== 'index.tsx'
      ) {
        const filePath = path.join(currentDir, entry.name);
        const parts = filePath.split(path.sep);

        // Ensure file is in an exact 'ui' directory, or a subfolder of 'ui', but not in '__stories__'
        const isInUI = parts.includes('ui');
        const isNotStory = !parts.includes('__stories__');
        const isNotTest = !parts.includes('__tests__');
        const isNotContainer = !parts.includes('container');

        if (isInUI && isNotStory && isNotTest && isNotContainer) {
          const dirname = path.dirname(filePath);
          const basename = path.basename(entry.name, '.tsx');

          // Expected story path: [dirname]/__stories__/[basename].stories.tsx
          const storyPath = path.join(
            dirname,
            '__stories__',
            `${basename}.stories.tsx`
          );

          if (!fs.existsSync(storyPath)) {
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
    'Please create the corresponding stories in the __stories__ directory before pushing.'
  );
  process.exit(1);
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    '✅ All UI components have corresponding Storybook documentation.'
  );
  process.exit(0);
}
