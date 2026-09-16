import fs from 'node:fs';

const html = fs.readFileSync('linkbio/experience.html', 'utf8');
const css = fs.readFileSync('assets/css/linkbio-experience.css', 'utf8');
const failures = [];

const brandsIndex = html.indexOf('class="bp-brands"');
const headerIndex = html.indexOf('class="bp-header"');
const heroIndex = html.indexOf('class="bp-editorial-hero"');

if (!(brandsIndex >= 0 && headerIndex > brandsIndex && heroIndex > headerIndex)) {
  failures.push('ordem precisa permanecer Marcas -> Header -> Hero para o header entrar no fluxo antes de ficar sticky');
}

const headerRule = css.match(/\.bp-header\s*\{([^}]*)\}/s)?.[1] || '';
if (!/position\s*:\s*sticky\s*;/i.test(headerRule)) {
  failures.push('header precisa usar position: sticky');
}
if (!/top\s*:\s*0\s*;/i.test(headerRule)) {
  failures.push('header sticky precisa encostar no topo do viewport');
}
if (/position\s*:\s*fixed\s*;/i.test(headerRule)) {
  failures.push('header não pode ficar fixed o tempo todo');
}

const experienceRule = css.match(/\.bp-experience\s*\{([^}]*)\}/s)?.[1] || '';
if (/overflow\s*:\s*(hidden|auto|scroll)\s*;/i.test(experienceRule)) {
  failures.push('ancestral .bp-experience não pode criar scroll container que bloqueie o sticky relativo ao viewport');
}

if (failures.length) {
  console.error('Link Bio sticky header check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio sticky header check PASS');
