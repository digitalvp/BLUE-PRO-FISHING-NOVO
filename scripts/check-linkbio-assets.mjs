import fs from 'node:fs';

const assets = [
  { path: 'assets/img/linkbio/fachada-blue-pro-480.webp', width: 480, height: 720, max: 90 * 1024 },
  { path: 'assets/img/linkbio/fachada-blue-pro-768.webp', width: 768, height: 1152, max: 180 * 1024 },
  { path: 'assets/img/linkbio/fachada-blue-pro-1024.webp', width: 1024, height: 1536, max: 260 * 1024 },
];

const failures = [];
for (const asset of assets) {
  if (!fs.existsSync(asset.path)) {
    failures.push(`missing ${asset.path}`);
    continue;
  }
  const bytes = fs.statSync(asset.path).size;
  console.log(`${asset.path}: ${bytes} bytes (budget ${asset.max})`);
  if (bytes > asset.max) failures.push(`${asset.path} exceeds budget by ${bytes - asset.max} bytes`);
}

if (failures.length) {
  console.error('Link Bio asset check FAILED:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Link Bio asset check PASS');
