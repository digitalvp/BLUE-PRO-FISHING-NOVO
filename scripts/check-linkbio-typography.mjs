import fs from 'node:fs';

const failures = [];
const template = fs.readFileSync('linkbio/template.html', 'utf8');
const typographyPath = 'assets/css/linkbio-fonts.css';

function fail(message) {
  failures.push(message);
}

if (!template.includes('fonts.googleapis.com')) {
  fail('Google Fonts oficial não está carregado no template');
}

if (!template.includes('family=Montserrat') || !template.includes('family=Open+Sans')) {
  fail('Montserrat e Open Sans devem ser carregadas como no site oficial');
}

if (!template.includes('/assets/css/linkbio-fonts.css')) {
  fail('CSS tipográfico oficial não está carregado');
}

if (!fs.existsSync(typographyPath)) {
  fail(`Arquivo ausente: ${typographyPath}`);
} else {
  const typography = fs.readFileSync(typographyPath, 'utf8');

  if (!/--bp-font-display:\s*"Montserrat"/i.test(typography)) {
    fail('Token de fonte display Montserrat ausente');
  }

  if (!/--bp-font-sans:\s*"Open Sans"/i.test(typography)) {
    fail('Token de fonte de leitura Open Sans ausente');
  }

  if (!/\.linkbio-page[\s\S]*font-family:\s*var\(--bp-font-sans\)/i.test(typography)) {
    fail('Link Bio deve usar Open Sans como fonte base');
  }

  if (!/\.linkbio-copy h1[\s\S]*font-family:\s*var\(--bp-font-display\)/i.test(typography)) {
    fail('Título principal da Link Bio deve usar Montserrat');
  }

  if (!/\.bp-experience[\s\S]*font-family:\s*var\(--bp-font-sans\)/i.test(typography)) {
    fail('Experiência Blue deve usar Open Sans como fonte base');
  }

  if (!/\.bp-editorial-hero h2[\s\S]*font-family:\s*var\(--bp-font-display\)/i.test(typography)) {
    fail('Títulos editoriais devem usar Montserrat');
  }
}

if (failures.length) {
  console.error('Link Bio typography check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Link Bio typography check PASS');
