import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { checkStructure } from './check-structure.js';

const fixtureRoots = [];

function createFixture({
  helperSource,
  helperTest = true,
  indexSource = "export { Example } from './example';\n",
  legacyHelper = false,
  misnamedHelper = false,
} = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'structure-check-'));
  const componentPath = path.join(
    root,
    'src',
    'feature',
    'components',
    'example'
  );
  fixtureRoots.push(root);
  fs.mkdirSync(componentPath, { recursive: true });
  fs.writeFileSync(path.join(componentPath, 'index.ts'), indexSource);

  if (helperSource !== undefined) {
    fs.writeFileSync(path.join(componentPath, 'helper.ts'), helperSource);
  }

  if (helperTest) {
    const testsPath = path.join(componentPath, '__tests__');
    fs.mkdirSync(testsPath, { recursive: true });
    fs.writeFileSync(
      path.join(testsPath, 'helper.test.ts'),
      "import exampleHelpers from '@/feature/components/example/helper';\nvoid exampleHelpers;\n"
    );
  }

  if (legacyHelper) {
    const legacyPath = path.join(componentPath, 'helpers');
    fs.mkdirSync(legacyPath);
    fs.writeFileSync(
      path.join(legacyPath, 'get-example-value.helper.ts'),
      'export default function getExampleValue() {}\n'
    );
  }

  if (misnamedHelper) {
    fs.writeFileSync(
      path.join(componentPath, 'get-example-value.helper.ts'),
      'export default function getExampleValue() {}\n'
    );
  }

  return root;
}

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('checkStructure component helpers', () => {
  const validHelperSource = `
function getValue() {
  return 'value';
}

const exampleHelpers = Object.freeze({ getValue });

export default exampleHelpers;
`;

  it('accepts one consolidated helper module and matching test', () => {
    const root = createFixture({ helperSource: validHelperSource });

    expect(checkStructure(root)).toEqual([]);
  });

  it('rejects a component helpers directory', () => {
    const root = createFixture({
      helperSource: validHelperSource,
      legacyHelper: true,
    });

    expect(checkStructure(root)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Replace component helpers directory'),
      ])
    );
  });

  it('rejects an operation-named helper module', () => {
    const root = createFixture({
      helperSource: validHelperSource,
      misnamedHelper: true,
    });

    expect(checkStructure(root)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Rename component helper'),
      ])
    );
  });

  it('requires one matching helper test', () => {
    const root = createFixture({
      helperSource: validHelperSource,
      helperTest: false,
    });

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('Add consolidated component helper test'),
    ]);
  });

  it('rejects named exports from the helper module', () => {
    const root = createFixture({
      helperSource: `${validHelperSource}\nexport const extra = true;\n`,
    });

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('Expose exactly one default helper object'),
    ]);
  });

  it('rejects helper references from the component barrel', () => {
    const root = createFixture({
      helperSource: validHelperSource,
      indexSource: "export { default as exampleHelpers } from './helper';\n",
    });

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('Keep component helpers and parts private'),
    ]);
  });
});

describe('checkStructure component skeletons', () => {
  it('accepts owner-local skeleton names and semantic variants', () => {
    const root = createFixture({ helperTest: false });
    const componentPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example'
    );
    fs.mkdirSync(path.join(componentPath, '__tests__'), { recursive: true });
    fs.mkdirSync(path.join(componentPath, '__stories__'), { recursive: true });
    fs.writeFileSync(path.join(componentPath, 'skeleton.tsx'), 'export {};\n');
    fs.writeFileSync(
      path.join(componentPath, 'table-skeleton.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, '__tests__', 'skeleton.test.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, '__stories__', 'skeleton.stories.tsx'),
      'export default {};\n'
    );

    expect(checkStructure(root)).toEqual([]);
  });

  it('rejects owner-prefixed skeleton names', () => {
    const root = createFixture({ helperTest: false });
    const componentPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example'
    );
    fs.mkdirSync(path.join(componentPath, '__tests__'), { recursive: true });
    fs.mkdirSync(path.join(componentPath, '__stories__'), { recursive: true });
    fs.writeFileSync(
      path.join(componentPath, 'example-skeleton.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, '__tests__', 'example-skeleton.test.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, '__stories__', 'example-skeleton.stories.tsx'),
      'export default {};\n'
    );

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('skeleton.tsx'),
      expect.stringContaining('skeleton.test.tsx'),
      expect.stringContaining('skeleton.stories.tsx'),
    ]);
  });
});

describe('checkStructure support directories', () => {
  it('accepts support directories for hooks and lib responsibilities', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'structure-check-'));
    const hooksPath = path.join(root, 'src', 'feature', 'hooks');
    const mappersPath = path.join(root, 'src', 'feature', 'lib', 'mappers');
    fixtureRoots.push(root);
    fs.mkdirSync(path.join(hooksPath, '__tests__'), { recursive: true });
    fs.mkdirSync(path.join(mappersPath, '__tests__'), { recursive: true });
    fs.writeFileSync(path.join(hooksPath, 'use-example.ts'), 'export {};\n');
    fs.writeFileSync(
      path.join(hooksPath, '__tests__', 'use-example.test.ts'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(mappersPath, 'example.mapper.ts'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(mappersPath, '__tests__', 'example.mapper.test.ts'),
      'export {};\n'
    );

    expect(checkStructure(root)).toEqual([]);
  });

  it('accepts tests and stories in owner-level support directories', () => {
    const root = createFixture({ helperTest: false });
    const componentPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example'
    );
    fs.mkdirSync(path.join(componentPath, '__tests__', 'parts'), {
      recursive: true,
    });
    fs.mkdirSync(path.join(componentPath, '__stories__', 'parts'), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(componentPath, '__tests__', 'parts', 'detail.test.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, '__stories__', 'parts', 'detail.stories.tsx'),
      'export default {};\n'
    );

    expect(checkStructure(root)).toEqual([]);
  });

  it('rejects legacy colocated tests and stories', () => {
    const root = createFixture({ helperTest: false });
    const componentPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example'
    );
    fs.writeFileSync(
      path.join(componentPath, 'example.test.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, 'example.stories.tsx'),
      'export default {};\n'
    );

    expect(checkStructure(root)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("owner's __tests__ directory"),
        expect.stringContaining("owner's __stories__ directory"),
      ])
    );
  });

  it('rejects support artifacts inside production parts', () => {
    const root = createFixture({ helperTest: false });
    const partsPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example',
      'parts'
    );
    fs.mkdirSync(partsPath, { recursive: true });
    fs.writeFileSync(path.join(partsPath, 'detail.test.tsx'), 'export {};\n');

    expect(checkStructure(root)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("owner's __tests__ directory"),
      ])
    );
  });

  it('rejects support-directory barrels', () => {
    const root = createFixture({ helperTest: false });
    const testsPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example',
      '__tests__'
    );
    fs.mkdirSync(testsPath, { recursive: true });
    fs.writeFileSync(path.join(testsPath, 'index.ts'), 'export {};\n');

    expect(checkStructure(root)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Remove support-directory barrel'),
      ])
    );
  });

  it('rejects empty support directories', () => {
    const root = createFixture({ helperTest: false });
    const storiesPath = path.join(
      root,
      'src',
      'feature',
      'components',
      'example',
      '__stories__'
    );
    fs.mkdirSync(storiesPath, { recursive: true });

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('Remove empty support directory'),
    ]);
  });

  it('rejects stories outside component owners', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'structure-check-'));
    const storiesPath = path.join(
      root,
      'src',
      'feature',
      'hooks',
      '__stories__'
    );
    fixtureRoots.push(root);
    fs.mkdirSync(storiesPath, { recursive: true });
    fs.writeFileSync(
      path.join(storiesPath, 'use-example.stories.tsx'),
      'export default {};\n'
    );

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('Place Storybook files under a component'),
    ]);
  });
});
