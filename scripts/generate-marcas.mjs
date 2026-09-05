import { readdir, writeFile, watch } from "node:fs/promises";
import { join, relative, extname, basename } from "node:path";

const directory = join(process.cwd(), "assets", "img", "marcas");
const output = join(process.cwd(), "assets", "data", "marcas.json");
const supported = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

const labelFrom = (name) => {
  const label = basename(name, extname(name)).replace(/^logo[-_]/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return label.replace(/^Blue Pro Mescla$/, "Blue Pro Fishing").replace(/^Monster 3x$/, "Monster 3X");
};
async function generate() {
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && supported.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
  const manifest = files.map((name) => ({ src: relative(process.cwd(), join(directory, name)).replaceAll("\\", "/"), alt: labelFrom(name) }));
  await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Manifesto atualizado: ${manifest.length} marca(s).`);
}
await generate();
if (process.argv.includes("--watch")) { console.log("Observando assets/img/marcas..."); for await (const _ of watch(directory)) await generate(); }
