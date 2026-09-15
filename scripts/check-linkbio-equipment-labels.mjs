import fs from 'node:fs';

const source = fs.readFileSync('linkbio/experience.html', 'utf8');
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

  cards.forEach((card, index) => {
    if (/<span>[^<]+<\/span>/.test(card)) {
      fail(`Card ${index + 1} ainda possui micro-rótulo acima do título`);
    }
  });
}

if (failures.length) {
  console.error('Equipment label check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Equipment label check PASS');
console.log('Os seis cards de equipamentos não possuem micro-rótulos acima dos títulos.');
