import fs from 'node:fs';

const sourcePath = 'linkbio/experience.html';
const experienceCssPath = 'assets/css/linkbio-experience.css';
const colorCssPath = 'assets/css/linkbio-color-sequence.css';
const source = fs.readFileSync(sourcePath, 'utf8');
const experienceCss = fs.readFileSync(experienceCssPath, 'utf8');
const colorCss = fs.readFileSync(colorCssPath, 'utf8');
const css = `${experienceCss}\n${colorCss}`;
const failures = [];

const brandMarker = '<section class="bp-brands"';
const headerMarker = '<header class="bp-header"';
const heroMarker = '<section class="bp-editorial-hero"';

const brandIndex = source.indexOf(brandMarker);
const headerIndex = source.indexOf(headerMarker);
const heroIndex = source.indexOf(heroMarker);
const brandCount = source.split(brandMarker).length - 1;

if (brandCount !== 1) {
  failures.push(`carrossel de marcas deve existir exatamente uma vez; encontrado ${brandCount}`);
}

if (brandIndex < 0 || headerIndex < 0 || heroIndex < 0) {
  failures.push('marcadores essenciais da experiência não foram encontrados');
} else if (!(brandIndex < headerIndex && headerIndex < heroIndex)) {
  failures.push('carrossel de marcas deve vir imediatamente no início da experiência, antes do header e do hero');
}

const beforeHeader = source.slice(0, headerIndex);
if (!beforeHeader.trimEnd().endsWith('</section>')) {
  failures.push('o carrossel de marcas deve ser o primeiro bloco visual dentro de #explore-blue');
}

if (!/\.bp-brand-set\{[^}]*gap:\s*10px[^}]*padding:\s*0 6px[^}]*\}/s.test(css)) {
  failures.push('carrossel desktop precisa manter marcas muito próximas: gap 10px e padding lateral 6px');
}

if (!/\.bp-brand-set img\{[^}]*height:\s*53px[^}]*max-width:\s*188px[^}]*\}/s.test(css)) {
  failures.push('logos desktop precisam continuar com 53px de altura e max-width de 188px');
}

if (!/@media \(max-width:680px\)\{[\s\S]*?\.bp-brand-set\{[^}]*gap:\s*7px[^}]*padding-inline:\s*4px[^}]*\}/s.test(css)) {
  failures.push('carrossel mobile precisa manter marcas muito próximas: gap 7px e padding lateral 4px');
}

if (!/@media \(max-width:680px\)\{[\s\S]*?\.bp-brand-set img\{[^}]*height:\s*45px[^}]*max-width:\s*173px[^}]*\}/s.test(css)) {
  failures.push('logos mobile precisam continuar com 45px de altura e max-width de 173px');
}

if (failures.length) {
  console.error('Link Bio brand position check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio brand position check PASS');
