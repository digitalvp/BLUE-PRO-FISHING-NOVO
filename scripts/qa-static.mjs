import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicHtml = [
  "index.html",
  "pesca-camping-acessorios-palmas-to/index.html",
  "embarcacoes-nautica-palmas-to/index.html",
  "camping-pesca-palmas-to/index.html",
  "politica-de-privacidade/index.html",
  "termos-de-uso/index.html",
  "linkbio/index.html",
  "links/index.html",
  "links/source.html",
];

const ignoredProtocols = /^(?:https?:|mailto:|tel:|javascript:|data:|blob:|about:)/i;
const platformDependency = /(?:vercel\.app|github\.com|raw\.githubusercontent\.com)/i;

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function stripQueryHash(value) {
  return value.split("#", 1)[0].split("?", 1)[0];
}

function normalizeWebPath(value, sourceFile) {
  const clean = stripQueryHash(value.trim());
  if (!clean || clean === "/" || clean.startsWith("#") || ignoredProtocols.test(clean) || clean.startsWith("//")) return null;
  const decoded = (() => { try { return decodeURIComponent(clean); } catch { return clean; } })();
  if (decoded.startsWith("/")) return resolve(root, `.${decoded}`);
  return resolve(dirname(join(root, sourceFile)), decoded);
}

async function resolveTarget(value, sourceFile) {
  const absolute = normalizeWebPath(value, sourceFile);
  if (!absolute) return { ignored: true };
  const safeRoot = root.endsWith(sep) ? root : `${root}${sep}`;
  if (absolute !== root && !absolute.startsWith(safeRoot)) return { error: "outside-project", absolute };
  if (await exists(absolute)) {
    const info = await stat(absolute);
    if (info.isDirectory()) {
      const index = join(absolute, "index.html");
      return (await exists(index)) ? { path: index } : { error: "directory-without-index", absolute };
    }
    return { path: absolute };
  }
  if (!extname(absolute)) {
    const index = join(absolute, "index.html");
    if (await exists(index)) return { path: index };
    const html = `${absolute}.html`;
    if (await exists(html)) return { path: html };
  }
  return { error: "missing", absolute };
}

function collectHtmlRefs(html) {
  const refs = [];
  const attrRegex = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrRegex)) refs.push(match[1]);
  const srcsetRegex = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(srcsetRegex)) {
    for (const part of match[1].split(",")) {
      const candidate = part.trim().split(/\s+/)[0];
      if (candidate) refs.push(candidate);
    }
  }
  const fetchRegex = /\bfetch\(\s*["'`]([^"'`]+)["'`]\s*[,) ]/gi;
  for (const match of html.matchAll(fetchRegex)) refs.push(match[1]);
  return refs;
}

function collectCssRefs(css) {
  const refs = [];
  const regex = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of css.matchAll(regex)) refs.push(match[1]);
  return refs;
}

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

async function main() {
  const failures = [];
  const warnings = [];
  let checkedRefs = 0;

  for (const relative of publicHtml) {
    const full = join(root, relative);
    if (!(await exists(full))) {
      failures.push({ file: relative, type: "missing-public-html" });
      continue;
    }
    const html = await readFile(full, "utf8");
    if (!/<title>[^<]+<\/title>/i.test(html)) failures.push({ file: relative, type: "missing-title" });
    if (!/<meta\s+[^>]*name=["']viewport["']/i.test(html)) failures.push({ file: relative, type: "missing-viewport" });
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (relative !== "links/index.html" && relative !== "links/source.html" && h1Count !== 1) {
      failures.push({ file: relative, type: "h1-count", count: h1Count });
    }
    for (const ref of collectHtmlRefs(html)) {
      if (platformDependency.test(ref)) warnings.push({ file: relative, type: "platform-dependency", ref });
      if (/localhost|127\.0\.0\.1/i.test(ref)) failures.push({ file: relative, type: "local-machine-reference", ref });
      const result = await resolveTarget(ref, relative);
      if (result.ignored) continue;
      checkedRefs++;
      if (result.error) failures.push({ file: relative, type: `broken-local-reference:${result.error}`, ref });
    }
  }

  const assetFiles = (await walk(join(root, "assets"))).filter((file) => [".css", ".js", ".json"].includes(extname(file).toLowerCase()));
  for (const full of assetFiles) {
    const relative = full.slice(root.length + 1).split(sep).join("/");
    const text = await readFile(full, "utf8");
    if (/localhost|127\.0\.0\.1/i.test(text)) failures.push({ file: relative, type: "local-machine-reference-in-source" });
    if (platformDependency.test(text)) warnings.push({ file: relative, type: "platform-dependency-in-source" });
    if (extname(full).toLowerCase() !== ".css") continue;
    for (const ref of collectCssRefs(text)) {
      const result = await resolveTarget(ref, relative);
      if (result.ignored) continue;
      checkedRefs++;
      if (result.error) failures.push({ file: relative, type: `broken-css-reference:${result.error}`, ref });
    }
  }

  const uniqueFailures = [...new Map(failures.map((item) => [JSON.stringify(item), item])).values()];
  const uniqueWarnings = [...new Map(warnings.map((item) => [JSON.stringify(item), item])).values()];

  console.log(JSON.stringify({
    status: uniqueFailures.length ? "FAIL" : "PASS",
    publicHtml: publicHtml.length,
    checkedRefs,
    failures: uniqueFailures,
    warnings: uniqueWarnings,
  }, null, 2));

  if (uniqueFailures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error("QA_STATIC_ERROR", error);
  process.exitCode = 1;
});
