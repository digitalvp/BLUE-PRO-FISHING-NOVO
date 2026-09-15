import fs from 'node:fs';

const css = fs.readFileSync('assets/css/linkbio-color-sequence.css', 'utf8');

const normalize = (value) => value.replace(/\s+/g, '');
const source = normalize(css);

const expected = [
  ['categorias branca', '#categorias.bp-section{background:#fff;color:var(--bp-ink);'],
  ['equipamentos azul', '#equipamentos.bp-section{background:var(--bp-navy);color:#fff;'],
  ['viva blue branca', '#viva-blue.bp-editorial-blue{background:#fff;color:var(--bp-ink);'],
  ['loja azul', '#loja.bp-section{background:var(--bp-navy);color:#fff;'],
  ['especialistas branca', '#especialistas.bp-section{background:#fff;color:var(--bp-ink);'],
  ['blue na agua azul', '#blue-na-agua.bp-section{background:var(--bp-navy);color:#fff;'],
  ['contato final branco', '#contato-blue.bp-final{background:#fff;color:var(--bp-ink);'],
];

const missing = expected.filter(([, snippet]) => !source.includes(normalize(snippet)));

if (missing.length) {
  console.error('FAIL: sequência cromática da Link Bio não corresponde ao padrão aprovado.');
  for (const [label] of missing) console.error(`- faltando: ${label}`);
  process.exit(1);
}

console.log('PASS: categorias→contato alternam branco/azul corretamente.');
