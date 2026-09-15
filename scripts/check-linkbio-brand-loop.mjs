import fs from 'node:fs';

const js = fs.readFileSync('assets/js/linkbio-experience.js', 'utf8');
const baseCss = fs.readFileSync('assets/css/linkbio-experience.css', 'utf8');
const overrideCss = fs.readFileSync('assets/css/linkbio-interactions.css', 'utf8');
const css = `${baseCss}\n${overrideCss}`;
const failures = [];

if (!js.includes("[data-bp-brand-marquee]")) {
  failures.push('carrossel precisa medir a largura visível do marquee');
}
if (!/while\s*\([^)]*scrollWidth[^)]*clientWidth/s.test(js)) {
  failures.push('carrossel precisa adicionar cópias até cobrir a largura visível sem lacunas');
}
if (!js.includes('--bp-brand-loop-distance')) {
  failures.push('carrossel precisa calcular a distância exata de um conjunto para loop contínuo');
}
if (!/animation:\s*bpBrandRoll\s+30s\s+linear\s+infinite/.test(css)) {
  failures.push('animação das marcas precisa ser linear e infinita');
}
if (!/\.bp-brand-marquee:hover\s+\.bp-brand-track[^\{]*\{[^}]*animation-play-state:\s*running/s.test(overrideCss)) {
  failures.push('carrossel infinito precisa continuar rodando no hover');
}
if (!/@keyframes\s+bpBrandRoll\s*\{[^}]*var\(--bp-brand-loop-distance/s.test(overrideCss)) {
  failures.push('keyframe final precisa usar a distância calculada para evitar salto no reinício');
}

if (failures.length) {
  console.error('Link Bio brand loop check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio brand loop check PASS');
