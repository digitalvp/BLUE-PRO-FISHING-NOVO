import fs from 'node:fs';

const source = fs.readFileSync('linkbio/experience.html', 'utf8');
const behavior = fs.readFileSync('assets/js/linkbio-experience.js', 'utf8');
const interactions = fs.readFileSync('assets/css/linkbio-interactions.css', 'utf8');
const sectionMatch = source.match(/<section class="bp-section bp-section-white" id="categorias"[\s\S]*?<\/section>/);

const failures = [];
const fail = (message) => failures.push(message);

if (!sectionMatch) {
  fail('Seção #categorias não encontrada');
} else {
  const section = sectionMatch[0];
  const cards = [...section.matchAll(/<article class="bp-photo-card(?: bp-photo-card-wide)?">([\s\S]*?)<\/article>/g)];

  if (cards.length !== 4) {
    fail(`A seção deve manter exatamente 4 cards de categoria; encontrados ${cards.length}`);
  }

  for (const [, body] of cards) {
    const links = [...body.matchAll(/<a href="([^"]+)" target="_blank" rel="noopener noreferrer">/g)];
    if (links.length !== 1) fail('Cada card deve manter exatamente um CTA de destino');
    const href = links[0]?.[1] ?? '';
    if (!/^https:\/\/(?:api\.whatsapp\.com|wa\.me)\//.test(href)) {
      fail(`Card com destino inesperado: ${href || '(ausente)'}`);
    }
  }
}

if (!/document\.querySelectorAll\(['"]\.bp-photo-card['"]\)/.test(behavior)) {
  fail('JS deve preparar todos os cards de categoria para clique integral');
}
if (!/card\.addEventListener\(['"]click['"]/.test(behavior)) {
  fail('Cards devem responder ao clique em toda a superfície');
}
if (!/event\.target\.closest\(['"]a['"]\)/.test(behavior)) {
  fail('Clique direto no CTA precisa ser preservado sem disparo duplicado');
}
if (!/cta\.click\(\)/.test(behavior)) {
  fail('Clique no card deve reutilizar o CTA oficial existente');
}
if (!/card\.dataset\.cardLinkReady\s*=\s*['"]true['"]/.test(behavior)) {
  fail('Card clicável deve receber marcador de estado para estilo e inspeção');
}
if (!/\.bp-photo-card\[data-card-link-ready=["']true["']\][^{]*\{[^}]*cursor:\s*pointer/s.test(interactions)) {
  fail('Card clicável deve comunicar interação com cursor pointer');
}

if (failures.length) {
  console.error('Category card link check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Category card link check PASS');
console.log('Os 4 cards reutilizam seus CTAs oficiais e respondem ao clique em toda a superfície.');
