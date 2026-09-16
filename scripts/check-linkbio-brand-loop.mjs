import fs from 'node:fs';

const js = fs.readFileSync('assets/js/linkbio-experience.js', 'utf8');
const failures = [];

if (!js.includes("[data-bp-brand-marquee]")) {
  failures.push('carrossel precisa medir a largura visível do marquee');
}
if (!/while\s*\([^)]*scrollWidth[^)]*clientWidth/s.test(js)) {
  failures.push('carrossel precisa adicionar cópias até cobrir a largura visível sem lacunas');
}
if (!js.includes("track.style.animation = 'none'")) {
  failures.push('carrossel contínuo precisa desligar a animação CSS antiga');
}
if (!js.includes('iterations: Infinity')) {
  failures.push('carrossel precisa usar iterações infinitas');
}
if (!js.includes("easing: 'linear'")) {
  failures.push('carrossel precisa manter velocidade linear');
}
if (!js.includes('track.animate(')) {
  failures.push('carrossel precisa usar animação contínua controlada pelo navegador');
}
if (!js.includes('duration: 45000')) {
  failures.push('carrossel da Link Bio precisa usar 45s por volta, igual ao site oficial');
}
if (!/marquee\.addEventListener\(['"]mouseenter['"],\s*\(\)\s*=>\s*brandAnimation\?\.pause\(\)\)/s.test(js)) {
  failures.push('carrossel precisa pausar a animação Web Animations API no mouseenter');
}
if (!/marquee\.addEventListener\(['"]mouseleave['"],\s*\(\)\s*=>\s*brandAnimation\?\.play\(\)\)/s.test(js)) {
  failures.push('carrossel precisa retomar a animação do mesmo ponto no mouseleave');
}
if (!/marquee\.addEventListener\(['"]focusin['"],\s*\(\)\s*=>\s*brandAnimation\?\.pause\(\)\)/s.test(js)) {
  failures.push('carrossel precisa pausar também quando recebe foco');
}
if (!js.includes('focusout')) {
  failures.push('carrossel precisa retomar após a saída do foco');
}

if (failures.length) {
  console.error('Link Bio brand loop check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio brand loop check PASS');
