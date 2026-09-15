import fs from 'node:fs';

const sourcePath = 'linkbio/experience.html';
const source = fs.readFileSync(sourcePath, 'utf8');
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

if (failures.length) {
  console.error('Link Bio brand position check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio brand position check PASS');
