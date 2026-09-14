import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { findMissingStories } from './check-stories.js';

const fixtureRoots = [];

function createComponentFixture(name = 'example') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'stories-check-'));
  const srcPath = path.join(root, 'src');
  const componentPath = path.join(srcPath, 'feature', 'components', name);
  fixtureRoots.push(root);
  fs.mkdirSync(componentPath, { recursive: true });

  return { componentPath, srcPath };
}

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('findMissingStories', () => {
  it('accepts a root component story in __stories__', () => {
    const { componentPath, srcPath } = createComponentFixture();
    fs.writeFileSync(path.join(componentPath, 'example.tsx'), 'export {};\n');
    fs.mkdirSync(path.join(componentPath, '__stories__'));
    fs.writeFileSync(
      path.join(componentPath, '__stories__', 'example.stories.tsx'),
      'export default {};\n'
    );

    expect(findMissingStories(srcPath)).toEqual([]);
  });

  it('accepts a private part story in the mirrored support path', () => {
    const { componentPath, srcPath } = createComponentFixture();
    fs.mkdirSync(path.join(componentPath, 'parts'));
    fs.mkdirSync(path.join(componentPath, '__stories__', 'parts'), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(componentPath, 'parts', 'detail.tsx'),
      'export {};\n'
    );
    fs.writeFileSync(
      path.join(componentPath, '__stories__', 'parts', 'detail.stories.tsx'),
      'export default {};\n'
    );

    expect(findMissingStories(srcPath)).toEqual([]);
  });

  it('accepts one aggregate story for the shared icon set', () => {
    const { componentPath, srcPath } = createComponentFixture('icons');
    fs.writeFileSync(path.join(componentPath, 'google.tsx'), 'export {};\n');
    fs.mkdirSync(path.join(componentPath, '__stories__'));
    fs.writeFileSync(
      path.join(componentPath, '__stories__', 'icons.stories.tsx'),
      'export default {};\n'
    );

    expect(findMissingStories(srcPath)).toEqual([]);
  });

  it('reports a component with no canonical story', () => {
    const { componentPath, srcPath } = createComponentFixture();
    const sourcePath = path.join(componentPath, 'example.tsx');
    fs.writeFileSync(sourcePath, 'export {};\n');

    expect(findMissingStories(srcPath)).toEqual([sourcePath]);
  });

  it('does not accept a legacy file-adjacent story', () => {
    const { componentPath, srcPath } = createComponentFixture();
    const sourcePath = path.join(componentPath, 'example.tsx');
    fs.writeFileSync(sourcePath, 'export {};\n');
    fs.writeFileSync(
      path.join(componentPath, 'example.stories.tsx'),
      'export default {};\n'
    );

    expect(findMissingStories(srcPath)).toEqual([sourcePath]);
  });
});
