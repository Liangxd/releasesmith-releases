/* global console, process */

import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const args = process.argv.slice(2);

function readArgument(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const assetsDirectory = resolve(readArgument("--assets-dir", "release"));
const outputPath = resolve(
  readArgument("--output", join(assetsDirectory, "SHA256SUMS.txt")),
);
const packageExtensions = [
  ".msi",
  ".exe",
  ".dmg",
  ".appimage",
  ".deb",
  ".rpm",
  ".app.tar.gz",
];

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function isReleaseAsset(filePath) {
  const name = filePath.toLowerCase();
  return packageExtensions.some((extension) => name.endsWith(extension));
}

const releaseFiles = listFiles(assetsDirectory).filter(isReleaseAsset).sort();
if (releaseFiles.length === 0) {
  throw new Error(`No installable release assets found in ${assetsDirectory}.`);
}

const lines = releaseFiles.map((filePath) => {
  const hash = createHash("sha256")
    .update(readFileSync(filePath))
    .digest("hex");
  return `${hash}  ${filePath.split(/[\\/]/).pop()}`;
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Generated ${relative(assetsDirectory, outputPath)}`);
