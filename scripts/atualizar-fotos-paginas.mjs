import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const fishingPage = "pesca-camping-acessorios-palmas-to/index.html";
const nauticalPage = "embarcacoes-nautica-palmas-to/index.html";
const pendingMedia = (message) => `<div class="editorial-media editorial-media-pending"><aside class="editorial-pending"><strong>PENDÊNCIA DE ASSET/DADO</strong>${message}</aside></div>`;
const currentFishingMedia = (alt) => `<figure class="editorial-media "><img src="/assets/img/servicos/servico-pesca-camping.webp" alt="${alt}" loading="lazy" decoding="async"></figure>`;

// O conteúdo original retorna quando a pasta fica sem fotos.
export const photoSections = [
  {
    id: "pesca", page: fishingPage, folder: "acampamento-pesca-acessorios/pesca",
    alt: "Equipamentos de pesca", fallback: currentFishingMedia("Varas, iscas e equipamentos expostos no interior da Blue Pro Fishing"),
  },
  {
    id: "iscas-linhas-acessorios", page: fishingPage, folder: "acampamento-pesca-acessorios/iscas-linhas-acessorios",
    alt: "Iscas, linhas e acessórios de pesca", fallback: currentFishingMedia("Exposição de iscas e acessórios na Blue Pro Fishing"),
  },
  {
    id: "oculos-vestuario", page: fishingPage, folder: "acampamento-pesca-acessorios/oculos-vestuario",
    alt: "Óculos e vestuário para pesca", fallback: pendingMedia("Foto real de óculos e vestuário aguardando fornecimento."),
  },
  {
    id: "camping", page: fishingPage, folder: "acampamento-pesca-acessorios/camping",
    alt: "Equipamentos para camping", fallback: currentFishingMedia("Caixas térmicas e equipamentos no interior da Blue Pro Fishing"),
  },
  ...["01", "02", "03"].map((number) => ({
    id: `modelo-${number}`, page: nauticalPage, folder: `embarcacoes-nautica/embarcacoes/modelo-${number}`,
    alt: `Embarcação — modelo ${number} a confirmar`, fallback: "", model: true,
  })),
  {
    id: "caiaques", page: nauticalPage, folder: "embarcacoes-nautica/caiaques",
    alt: "Caiaques", fallback: '<figure class="editorial-media is-portrait"><img src="/assets/img/sobre/DSC09308.jpg" alt="Caiaques expostos na entrada da loja Blue Pro Fishing" loading="lazy" decoding="async"><figcaption>Fachada da Blue Pro Fishing, em Palmas - TO.</figcaption></figure>',
  },
  {
    id: "garmin", page: nauticalPage, folder: "embarcacoes-nautica/garmin",
    alt: "Equipamentos Garmin marítimos", fallback: pendingMedia("Fotografia real dos equipamentos Garmin marítimos aguardando fornecimento."),
  },
  {
    id: "manutencao", page: nauticalPage, folder: "embarcacoes-nautica/manutencao",
    alt: "Manutenção náutica", fallback: pendingMedia("Foto real do atendimento de manutenção náutica aguardando fornecimento."),
  },
];

const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function replaceMedia(html, section, media) {
  const start = `<!-- FOTOS:${section.id}:INICIO -->`;
  const end = `<!-- FOTOS:${section.id}:FIM -->`;
  const from = html.indexOf(start);
  const to = html.indexOf(end);
  if (from < 0 || to < from || html.indexOf(start, from + start.length) !== -1 || html.indexOf(end, to + end.length) !== -1) {
    throw new Error(`Marcadores ausentes ou repetidos em ${section.page}: ${section.id}. Nenhuma página foi atualizada.`);
  }
  return html.slice(0, from + start.length) + media + html.slice(to);
}

export async function updatePhotos({ root = projectRoot, log = console.log } = {}) {
  const originals = new Map();
  const updated = new Map();
  const messages = [];

  // Valida todas as pastas e todos os marcadores antes de gravar as páginas.
  for (const section of photoSections) {
    if (!originals.has(section.page)) {
      const html = await readFile(join(root, section.page), "utf8");
      originals.set(section.page, html);
      updated.set(section.page, html);
    }
    const directory = join(root, "assets", "img", "paginas", section.folder);
    const names = (await readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && supported.has(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true, sensitivity: "base" }) || a.localeCompare(b, "pt-BR"));

    let media = section.fallback;
    if (names.length) {
      const src = `../assets/img/paginas/${[...section.folder.split("/"), names[0]].map(encodeURIComponent).join("/")}`;
      const className = section.model ? "editorial-model-photo" : "editorial-media";
      media = `<figure class="${className}"><img src="${escapeAttribute(src)}" alt="${escapeAttribute(section.alt)}" loading="lazy" decoding="async"></figure>`;
    }
    updated.set(section.page, replaceMedia(updated.get(section.page), section, media));
    messages.push(`${section.folder}: ${names.length ? names[0] : "sem foto nova; conteúdo original preservado"}${names.length > 1 ? ` (${names.length} fotos; somente a primeira é exibida)` : ""}`);
  }

  let changed = 0;
  for (const [page, html] of updated) {
    if (html !== originals.get(page)) {
      await writeFile(join(root, page), html, "utf8");
      changed++;
    }
  }
  messages.forEach((message) => log(message));
  log(`Pronto: ${changed} página(s) atualizada(s). Publique as páginas e as fotos juntas para atualizar o site online.`);
  return { changed, sections: photoSections.length };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  updatePhotos().catch((error) => {
    console.error(`Não foi possível atualizar as fotos: ${error.message}`);
    process.exitCode = 1;
  });
}
