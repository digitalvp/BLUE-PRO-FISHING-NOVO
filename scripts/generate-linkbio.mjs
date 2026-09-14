import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const HOME = path.join(ROOT, 'index.html');
const TEMPLATE = path.join(ROOT, 'linkbio', 'template.html');
const OUTPUT = path.join(ROOT, 'linkbio', 'index.html');
const TOKEN = '<!-- BLUE_HOME_CONTINUATION -->';

const [home, template] = await Promise.all([
  fs.readFile(HOME, 'utf8'),
  fs.readFile(TEMPLATE, 'utf8'),
]);

const tokenCount = template.split(TOKEN).length - 1;
if (tokenCount !== 1) {
  throw new Error(`Expected exactly one ${TOKEN} token; found ${tokenCount}.`);
}

const bodyOpenMatches = [...home.matchAll(/<body(?:\s[^>]*)?>/gi)];
const bodyCloseMatches = [...home.matchAll(/<\/body>/gi)];
if (bodyOpenMatches.length !== 1 || bodyCloseMatches.length !== 1) {
  throw new Error(`Canonical Home must contain exactly one body pair; found ${bodyOpenMatches.length}/${bodyCloseMatches.length}.`);
}

const start = bodyOpenMatches[0].index + bodyOpenMatches[0][0].length;
const end = bodyCloseMatches[0].index;
if (end <= start) throw new Error('Canonical Home body extraction failed.');

let fragment = home.slice(start, end).trim();
fragment = fragment
  .replace(/\b(src|href)=(['"])assets\//gi, '$1=$2/assets/')
  .replace(/\bsrcset=(['"])assets\//gi, 'srcset=$1/assets/')
  .replace(/\bsrc=(['"])\.\/assets\//gi, 'src=$1/assets/')
  .replace(/\bhref=(['"])\.\/assets\//gi, 'href=$1/assets/');

const continuation = `<div class="linkbio-continuation" id="site-original">\n${fragment}\n</div>`;
const output = template.replace(TOKEN, continuation);

let previous = '';
try {
  previous = await fs.readFile(OUTPUT, 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

if (previous !== output) {
  await fs.writeFile(OUTPUT, output, 'utf8');
  console.log('linkbio/index.html generated');
} else {
  console.log('linkbio/index.html already up to date');
}
