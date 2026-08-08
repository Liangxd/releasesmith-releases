/* global Blob, FormData, URL, URLSearchParams, console, fetch */

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const token = process.env.GITEE_TOKEN;
const owner = process.env.GITEE_OWNER;
const repository = process.env.GITEE_REPOSITORY;
const tag = process.env.RELEASE_TAG ?? process.env.GITHUB_REF_NAME;
const productName = process.env.RELEASE_PRODUCT ?? repository;
const releaseDirectory = path.resolve(
  process.env.RELEASE_DIRECTORY ?? "release",
);

if (!token)
  throw new Error("GITEE_TOKEN is required to publish the Gitee release.");
if (!owner || !repository)
  throw new Error("GITEE_OWNER and GITEE_REPOSITORY are required.");
if (!tag) throw new Error("RELEASE_TAG is required to publish the Gitee release.");

const apiBase = `https://gitee.com/api/v5/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
const publicReleaseBase = `https://gitee.com/${owner}/${repository}/releases/download/${encodeURIComponent(tag)}`;

function apiHeaders(extra = {}) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(pathname, options = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...options,
    headers: apiHeaders(options.headers),
  });
  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new Error(
      `Gitee API ${response.status} ${response.statusText}: ${JSON.stringify(payload)}`,
    );
  }
  return payload;
}

async function getExistingRelease() {
  const response = await fetch(
    `${apiBase}/releases/tags/${encodeURIComponent(tag)}`,
    {
      headers: apiHeaders(),
    },
  );
  if (response.status === 404) return null;

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new Error(
      `Gitee release lookup failed with ${response.status}: ${JSON.stringify(payload)}`,
    );
  }
  return payload;
}

async function getOrCreateRelease() {
  const existing = await getExistingRelease();
  if (existing) return existing;

  const form = new URLSearchParams({
    tag_name: tag,
    name: `${productName} ${tag}`,
    body: `${productName} ${tag}\n\nWindows 和 macOS 安装包由 Tauri Updater 签名，GitHub 与 Gitee 同步提供下载。`,
    target_commitish: "main",
    prerelease: "false",
  });

  return request("/releases", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
}

async function removeExistingAttachments(releaseId) {
  const attachments = await request(`/releases/${releaseId}/attach_files`);
  const items = Array.isArray(attachments)
    ? attachments
    : (attachments?.data ?? []);

  for (const attachment of items) {
    if (!attachment?.id) continue;
    await request(`/releases/${releaseId}/attach_files/${attachment.id}`, {
      method: "DELETE",
    });
  }
}

async function rewriteLatestJson() {
  const metadataPath = path.join(releaseDirectory, "latest.json");
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));

  for (const platform of Object.values(metadata.platforms ?? {})) {
    if (
      !platform ||
      typeof platform !== "object" ||
      typeof platform.url !== "string"
    )
      continue;

    const sourceUrl = new URL(platform.url);
    const fileName = decodeURIComponent(path.basename(sourceUrl.pathname));
    platform.url = `${publicReleaseBase}/${encodeURIComponent(fileName)}`;
  }

  await writeFile(
    metadataPath,
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8",
  );
}

async function releaseFiles() {
  const names = (await readdir(releaseDirectory)).sort();
  const files = [];

  for (const name of names) {
    const filePath = path.join(releaseDirectory, name);
    if ((await stat(filePath)).isFile()) files.push({ name, filePath });
  }

  if (!files.some((file) => file.name === "latest.json")) {
    throw new Error("GitHub release download did not contain latest.json.");
  }

  return files;
}

async function uploadAttachment(releaseId, file) {
  const form = new FormData();
  form.append("file", new Blob([await readFile(file.filePath)]), file.name);
  await request(`/releases/${releaseId}/attach_files`, {
    method: "POST",
    body: form,
  });
}

const release = await getOrCreateRelease();
if (!release?.id)
  throw new Error("Gitee release response did not include an id.");

await rewriteLatestJson();
await removeExistingAttachments(release.id);

const files = await releaseFiles();
for (const file of files) {
  await uploadAttachment(release.id, file);
  console.log(`Uploaded Gitee release asset: ${file.name}`);
}

console.log(
  `Gitee release synchronized: ${owner}/${repository}@${tag} (${files.length} assets)`,
);
