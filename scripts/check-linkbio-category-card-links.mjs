import fs from 'node:fs';

const source = fs.readFileSync('linkbio/experience.html', 'utf8');
const sectionMatch = source.match(/<section class="bp-section bp-section-white" id="categorias"[\s\S]*?<\/section>/);

const failures = [];
const fail = (message) => failures.push(message);

if (!sectionMatch) {
  fail('Seção #categorias não encontrada');
} else {
  const section = sectionMatch[0];
  const cardAnchors = [...section.matchAll(/<a class="bp-photo-card(?: bp-photo-card-wide)?" href="([^"]+)" target="_blank" rel="noopener noreferrer">([\s\S]*?)<\/a>/g)];

  if (cardAnchors.length !== 4) {
    fail(`Os 4 cards de categoria devem ser links inteiros; encontrados ${cardAnchors.length}`);
  }

  for (const [, href, body] of cardAnchors) {
    if (!/^https:\/\/(?:api\.whatsapp\.com|wa\.me)\//.test(href)) {
      fail(`Card com destino inesperado: ${href}`);
    }
    if (/<a\b/i.test(body)) {
      fail('Card clicável não pode conter link aninhado');
    }
    if (!/(?:Consultar opções|Falar com a equipe)/i.test(body)) {
      fail('Card deve preservar o CTA visual existente');
    }
  }
}

if (failures.length) {
  console.error('Category card link check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Category card link check PASS');
console.log('Os 4 cards de categorias são clicáveis por inteiro e preservam seus destinos de WhatsApp.');
