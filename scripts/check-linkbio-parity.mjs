import fs from 'node:fs';

const linkbioPath = 'linkbio/index.html';
const linkbio = fs.readFileSync(linkbioPath, 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

const requiredSectionIds = [
  'explore-blue',
  'categorias',
  'equipamentos',
  'viva-blue',
  'loja',
  'especialistas',
  'blue-na-agua',
  'contato-blue',
];

for (const id of requiredSectionIds) {
  const needle = `id="${id}"`;
  const count = linkbio.split(needle).length - 1;
  if (count !== 1) fail(`Nova experiência deve conter exatamente um #${id}; encontrado ${count}`);
}

const orderedIds = requiredSectionIds.map((id) => linkbio.indexOf(`id="${id}"`));
for (let index = 0; index < orderedIds.length; index += 1) {
  if (orderedIds[index] < 0) continue;
  if (index > 0 && orderedIds[index] <= orderedIds[index - 1]) {
    fail(`Ordem das seções inválida em #${requiredSectionIds[index]}`);
  }
}

const alternatingColorSections = [
  { needle: '<section class="bp-editorial-hero"', label: 'hero azul' },
  { needle: '<section class="bp-brands"', label: 'marcas branca' },
  { needle: '<section class="bp-section bp-section-blue" id="categorias"', label: 'categorias azul' },
  { needle: '<section class="bp-section bp-section-white" id="equipamentos"', label: 'equipamentos branca' },
  { needle: '<section class="bp-editorial-blue" id="viva-blue"', label: 'Viva a Blue azul' },
  { needle: '<section class="bp-section bp-section-white" id="loja"', label: 'loja branca' },
  { needle: '<section class="bp-section bp-section-blue" id="especialistas"', label: 'especialistas azul' },
  { needle: '<section class="bp-section bp-section-white" id="blue-na-agua"', label: 'Blue na Água branca' },
  { needle: '<section class="bp-final" id="contato-blue"', label: 'contato final azul' },
];

for (const section of alternatingColorSections) {
  if (!linkbio.includes(section.needle)) fail(`Sequência azul/branco inválida: falta ${section.label}`);
}

if (!/id="categorias"[\s\S]*?bp-section-intro bp-section-intro-dark/.test(linkbio)) {
  fail('Categorias azul precisa usar contraste de introdução escura');
}

if (!/id="categorias"[\s\S]*?bp-overline bp-overline-light/.test(linkbio)) {
  fail('Categorias azul precisa usar overline clara');
}

if (!linkbio.includes('data-bp-brand-track')) fail('Carrossel de marcas oficial está ausente');
if (!linkbio.includes('/assets/css/linkbio-experience.css')) fail('CSS da nova experiência não está carregado');
if (!linkbio.includes('/assets/js/linkbio-experience.js')) fail('JS da nova experiência não está carregado');

const requiredOfficialAssets = [
  '/assets/logos/logo-blue-pro-mescla.svg',
  '/assets/img/sobre/DSC09357.jpg',
  '/assets/img/sobre/DSC09379.jpg',
  '/assets/img/sobre/DSC09403.jpg',
  '/assets/img/sobre/DSC09481.jpg',
];

for (const asset of requiredOfficialAssets) {
  if (!linkbio.includes(asset)) fail(`Asset oficial obrigatório ausente: ${asset}`);
}

if (/ChatGPT Image/i.test(linkbio)) {
  fail('Imagem gerada por IA não pode fazer parte da experiência oficial');
}

const requiredUrls = [
  'https://api.whatsapp.com/send/?phone=5563991198453',
  'https://wa.me/5563992569790',
  'https://maps.app.goo.gl/jRJrAxJXZTNbBWg68',
  'https://www.google.com/maps/place//data=!4m3!3m2!1s0x9324cb1b0cf47fed:0xb0015e11825b71a3!12e1',
  'https://www.youtube.com/@BLUEPROFISHING',
];

for (const url of requiredUrls) {
  if (!linkbio.includes(url)) fail(`URL oficial obrigatória ausente: ${url}`);
}

if (!/fachada-blue-pro-480\.webp/.test(linkbio) || !/fachada-blue-pro-768\.webp/.test(linkbio) || !/fachada-blue-pro-1024\.webp/.test(linkbio)) {
  fail('srcset responsivo da fachada está incompleto');
}

if (!/width=["']768["'][^>]*height=["']1152["']|height=["']1152["'][^>]*width=["']768["']/s.test(linkbio)) {
  fail('dimensões intrínsecas 768x1152 da fachada estão ausentes');
}

const forbiddenPatterns = [
  { pattern: /\bR\$\s*\d/i, label: 'preço em real' },
  { pattern: /\bcomprar\b/i, label: 'CTA de compra' },
  { pattern: /\badicionar ao carrinho\b/i, label: 'carrinho' },
  { pattern: /\bcheckout\b/i, label: 'checkout' },
  { pattern: /\bem estoque\b/i, label: 'estoque' },
];

for (const item of forbiddenPatterns) {
  if (item.pattern.test(linkbio)) fail(`Linguagem de e-commerce proibida encontrada: ${item.label}`);
}

if (/id=["']inicio["']/i.test(linkbio) && /class=["'][^"']*hero-carousel/i.test(linkbio)) {
  fail('A Home antiga ainda parece estar incorporada na Link Bio');
}

if (/id=["']lb-site-frame["']/i.test(linkbio) || /<iframe\b[^>]*\bsrc=["']\/["']/i.test(linkbio)) {
  fail('iframe da Home é proibido');
}

if (failures.length) {
  console.error('Link Bio experience check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Link Bio experience check PASS');
console.log(`Nova ordem: ${requiredSectionIds.join(' -> ')}`);
console.log('Ritmo visual: azul -> branco -> azul -> branco -> azul -> branco -> azul -> branco -> azul');
