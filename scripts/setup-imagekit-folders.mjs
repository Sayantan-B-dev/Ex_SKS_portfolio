// Creates the two ImageKit folders this site writes blog images into:
//
//   /sks-portfolio
//   /sks-portfolio/blogs
//
//   npm run setup:imagekit
//
// CREATE ONLY. This script never lists, moves, renames, or deletes anything, so
// the rest of the ImageKit media library (other images and folders) is left
// exactly as it is. Deleting or editing media in ImageKit is a manual action
// taken by the account owner, never by code. See AGENTS.md.
import { readFileSync } from "node:fs";

const API_BASE = "https://api.imagekit.io/v1";
const ROOT_FOLDER = "sks-portfolio";
const BLOG_FOLDER = "blogs";

function loadEnvFile(path) {
  try {
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch {
    // The file is optional : real environment variables always win.
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

// The live environment currently spells the key without the second "A".
const privateKey =
  process.env.IMGEKIT_PRIVATE_KEY?.trim() ||
  process.env.IMAGEKIT_PRIVATE_KEY?.trim();

if (!privateKey) {
  console.error(
    "No ImageKit private key found. Set IMGEKIT_PRIVATE_KEY (or IMAGEKIT_PRIVATE_KEY) in .env.local."
  );
  process.exit(1);
}

const auth = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

async function createFolder(folderName, parentFolderPath = "/") {
  const path = parentFolderPath === "/" ? `/${folderName}` : `${parentFolderPath}/${folderName}`;
  const response = await fetch(`${API_BASE}/folder`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    // The API requires parentFolderPath even for a root-level folder.
    body: JSON.stringify({ folderName, parentFolderPath }),
  });

  if (response.ok) {
    console.log(`created  ${path}`);
    return true;
  }

  // An existing folder comes back as "already exists" (409/400). ImageKit also
  // creates folders on upload, so anything else here is reported, not fatal.
  const detail = await response
    .json()
    .then((payload) => payload?.message)
    .catch(() => null);
  const alreadyExists = response.status === 409 || response.status === 400;
  console.log(
    `${alreadyExists ? "exists   " : "skipped  "} ${path}${
      detail ? ` : ${detail}` : ` (${response.status})`
    }`
  );
  return alreadyExists;
}

try {
  await createFolder(ROOT_FOLDER);
  await createFolder(BLOG_FOLDER, `/${ROOT_FOLDER}`);
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/\/+$/, "");
  console.log(
    `\nDone. Blog images upload to /${ROOT_FOLDER}/${BLOG_FOLDER}${
      endpoint ? ` and are served from ${endpoint}` : ""
    }.`
  );
  console.log("Nothing else in ImageKit was read, changed, or removed.");
} catch (error) {
  console.error(`Could not reach ImageKit: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
