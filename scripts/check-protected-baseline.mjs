import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(projectRoot, "docs", "qa", "protected-baseline-2026-09-16.json");

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return createHash("sha1").update(header).update(bytes).digest("hex");
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const failures = [];

  for (const [relativePath, expectedSha] of Object.entries(manifest.protectedFiles)) {
    const absolutePath = join(projectRoot, relativePath);
    try {
      const bytes = await readFile(absolutePath);
      const actualSha = gitBlobSha(bytes);
      if (actualSha !== expectedSha) {
        failures.push({ path: relativePath, expectedSha, actualSha, reason: "sha-mismatch" });
      }
    } catch (error) {
      failures.push({ path: relativePath, expectedSha, actualSha: null, reason: error.code || error.message });
    }
  }

  if (failures.length) {
    console.error("PROTECTED_BASELINE_FAIL");
    for (const failure of failures) console.error(JSON.stringify(failure));
    process.exitCode = 1;
    return;
  }

  console.log(`PROTECTED_BASELINE_PASS ${Object.keys(manifest.protectedFiles).length} files`);
  console.log(`baselineCommit=${manifest.baselineCommit}`);
  console.log(`baselineDeployment=${manifest.baselineDeployment}`);
}

main().catch((error) => {
  console.error("PROTECTED_BASELINE_ERROR", error);
  process.exitCode = 1;
});
