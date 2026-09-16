import fs from 'node:fs';

const sourcePath = 'linkbio/experience.html';
const cssPath = 'assets/css/linkbio-experience.css';
const source = fs.readFileSync(sourcePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
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

if (!/\.bp-brand-set\{[^}]*gap:\s*64px[^}]*\}/s.test(css)) {
  failures.push('carrossel desktop precisa de 64px de respiro entre as marcas');
}

if (!/\.bp-brand-set img\{[^}]*height:\s*42px[^}]*max-width:\s*150px[^}]*\}/s.test(css)) {
  failures.push('logos desktop precisam usar 42px de altura e max-width de 150px');
}

const mobileBlock = css.match(/@media \(max-width:680px\)\{([\s\S]*?)\n\}/);
if (!mobileBlock) {
  failures.push('bloco responsivo de 680px não foi encontrado');
} else {
  const mobileCss = mobileBlock[1];
  if (!/\.bp-brand-set\{[^}]*gap:\s*48px[^}]*\}/s.test(mobileCss)) {
    failures.push('carrossel mobile precisa de 48px de respiro entre as marcas');
  }
  if (!/\.bp-brand-set img\{[^}]*height:\s*36px[^}]*max-width:\s*138px[^}]*\}/s.test(mobileCss)) {
    failures.push('logos mobile precisam usar 36px de altura e max-width de 138px');
  }
}

if (failures.length) {
  console.error('Link Bio brand position check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio brand position check PASS');
