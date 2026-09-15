import fs from 'node:fs';

const linkbioPath = 'linkbio/index.html';
const rhythmPath = 'assets/css/linkbio-color-sequence.css';
const interactionsPath = 'assets/css/linkbio-interactions.css';
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

const fixedColorSections = [
  { needle: '<section class="bp-editorial-hero"', label: 'hero azul' },
  { needle: '<section class="bp-brands"', label: 'marcas branca' },
  { needle: '<section class="bp-editorial-blue" id="viva-blue"', label: 'Viva a Blue azul' },
  { needle: '<section class="bp-section bp-section-white" id="loja"', label: 'loja branca' },
  { needle: '<section class="bp-section bp-section-blue" id="especialistas"', label: 'especialistas azul' },
  { needle: '<section class="bp-section bp-section-white" id="blue-na-agua"', label: 'Blue na Água branca' },
  { needle: '<section class="bp-final" id="contato-blue"', label: 'contato final azul' },
];

for (const section of fixedColorSections) {
  if (!linkbio.includes(section.needle)) fail(`Sequência azul/branco inválida: falta ${section.label}`);
}

if (!linkbio.includes('/assets/css/linkbio-color-sequence.css')) {
  fail('CSS da sequência azul/branco não está carregado');
} else if (!fs.existsSync(rhythmPath)) {
  fail(`Arquivo ausente: ${rhythmPath}`);
} else {
  const rhythm = fs.readFileSync(rhythmPath, 'utf8');
  if (!/#categorias\.bp-section\s*\{[^}]*background:\s*var\(--bp-navy\)/s.test(rhythm)) {
    fail('Categorias deve ser a dobra azul da sequência');
  }
  if (!/#equipamentos\.bp-section\s*\{[^}]*background:\s*#fff/s.test(rhythm)) {
    fail('Equipamentos deve ser a dobra branca da sequência');
  }
  if (!/#categorias\s+\.bp-section-intro\s+h2\s*\{[^}]*color:\s*#fff/s.test(rhythm)) {
    fail('Título da seção Categorias precisa de contraste branco');
  }
}

if (!fs.existsSync(interactionsPath)) {
  fail(`Arquivo ausente: ${interactionsPath}`);
} else {
  const interactions = fs.readFileSync(interactionsPath, 'utf8');
  if (!/\.bp-btn:hover[\s\S]*?transform:\s*translateY\(-3px\)/.test(interactions)) {
    fail('Botões da experiência precisam subir levemente no hover');
  }
  if (!/\.bp-btn:hover[\s\S]*?box-shadow:\s*0\s+10px\s+22px/.test(interactions)) {
    fail('Botões da experiência precisam ganhar sombra suave no hover');
  }
  if (!/\.linkbio-action:hover[\s\S]*?box-shadow:\s*0\s+10px\s+22px/.test(interactions)) {
    fail('Botões da primeira dobra precisam ganhar sombra suave no hover');
  }
}

if (/class="bp-section-index"/.test(linkbio)) {
  fail('Números editoriais das dobras devem ser removidos');
}

if (/Marcas presentes no universo Blue Pro Fishing|Seleção para pesca e náutica/i.test(linkbio)) {
  fail('Textos auxiliares acima do carrossel de marcas devem ser removidos');
}

if (/<span>\s*0[1-9]\s*\/\s*(?:Pesca|Náutica|Camping|Serviços)\s*<\/span>/i.test(linkbio)) {
  fail('Etiquetas numeradas dos cards de categoria devem ser removidas');
}

if (/\b0[1-9]\s*\/\s*Viva a Blue\b/i.test(linkbio)) {
  fail('Numeração da dobra Viva a Blue deve ser removida');
}

if (/class="bp-section-description"/.test(linkbio)) {
  fail('Parágrafos auxiliares das dobras devem ser removidos');
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
console.log('Metadados editoriais redundantes removidos: sem números nas dobras/cards, sem textos sobre o carrossel e sem parágrafos auxiliares nas dobras');
console.log('Interações de botões: elevação de 3px + sombra suave no hover');
