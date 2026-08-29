import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import ts from 'typescript';

const obsoleteSharedDirs = ['config', 'context', 'services', 'ui', 'utils'];
const obsoleteSharedComponentDirs = ['ui', 'lib'];
const staleImportPatterns = [
  /@\/components\/ui(\/|['"])/,
  /@\/lib\/utils(\/|['"])/,
  /@\/hooks(\/|['"])/,
  /@\/shared\/components\/ui(\/|['"])/,
  /@\/shared\/components\/lib(\/|['"])/,
];

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

function getModuleExportCounts(filePath) {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  let defaultExportCount = 0;
  let namedExportCount = 0;

  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement)) {
      defaultExportCount += statement.isExportEquals ? 0 : 1;
      namedExportCount += statement.isExportEquals ? 1 : 0;
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      namedExportCount += 1;
      continue;
    }

    const modifiers = ts.canHaveModifiers(statement)
      ? ts.getModifiers(statement)
      : undefined;
    const isExported = modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    );

    if (!isExported) {
      continue;
    }

    const isDefault = modifiers.some(
      (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword
    );

    if (isDefault) {
      defaultExportCount += 1;
    } else {
      namedExportCount += 1;
    }
  }

  return { defaultExportCount, namedExportCount };
}

function indexReferencesHelper(indexPath, componentName) {
  if (!fs.existsSync(indexPath)) {
    return false;
  }

  const sourceFile = ts.createSourceFile(
    indexPath,
    fs.readFileSync(indexPath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const helperSpecifier = `./${componentName}.helper`;

  return sourceFile.statements.some((statement) => {
    if (
      !ts.isImportDeclaration(statement) &&
      !ts.isExportDeclaration(statement)
    ) {
      return false;
    }

    return (
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === helperSpecifier
    );
  });
}

function validateComponentHelpers(componentPath, componentName, relative) {
  const errors = [];
  const expectedHelperPath = path.join(
    componentPath,
    `${componentName}.helper.ts`
  );
  const expectedTestPath = path.join(
    componentPath,
    `${componentName}.helper.test.ts`
  );
  const legacyHelpersPath = path.join(componentPath, 'helpers');
  const helperFiles = [];

  if (fs.existsSync(legacyHelpersPath)) {
    errors.push(
      `Replace component helpers directory with ${relative(expectedHelperPath)}: ${relative(legacyHelpersPath)}`
    );
  }

  walk(componentPath, (fullPath, entry) => {
    if (
      entry.isFile() &&
      /\.helper(?:\.test)?\.ts$/.test(path.basename(fullPath))
    ) {
      helperFiles.push(fullPath);
    }
  });

  for (const helperFile of helperFiles) {
    if (helperFile !== expectedHelperPath && helperFile !== expectedTestPath) {
      errors.push(
        `Rename component helper to ${relative(expectedHelperPath)} or its matching test: ${relative(helperFile)}`
      );
    }
  }

  const helperExists = fs.existsSync(expectedHelperPath);
  const testExists = fs.existsSync(expectedTestPath);

  if (helperExists && !testExists) {
    errors.push(
      `Add consolidated component helper test: ${relative(expectedTestPath)}`
    );
  }

  if (!helperExists && testExists) {
    errors.push(
      `Remove orphan component helper test or add ${relative(expectedHelperPath)}: ${relative(expectedTestPath)}`
    );
  }

  if (helperExists) {
    const { defaultExportCount, namedExportCount } =
      getModuleExportCounts(expectedHelperPath);

    if (defaultExportCount !== 1 || namedExportCount !== 0) {
      errors.push(
        `Expose exactly one default helper object and no named exports: ${relative(expectedHelperPath)}`
      );
    }
  }

  const indexPath = path.join(componentPath, 'index.ts');
  if (indexReferencesHelper(indexPath, componentName)) {
    errors.push(
      `Keep the component helper private; remove its index reference: ${relative(indexPath)}`
    );
  }

  return errors;
}

export function checkStructure(root = process.cwd()) {
  const srcRoot = path.join(root, 'src');
  const sharedRoot = path.join(srcRoot, 'shared');
  const errors = [];
  const relative = (filePath) => path.relative(root, filePath);

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

    errors.push(...validateComponentHelpers(fullPath, name, relative));
  });

  const featureRoots = fs.existsSync(srcRoot)
    ? fs
        .readdirSync(srcRoot, { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isDirectory() &&
            entry.name !== 'shared' &&
            entry.name !== '_app' &&
            !entry.name.startsWith('.')
        )
        .map((entry) => entry.name)
    : [];

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

  return errors;
}

function run() {
  const errors = checkStructure();

  if (errors.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Structure check failed:');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('\x1b[32m%s\x1b[0m', 'Shared structure check passed.');
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  run();
}
