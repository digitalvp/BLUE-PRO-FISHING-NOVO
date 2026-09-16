import { execFileSync } from 'node:child_process';

const readCommitted = (path) => execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8' });
const source = readCommitted('linkbio/experience.html');
const preview = readCommitted('linkbio/index.html');
const reviewHref = 'https://www.google.com/maps/place//data=!4m3!3m2!1s0x9324cb1b0cf47fed:0xb0015e11825b71a3!12e1';
const failures = [];

const findReviewAnchor = (html) => {
  const escapedHref = reviewHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<a[^>]*href="${escapedHref}"[^>]*>[^<]*<\\/a>`))?.[0] || '';
};

const sourceAnchor = findReviewAnchor(source);
const previewAnchor = findReviewAnchor(preview);

if (!sourceAnchor) failures.push('CTA de avaliação não encontrado na fonte linkbio/experience.html');
if (!previewAnchor) failures.push('CTA de avaliação não encontrado no preview commitado linkbio/index.html');
if (sourceAnchor && previewAnchor && sourceAnchor !== previewAnchor) {
  failures.push('CTA de avaliação do preview commitado está diferente da fonte');
}
if (/↗/.test(previewAnchor)) failures.push('preview commitado ainda contém a seta ↗ no CTA Avaliar no Google');
if (previewAnchor && !/class="[^"]*bp-btn[^"]*bp-btn-review[^"]*"/.test(previewAnchor)) {
  failures.push('preview commitado não usa o botão bp-btn bp-btn-review');
}
if (previewAnchor && !/>Avaliar no Google<\/a>$/.test(previewAnchor)) {
  failures.push('texto do CTA commitado deve ser exatamente “Avaliar no Google”');
}

if (failures.length) {
  console.error('Committed Link Bio preview check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Committed Link Bio preview check PASS');
