import fs from 'node:fs';

const source = fs.readFileSync('linkbio/experience.html', 'utf8');
const css = fs.readFileSync('assets/css/linkbio-experience.css', 'utf8');
const colorSequence = fs.readFileSync('assets/css/linkbio-color-sequence.css', 'utf8');

const failures = [];
const fail = (message) => failures.push(message);
const expectedCards = [
  {
    title: 'Carretilhas',
    href: 'https://api.whatsapp.com/send/?phone=5563991198453&text=Ol%C3%A1!%20Tenho%20interesse%20em%20carretilhas%20da%20Blue%20Pro%20Fishing.%20Quais%20op%C3%A7%C3%B5es%20voc%C3%AAs%20t%C3%AAm%3F',
  },
  {
    title: 'Varas',
    href: 'https://api.whatsapp.com/send/?phone=5563991198453&text=Ol%C3%A1!%20Tenho%20interesse%20em%20varas%20de%20pesca%20da%20Blue%20Pro%20Fishing.%20Quais%20op%C3%A7%C3%B5es%20voc%C3%AAs%20t%C3%AAm%3F',
  },
  {
    title: 'Iscas',
    href: 'https://api.whatsapp.com/send/?phone=5563991198453&text=Ol%C3%A1!%20Tenho%20interesse%20em%20iscas%20da%20Blue%20Pro%20Fishing.%20Quais%20op%C3%A7%C3%B5es%20voc%C3%AAs%20t%C3%AAm%3F',
  },
  {
    title: 'Embarcações',
    href: 'https://wa.me/5563992569790?text=Ol%C3%A1!%20Tenho%20interesse%20em%20solu%C3%A7%C3%B5es%20n%C3%A1uticas%20da%20Blue%20Pro%20Fishing.%20Quais%20op%C3%A7%C3%B5es%20voc%C3%AAs%20t%C3%AAm%3F',
  },
  {
    title: 'Camping',
    href: 'https://wa.me/5563992569790?text=Ol%C3%A1!%20Tenho%20interesse%20em%20itens%20de%20camping%20e%20lazer%20da%20Blue%20Pro%20Fishing.%20Quais%20op%C3%A7%C3%B5es%20voc%C3%AAs%20t%C3%AAm%3F',
  },
  {
    title: 'Acessórios',
    href: 'https://api.whatsapp.com/send/?phone=5563991198453&text=Ol%C3%A1!%20Tenho%20interesse%20em%20acess%C3%B3rios%20da%20Blue%20Pro%20Fishing.%20Podem%20me%20mostrar%20as%20op%C3%A7%C3%B5es%3F',
  },
];

function getRule(stylesheet, selector) {
  const start = stylesheet.indexOf(selector + '{');
  if (start < 0) return '';
  const bodyStart = start + selector.length + 1;
  const end = stylesheet.indexOf('}', bodyStart);
  return end < 0 ? '' : stylesheet.slice(bodyStart, end);
}

function requireDeclarations(stylesheet, selector, declarations) {
  const rule = getRule(stylesheet, selector);
  if (!rule) {
    fail('Regra CSS ausente: ' + selector);
    return;
  }
  for (const [pattern, message] of declarations) {
    if (!pattern.test(rule)) fail(message);
  }
}

function textContent(fragment) {
  return fragment.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const sectionMatch = source.match(/<section class="bp-section bp-section-soft" id="equipamentos"[\s\S]*?<\/section>/);

if (!sectionMatch) {
  fail('Seção #equipamentos não encontrada');
} else {
  const section = sectionMatch[0];
  const cards = [...section.matchAll(/<a class="bp-equipment-photo" href="([^"]+)" target="_blank" rel="noopener noreferrer">([\s\S]*?)<\/a>/g)]
    .map((match) => ({ href: match[1], body: match[2] }));

  if (cards.length !== expectedCards.length) {
    fail('Esperados 6 cards-âncora inteiramente clicáveis; encontrados ' + cards.length);
  }

  const imageSources = [];
  cards.forEach((card, index) => {
    const expected = expectedCards[index];
    if (!expected) return;

    const title = card.body.match(/<h3>([^<]+)<\/h3>/)?.[1]?.trim() ?? '';
    const cta = card.body.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? '';
    const image = card.body.match(/<img src="([^"]+)" alt="([^"]+)"/);
    const copyCount = (card.body.match(/class="bp-equipment-photo-copy"/g) || []).length;

    if (title !== expected.title) {
      fail('Card ' + (index + 1) + ': título esperado "' + expected.title + '"; encontrado "' + title + '"');
    }
    if (card.href !== expected.href) {
      fail('Card ' + expected.title + ': destino de WhatsApp foi alterado');
    }
    if (textContent(cta) !== 'Ver opções →') {
      fail('Card ' + expected.title + ': CTA deve ser exatamente "Ver opções →"');
    }
    if (/<span\b/i.test(card.body)) {
      fail('Card ' + expected.title + ': micro-rótulos span devem ser removidos do HTML');
    }
    if (copyCount !== 1) {
      fail('Card ' + expected.title + ': conteúdo precisa de um único overlay .bp-equipment-photo-copy');
    }
    if (!image) {
      fail('Card ' + expected.title + ': imagem com texto alternativo ausente');
    } else {
      if (!image[1].startsWith('/assets/')) {
        fail('Card ' + expected.title + ': imagem precisa ser um asset oficial local');
      }
      imageSources.push(image[1]);
    }
  });

  if (new Set(imageSources).size !== expectedCards.length) {
    fail('Os 6 cards precisam usar 6 imagens oficiais distintas');
  }
  if (/Consultar (?:modelos|opções) disponíveis/i.test(section)) {
    fail('Texto legado de catálogo deve ser removido dos cards');
  }
  if (/(?:>Pesca<|>Náutica<|>Outdoor<|>Complementos<)/i.test(section)) {
    fail('Micro-rótulos de categoria devem ser removidos');
  }
}

requireDeclarations(css, '.bp-equipment-editorial-grid', [
  [/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/, 'Desktop precisa manter 3 colunas'],
  [/gap:24px 20px/, 'Grade precisa do novo espaçamento editorial'],
]);

requireDeclarations(css, '#equipamentos .bp-section-intro', [
  [/margin-bottom:42px/, 'Título da seção precisa de 42px até a grade'],
]);

requireDeclarations(css, '.bp-equipment-photo', [
  [/position:relative/, 'Card precisa ser o contexto do overlay'],
  [/min-width:0/, 'Card precisa impedir overflow horizontal na grade'],
  [/height:360px/, 'Cards desktop precisam ter altura uniforme de 360px'],
  [/overflow:hidden/, 'Imagem e zoom precisam respeitar os cantos do card'],
  [/border-radius:16px/, 'Cards precisam de cantos arredondados de 16px'],
  [/cursor:pointer/, 'Card inteiro clicável precisa comunicar interação'],
]);

requireDeclarations(css, '.bp-equipment-photo::after', [
  [/position:absolute/, 'Overlay precisa cobrir a imagem'],
  [/inset:0/, 'Overlay precisa cobrir todo o card'],
  [/linear-gradient\(/, 'Overlay precisa usar degradê escuro'],
]);

requireDeclarations(css, '.bp-equipment-photo figure', [
  [/position:absolute/, 'Foto precisa ocupar o card inteiro'],
  [/inset:0/, 'Foto precisa preencher o card inteiro'],
]);

requireDeclarations(css, '.bp-equipment-photo>div', [
  [/position:absolute/, 'Título e CTA precisam ficar sobre a foto'],
  [/bottom:0/, 'Título e CTA precisam ficar no canto inferior'],
]);

requireDeclarations(css, '.bp-equipment-photo:hover,.bp-equipment-photo:focus-visible', [
  [/translateY\(-4px\)/, 'Hover/foco precisa elevar o card em 4px'],
  [/box-shadow:/, 'Hover/foco precisa aplicar sombra leve'],
]);

requireDeclarations(css, '.bp-equipment-photo:hover figure img,.bp-equipment-photo:focus-visible figure img', [
  [/scale\(1\.03\)/, 'Hover/foco precisa ampliar a imagem em 1.03'],
]);

requireDeclarations(css, '.bp-equipment-photo:hover p b,.bp-equipment-photo:focus-visible p b', [
  [/translateX\(4px\)/, 'Hover/foco precisa deslocar a seta em 4px'],
]);

if (/#equipamentos\s+\.bp-equipment-photo\s+span\s*\{/s.test(colorSequence)) {
  fail('CSS legado de ocultação dos micro-rótulos precisa ser removido');
}
if (/#equipamentos\s+\.bp-equipment-photo\s*\{[^}]*background\s*:\s*#fff/s.test(colorSequence)) {
  fail('Card não pode manter o fundo branco de catálogo');
}

const tabletStart = css.indexOf('@media (max-width:980px)');
const mobileStart = css.indexOf('@media (max-width:680px)');
const narrowStart = css.indexOf('@media (max-width:420px)');
const tabletCss = tabletStart >= 0 && mobileStart > tabletStart ? css.slice(tabletStart, mobileStart) : '';
const mobileCss = mobileStart >= 0 && narrowStart > mobileStart ? css.slice(mobileStart, narrowStart) : '';

if (!/\.bp-equipment-editorial-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/.test(tabletCss)) {
  fail('Tablet precisa usar grade de 2 colunas');
}
if (!/\.bp-equipment-editorial-grid\{grid-template-columns:1fr\}/.test(mobileCss)) {
  fail('Mobile até 680px precisa usar 1 card por linha');
}
if (!/\.bp-equipment-photo\{height:300px\}/.test(mobileCss)) {
  fail('Mobile precisa reduzir a altura uniforme dos cards para 300px');
}

if (failures.length) {
  console.error('Equipment card contract check FAILED:');
  failures.forEach((item) => console.error('- ' + item));
  process.exit(1);
}

console.log('Equipment card contract check PASS');
console.log('6 cards full-image; links preservados; assets distintos; overlay, hover e grids 3/2/1 validados.');
