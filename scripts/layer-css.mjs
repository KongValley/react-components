import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const input = resolve(distDir, 'style.css');
const output = resolve(distDir, 'style.layer.css');

let css = readFileSync(input, 'utf8');

// @charset is only valid at the very top level, outside the layer block.
css = css
  .replace(/^@charset[^;]+;\s*/, '')
  .replace(/\/\*\$vite\$:\d+\*\/\s*$/, '')
  .trimEnd();

const banner = `/*!
 * RC UI layered stylesheet
 * Import this file instead of style.css to place every component style in the
 * "rcui" cascade layer. Hosts can declare their own ordering, for example:
 *   @layer reset, rcui, app;
 */
@layer rcui {
${css}
}
`;

writeFileSync(output, banner);
console.log(`[layers] wrote ${output}`);
