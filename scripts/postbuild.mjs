import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * tsc keeps side-effect imports such as `import "./Button.css";` in emitted
 * declaration files. Those paths do not exist in the published types, so strip
 * them from every .d.ts file after the declaration build.
 */
function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files;
}

const typesDir = resolve(process.cwd(), 'dist/types');
let cleaned = 0;

for (const file of walk(typesDir)) {
  const source = readFileSync(file, 'utf8');
  const next = source.replace(/^import\s+['"][^'"]+\.css['"];?\r?\n/gm, '');
  if (next !== source) {
    writeFileSync(file, next);
    cleaned += 1;
  }
}

console.log(`[postbuild] cleaned CSS side-effect imports in ${cleaned} declaration file(s).`);
