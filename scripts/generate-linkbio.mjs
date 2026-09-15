import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TEMPLATE = path.join(ROOT, 'linkbio', 'template.html');
const EXPERIENCE = path.join(ROOT, 'linkbio', 'experience.html');
const OUTPUT = path.join(ROOT, 'linkbio', 'index.html');
const TOKEN = '<!-- BLUE_HOME_CONTINUATION -->';

const [template, experience] = await Promise.all([
  fs.readFile(TEMPLATE, 'utf8'),
  fs.readFile(EXPERIENCE, 'utf8'),
]);

const tokenCount = template.split(TOKEN).length - 1;
if (tokenCount !== 1) {
  throw new Error(`Expected exactly one ${TOKEN} token; found ${tokenCount}.`);
}

const fragment = experience.trim();
if (!fragment.includes('id="explore-blue"')) {
  throw new Error('Link Bio experience must expose #explore-blue.');
}

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
  console.log('linkbio/index.html generated from linkbio/experience.html');
} else {
  console.log('linkbio/index.html already up to date');
}
