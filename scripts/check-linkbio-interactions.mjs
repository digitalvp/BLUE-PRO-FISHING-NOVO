import fs from 'node:fs';

const cssPath = 'assets/css/linkbio-interactions.css';
const htmlPath = 'linkbio/experience.html';
const css = fs.readFileSync(cssPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
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

if (!/<a\s+class="bp-btn\s+bp-btn-review"[^>]*>Avaliar no Google<\/a>/.test(html)) {
  failures.push('Avaliar no Google precisa usar o mesmo componente de botão da experiência');
}

if (/Avaliar no Google\s*↗/.test(html)) {
  failures.push('Avaliar no Google não deve exibir seta externa');
}

if (!/#loja\s+\.bp-btn-review:hover,[\s\S]*?#loja\s+\.bp-btn-review:focus-visible\s*\{[^}]*transform:\s*translateY\(-4px\)[^}]*box-shadow:/s.test(css)) {
  failures.push('Botão Avaliar no Google precisa ter elevação visível e sombra próprias no hover/foco');
}

if (!/#loja\s+\.bp-btn-blue\s*\{[^}]*color:\s*var\(--bp-blue-dark\)!important;[^}]*background:\s*#fff;[^}]*border-color:\s*var\(--bp-blue-dark\)/s.test(css)) {
  failures.push('Botão Como chegar da Loja precisa ficar branco com texto e borda azuis no estado normal');
}

if (!/#loja\s+\.bp-btn-blue:hover,[\s\S]*?#loja\s+\.bp-btn-blue:focus-visible\s*\{[^}]*color:\s*#fff!important;[^}]*background:\s*var\(--bp-blue-dark\);[^}]*transform:\s*translateY\(-4px\)[^}]*box-shadow:/s.test(css)) {
  failures.push('Botão Como chegar da Loja precisa ficar azul e elevar no hover/foco');
}

if (!/\.bp-photo-card\[data-card-link-ready="true"\],\s*\.bp-content-feature,\s*\.bp-content-small\s*\{[^}]*transition:\s*transform\s+\.24s\s+ease,box-shadow\s+\.24s\s+ease/s.test(css)) {
  failures.push('Cards clicáveis precisam compartilhar a transição padrão de elevação');
}

if (!/\.bp-photo-card\[data-card-link-ready="true"\]:hover,[\s\S]*?\.bp-content-small:focus-visible\s*\{[^}]*transform:\s*translateY\(-4px\)[^}]*box-shadow:/s.test(css)) {
  failures.push('Cards clicáveis precisam subir levemente e receber sombra no hover/foco');
}

if (failures.length) {
  console.error('Link Bio interaction specificity check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Link Bio interaction specificity check PASS');
