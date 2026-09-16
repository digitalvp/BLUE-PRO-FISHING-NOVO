import fs from 'node:fs';

const failures = [];
const previewPath = 'client-preview.html';
const colorCssPath = 'assets/css/linkbio-color-sequence.css';

if (!fs.existsSync(previewPath)) {
  failures.push('client-preview.html precisa existir para o link público do cliente');
} else {
  const preview = fs.readFileSync(previewPath, 'utf8');

  if (!preview.includes('https://raw.githubusercontent.com/digitalvp/BLUE-PRO-FISHING-NOVO/client-preview/linkbio/index.html')) {
    failures.push('preview público precisa carregar a versão atual da branch client-preview');
  }

  if (!preview.includes("replaceAll('/assets/'")) {
    failures.push('preview público precisa reescrever assets absolutos para o CDN público');
  }

  if (!preview.includes('https://raw.githack.com/digitalvp/BLUE-PRO-FISHING-NOVO/client-preview/')) {
    failures.push('preview público precisa usar base raw.githack da branch client-preview');
  }

  if (/vercel\.app|_vercel_share|sso-api/i.test(preview)) {
    failures.push('preview do cliente não pode depender de Vercel Authentication');
  }
}

const colorCss = fs.readFileSync(colorCssPath, 'utf8');
if (/@import\s+url\(['"]?\/assets\/css\/linkbio-interactions\.css/.test(colorCss)) {
  failures.push('CSS do preview precisa importar linkbio-interactions.css por caminho relativo');
}

if (failures.length) {
  console.error('Client public preview check FAILED:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Client public preview check PASS');
