import fs from 'node:fs';

const cssPath = 'assets/css/linkbio-interactions.css';
const css = fs.readFileSync(cssPath, 'utf8');
const failures = [];

if (!/\.has-linkbio-js\.is-linkbio-ready\s+\.linkbio-page\s+\.linkbio-action\s*\{[^}]*transition-delay:\s*0ms/s.test(css)) {
  failures.push('CTAs iniciais precisam zerar o delay da animação de entrada após o carregamento');
}

if (!/\.has-linkbio-js\.is-linkbio-ready\s+\.linkbio-page\s+\.linkbio-action:hover[\s\S]*?transform:\s*translateY\(-3px\)/.test(css)) {
  failures.push('Hover dos CTAs iniciais precisa superar a especificidade da animação de entrada');
}

if (!/\.has-linkbio-js\.is-linkbio-ready\s+\.linkbio-page\s+\.linkbio-action:hover[\s\S]*?box-shadow:\s*0\s+10px\s+22px/.test(css)) {
  failures.push('Hover dos CTAs iniciais precisa aplicar a sombra visível');
}

if (failures.length) {
  console.error('Link Bio interaction specificity check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio interaction specificity check PASS');
