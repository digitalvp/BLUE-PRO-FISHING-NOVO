import fs from 'node:fs';

const homePath = 'index.html';
const linkbioPath = 'linkbio/index.html';
const home = fs.readFileSync(homePath, 'utf8');
const linkbio = fs.readFileSync(linkbioPath, 'utf8');

const failures = [];
const sectionIds = ['inicio', 'marcas', 'video', 'produtos', 'servicos', 'sobre', 'faq', 'contato'];

function fail(message) {
  failures.push(message);
}

if (/<iframe\b/i.test(linkbio)) fail('iframe is forbidden in linkbio/index.html');
if (/fetch\s*\(\s*['"]\/['"]/i.test(linkbio)) fail("runtime fetch('/') is forbidden for Home continuation");
if (/contentDocument|contentWindow\.document|ResizeObserver\s*\(\s*resizeFrame/i.test(linkbio)) {
  fail('iframe/DOM resize bridge is forbidden');
}

let lastHome = -1;
let lastLinkbio = -1;
for (const id of sectionIds) {
  const homeNeedle = `id="${id}"`;
  const bioNeedle = `id="${id}"`;
  const homeIndex = home.indexOf(homeNeedle);
  const bioIndex = linkbio.indexOf(bioNeedle);

  if (homeIndex < 0) fail(`canonical Home is missing #${id}`);
  if (bioIndex < 0) fail(`Link Bio native continuation is missing #${id}`);
  if (homeIndex >= 0 && homeIndex <= lastHome) fail(`canonical Home section order invalid at #${id}`);
  if (bioIndex >= 0 && bioIndex <= lastLinkbio) fail(`Link Bio section order differs at #${id}`);
  lastHome = Math.max(lastHome, homeIndex);
  lastLinkbio = Math.max(lastLinkbio, bioIndex);

  const count = linkbio.split(bioNeedle).length - 1;
  if (count !== 1) fail(`Link Bio must contain exactly one #${id}; found ${count}`);
}

const requiredUrls = [
  'https://api.whatsapp.com/send/?phone=5563991198453',
  'https://wa.me/5563992569790',
  'https://maps.app.goo.gl/jRJrAxJXZTNbBWg68',
  'https://www.google.com/maps/place//data=!4m3!3m2!1s0x9324cb1b0cf47fed:0xb0015e11825b71a3!12e1',
];

for (const url of requiredUrls) {
  if (!linkbio.includes(url)) fail(`required official URL missing: ${url}`);
}

if (!/fachada-blue-pro-480\.webp/.test(linkbio) || !/fachada-blue-pro-768\.webp/.test(linkbio) || !/fachada-blue-pro-1024\.webp/.test(linkbio)) {
  fail('responsive facade srcset is missing one or more prepared WebP variants');
}
if (!/width=["']768["'][^>]*height=["']1152["']|height=["']1152["'][^>]*width=["']768["']/s.test(linkbio)) {
  fail('facade intrinsic width/height 768x1152 is missing');
}

if (failures.length) {
  console.error('Link Bio parity check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Link Bio parity check PASS');
console.log(`Canonical order: ${sectionIds.join(' -> ')}`);
