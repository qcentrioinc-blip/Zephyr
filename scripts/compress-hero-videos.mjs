/**
 * Compress LifestyleHero slide videos for web + GitHub size limits.
 * Uses ffmpeg on PATH, or the project-local ffmpeg-static binary.
 * Run: npm run compress:videos
 * Or pass filenames: node scripts/compress-hero-videos.mjs slide-3.mp4 page-lock.mp4
 *
 * Settings: max width 1920, CRF 23, 30fps, no audio, faststart.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const videosDir = path.join(root, "public", "videos");

const DEFAULT_TARGETS = [
  "slide-1.mp4",
  "slide-2.mp4",
  "slide-3.mp4",
  "page-lock.mp4",
];

function mb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

function resolveFfmpeg() {
  const onPath = spawnSync("ffmpeg", ["-version"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (onPath.status === 0) return "ffmpeg";

  try {
    const staticPath = require("ffmpeg-static");
    if (staticPath && fs.existsSync(staticPath)) return staticPath;
  } catch {
    // optional dependency
  }

  return null;
}

function compressOne(ffmpegBin, filename) {
  const input = path.join(videosDir, filename);
  if (!fs.existsSync(input)) {
    console.warn(`skip missing: ${filename}`);
    return;
  }

  const before = fs.statSync(input).size;
  const temp = path.join(videosDir, `${filename}.compressed.mp4`);

  const args = [
    "-y",
    "-i",
    input,
    "-vf",
    "scale='min(1920,iw)':-2,fps=30",
    "-c:v",
    "libx264",
    "-crf",
    "23",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-an",
    "-movflags",
    "+faststart",
    temp,
  ];

  console.log(`\nCompressing ${filename} (${mb(before)} MB)...`);
  const result = spawnSync(ffmpegBin, args, {
    encoding: "utf8",
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0 || !fs.existsSync(temp)) {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
    console.error(`FAILED ${filename}`);
    console.error(result.stderr?.slice(-800) || result.error || "unknown error");
    process.exitCode = 1;
    return;
  }

  const after = fs.statSync(temp).size;
  // Windows/OneDrive often blocks overwrite-in-place; remove then rename.
  fs.unlinkSync(input);
  fs.renameSync(temp, input);
  const saved = before - after;
  console.log(
    `OK ${filename}: ${mb(before)} MB → ${mb(after)} MB (saved ${mb(saved)} MB)`,
  );
}

function main() {
  const ffmpegBin = resolveFfmpeg();
  if (!ffmpegBin) {
    console.error(
      "ffmpeg not found.\n" +
        "Install system ffmpeg, or keep the ffmpeg-static devDependency:\n" +
        "  winget install ffmpeg\n" +
        "  or: npm install --save-dev ffmpeg-static\n" +
        "Then: npm run compress:videos",
    );
    process.exit(1);
  }

  const targets =
    process.argv.length > 2
      ? process.argv.slice(2).map((name) => path.basename(name))
      : DEFAULT_TARGETS;

  console.log(`Hero video compression (max 1920px, CRF 23, 30fps, no audio)`);
  console.log(`Using: ${ffmpegBin}`);
  console.log(`Targets: ${targets.join(", ")}`);
  for (const file of targets) {
    compressOne(ffmpegBin, file);
  }
  console.log("\nDone.");
}

main();
