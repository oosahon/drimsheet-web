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
    fs.writeFileSync(
      path.join(componentPath, 'example.helper.ts'),
      helperSource
    );
  }

  if (helperTest) {
    fs.writeFileSync(
      path.join(componentPath, 'example.helper.test.ts'),
      "import exampleHelpers from './example.helper';\nvoid exampleHelpers;\n"
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
      indexSource:
        "export { default as exampleHelpers } from './example.helper';\n",
    });

    expect(checkStructure(root)).toEqual([
      expect.stringContaining('Keep the component helper private'),
    ]);
  });
});
