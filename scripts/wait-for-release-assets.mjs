/* global console, fetch, setTimeout */

import process from "node:process";

const repository = process.env.GITHUB_REPOSITORY;
const tag = process.env.RELEASE_TAG;
const token = process.env.GH_TOKEN;
const maxAttempts = Number.parseInt(process.env.MAX_ATTEMPTS ?? "45", 10);
const pollMilliseconds =
  Number.parseInt(process.env.POLL_SECONDS ?? "20", 10) * 1000;

if (!repository) throw new Error("GITHUB_REPOSITORY is required.");
if (!tag) throw new Error("RELEASE_TAG is required.");
if (!token) throw new Error("GH_TOKEN is required.");

const apiRoot = `https://api.github.com/repos/${repository}`;
const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function assetNameFromUrl(assetUrl) {
  const pathname = new URL(assetUrl).pathname;
  return decodeURIComponent(pathname.split("/").pop() ?? "");
}

function requiredAssetNames(metadata) {
  const names = new Set(["latest.json"]);

  for (const platform of Object.values(metadata.platforms ?? {})) {
    if (
      !platform ||
      typeof platform !== "object" ||
      typeof platform.url !== "string"
    )
      continue;

    const name = assetNameFromUrl(platform.url);
    if (!name) continue;

    names.add(name);
    if (/\.(?:exe|msi|app\.tar\.gz)$/i.test(name)) names.add(`${name}.sig`);
  }

  return names;
}

async function inspectRelease() {
  const releaseUrl = `${apiRoot}/releases/tags/${encodeURIComponent(tag)}`;
  const releaseResponse = await fetch(releaseUrl, { headers });

  if (releaseResponse.status === 404) return { missing: ["release"] };

  const releaseText = await releaseResponse.text();
  if (!releaseResponse.ok) {
    throw new Error(
      `GitHub release lookup failed with ${releaseResponse.status}: ${releaseText}`,
    );
  }

  const release = JSON.parse(releaseText);
  if (release.draft) return { missing: ["published release"] };

  const assetNames = new Set((release.assets ?? []).map((asset) => asset.name));
  const latestAsset = (release.assets ?? []).find(
    (asset) => asset.name === "latest.json",
  );
  if (!latestAsset) return { missing: ["latest.json"] };

  const metadataResponse = await fetch(latestAsset.browser_download_url, {
    headers: { ...headers, Accept: "application/octet-stream" },
  });
  const metadataText = await metadataResponse.text();
  if (!metadataResponse.ok) {
    throw new Error(
      `latest.json download failed with ${metadataResponse.status}: ${metadataText}`,
    );
  }
  const metadata = JSON.parse(metadataText);
  const missing = [...requiredAssetNames(metadata)].filter(
    (name) => !assetNames.has(name),
  );
  return { missing };
}

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    const { missing } = await inspectRelease();
    if (missing.length === 0) {
      console.log(`GitHub Release ${tag} has all expected assets.`);
      process.exit(0);
    }

    console.log(
      `Waiting for GitHub Release ${tag} assets (attempt ${attempt}/${maxAttempts}): ${missing.join(", ")}`,
    );
  } catch (error) {
    console.log(
      `Waiting for GitHub Release ${tag} metadata (attempt ${attempt}/${maxAttempts}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (attempt < maxAttempts) await sleep(pollMilliseconds);
}

throw new Error(`Timed out waiting for complete GitHub Release assets: ${tag}`);
