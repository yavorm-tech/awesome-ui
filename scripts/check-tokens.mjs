// Fails when library source bypasses design tokens. See CLAUDE.md, "Token rules".
// Scans packages/*/src (except packages/tokens, tests and stories).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const packagesDir = join(root, 'packages');

// `neutral` is deliberately absent: it is one of our intents.
const TW_PALETTE =
  'slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const COLOR_UTILS =
  'bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|fill|stroke|from|via|to|divide|shadow|accent|caret|decoration|placeholder';

const RULES = [
  {
    name: 'dark: variant',
    why: 'light/dark differences must come from tokens (semantic/intent colors swap per mode)',
    re: /(?<![\w-])dark:/g,
  },
  {
    name: 'hard-coded color',
    why: 'use a color token class (bg-primary-solid, text-text-muted, …)',
    re: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g,
  },
  {
    name: 'Tailwind default palette',
    why: 'use token colors (primary, secondary, neutral, success, warning, danger, info, surface, text, border)',
    re: new RegExp(`\\b(?:${COLOR_UTILS})-(?:(?:${TW_PALETTE})-\\d{2,3}|black|white)\\b`, 'g'),
  },
  {
    name: 'arbitrary size',
    why: 'use spacing / density / radius tokens instead of bracketed lengths',
    re: /-\[-?\d*\.?\d+(?:px|rem|em)\]/g,
  },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '__tests__') continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry)) out.push(path);
  }
  return out;
}

const problems = [];
for (const pkg of readdirSync(packagesDir)) {
  const src = join(packagesDir, pkg, 'src');
  if (pkg === 'tokens' || !statSync(join(packagesDir, pkg)).isDirectory()) continue;
  let files;
  try {
    files = walk(src);
  } catch {
    continue;
  }
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (line.includes('check-tokens-ignore')) return;
      for (const rule of RULES) {
        for (const match of line.matchAll(rule.re)) {
          problems.push(
            `${relative(root, file)}:${i + 1}  ${rule.name} "${match[0]}" — ${rule.why}`,
          );
        }
      }
    });
  }
}

if (problems.length) {
  console.error(`check-tokens: ${problems.length} problem(s)\n\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('check-tokens: OK');
