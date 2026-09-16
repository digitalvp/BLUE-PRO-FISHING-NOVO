import fs from 'node:fs';

const html = fs.readFileSync('linkbio/experience.html', 'utf8');
const experienceCss = fs.readFileSync('assets/css/linkbio-experience.css', 'utf8');
const colorCss = fs.readFileSync('assets/css/linkbio-color-sequence.css', 'utf8');
const cssCascade = `${experienceCss}\n${colorCss}`;
const failures = [];

const brandsIndex = html.indexOf('class="bp-brands"');
const headerIndex = html.indexOf('class="bp-header"');
const heroIndex = html.indexOf('class="bp-editorial-hero"');

if (!(brandsIndex >= 0 && headerIndex > brandsIndex && heroIndex > headerIndex)) {
  failures.push('ordem precisa permanecer Marcas -> Header -> Hero para o header entrar no fluxo antes de ficar sticky');
}

const headerRule = experienceCss.match(/\.bp-header\s*\{([^}]*)\}/s)?.[1] || '';
if (!/position\s*:\s*sticky\s*;/i.test(headerRule)) {
  failures.push('header precisa usar position: sticky');
}
if (!/top\s*:\s*0\s*;/i.test(headerRule)) {
  failures.push('header sticky precisa encostar no topo do viewport');
}
if (/position\s*:\s*fixed\s*;/i.test(headerRule)) {
  failures.push('header não pode ficar fixed o tempo todo');
}

const experienceRules = [...cssCascade.matchAll(/\.bp-experience\s*\{([^}]*)\}/gs)].map((match) => match[1]);
const overflowDeclarations = experienceRules.flatMap((rule) => [...rule.matchAll(/overflow\s*:\s*([^;]+)\s*;/gi)].map((match) => match[1].trim()));
const effectiveOverflow = overflowDeclarations.at(-1) || 'visible';

if (/^(hidden|auto|scroll)$/i.test(effectiveOverflow)) {
  failures.push('overflow efetivo de .bp-experience precisa ser visible para o sticky usar o viewport como referência');
}

if (failures.length) {
  console.error('Link Bio sticky header check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio sticky header check PASS');
