import fs from 'node:fs';

const source = fs.readFileSync('linkbio/experience.html', 'utf8');
const css = fs.readFileSync('assets/css/linkbio-color-sequence.css', 'utf8');
const sectionMatch = source.match(/<section class="bp-section bp-section-soft" id="equipamentos"[\s\S]*?<\/section>/);

const failures = [];
const fail = (message) => failures.push(message);

if (!sectionMatch) {
  fail('Seção #equipamentos não encontrada');
} else {
  const section = sectionMatch[0];
  const cards = [...section.matchAll(/<a class="bp-equipment-photo"[\s\S]*?<\/a>/g)].map((match) => match[0]);

  if (cards.length !== 6) {
    fail(`Esperados 6 cards de equipamentos; encontrados ${cards.length}`);
  }

  const labels = cards.filter((card) => /<span>[^<]+<\/span>/.test(card));
  if (labels.length !== 6) {
    fail(`Estrutura esperada com 6 micro-rótulos não encontrada; encontrados ${labels.length}`);
  }
}

const hiddenRule = /#equipamentos\s+\.bp-equipment-photo\s+span\s*\{[^}]*display\s*:\s*none\s*;?[^}]*\}/s;
if (!hiddenRule.test(css)) {
  fail('Os micro-rótulos dos cards de equipamentos precisam estar ocultos por CSS');
}

if (failures.length) {
  console.error('Equipment label check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Equipment label check PASS');
console.log('Os seis micro-rótulos dos cards de equipamentos ficam ocultos sem afetar títulos, imagens ou links.');
