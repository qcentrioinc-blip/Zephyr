import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifests = [
  "src/herbaceutical/imageManifest.ts",
  "src/nutraceutical/imageManifest.ts",
  "src/organic/imageManifest.ts",
];

const missing = [];
const mismatches = [];

for (const manifest of manifests) {
  const txt = fs.readFileSync(path.join(root, manifest), "utf8");
  const re = /:\s*"(\/product-images[^"]+)"/g;
  let match;
  while ((match = re.exec(txt))) {
    const urlPath = match[1];
    if (!urlPath) continue;
    const disk = path.join(root, "public", ...urlPath.slice(1).split("/"));
    if (!fs.existsSync(disk)) {
      missing.push({ manifest, urlPath, disk });
      continue;
    }
    const dir = path.dirname(disk);
    const base = path.basename(disk);
    const entries = fs.readdirSync(dir);
    if (!entries.includes(base)) {
      const lower = base.toLowerCase();
      const hit = entries.find((e) => e.toLowerCase() === lower);
      if (hit && hit !== base) {
        mismatches.push({ manifest, urlPath, expected: base, actual: hit });
      }
    }
  }
}

console.log(`Missing: ${missing.length}`);
missing.slice(0, 20).forEach((x) => console.log("  ", x.urlPath));
console.log(`Case mismatches: ${mismatches.length}`);
mismatches.slice(0, 20).forEach((x) =>
  console.log(`  ${x.urlPath}\n    manifest: ${x.expected}\n    disk:     ${x.actual}`),
);
