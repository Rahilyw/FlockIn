/**
 * Uploads event poster files to Firebase Storage and writes each download URL
 * back to the corresponding Firestore event document.
 *
 * Usage (from project root):
 *   npx tsx scripts/upload-posters.ts
 *   npx tsx scripts/upload-posters.ts --dry-run   (lists files, no uploads)
 *
 * Requires:  scripts/service-account.json
 * Poster folder: evt-posters/   (evt-001-poster.png, evt-002-poster.jpg …)
 */

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join, extname, basename } from "path";
import { readdirSync, statSync } from "fs";

const require = createRequire(import.meta.url);
const __dir = dirname(fileURLToPath(import.meta.url));

const serviceAccount = require(join(__dir, "service-account.json")) as ServiceAccount & {
  project_id: string;
};

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const db = getFirestore();
const bucket = getStorage().bucket();

const DRY_RUN = process.argv.includes("--dry-run");
const POSTERS_DIR = join(__dir, "../evt-posters");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
};

// Extract evt-XXX id from filename like "evt-001-poster.png"
function parseEventId(filename: string): string | null {
  const match = filename.match(/^(evt-\d+)-poster\./);
  return match ? match[1] : null;
}

async function uploadPoster(
  filePath: string,
  eventId: string,
  ext: string,
): Promise<string> {
  const destination = `event-posters/${eventId}${ext}`;
  const contentType = MIME[ext.toLowerCase()] ?? "application/octet-stream";

  await bucket.upload(filePath, {
    destination,
    metadata: { contentType },
    public: true,
  });

  const file = bucket.file(destination);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "01-01-2099",
  });

  return url;
}

async function main() {
  console.log(`\n📸 FlockIn Poster Uploader${DRY_RUN ? " (--dry-run)" : ""}\n`);

  const files = readdirSync(POSTERS_DIR).filter((f) => {
    const ext = extname(f).toLowerCase();
    return statSync(join(POSTERS_DIR, f)).isFile() && ext in MIME;
  });

  if (files.length === 0) {
    console.log("No poster files found in evt-posters/");
    process.exit(0);
  }

  let uploaded = 0;
  let skipped = 0;

  for (const file of files.sort()) {
    const eventId = parseEventId(file);
    if (!eventId) {
      console.log(`  ⚠  Skipping unrecognised filename: ${file}`);
      skipped++;
      continue;
    }

    const ext = extname(file).toLowerCase();
    const filePath = join(POSTERS_DIR, file);

    if (DRY_RUN) {
      console.log(`  [dry-run] ${file}  →  event-posters/${eventId}${ext}`);
      continue;
    }

    process.stdout.write(`  Uploading ${file} …`);
    try {
      const url = await uploadPoster(filePath, eventId, ext);
      await db.collection("events").doc(eventId).update({ posterUrl: url, updatedAt: new Date() });
      console.log(" ✓");
      uploaded++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(` ✗  ${msg}`);
      skipped++;
    }
  }

  if (!DRY_RUN) {
    console.log(`\n✅ Done. ${uploaded} uploaded, ${skipped} skipped.\n`);
  } else {
    console.log(`\n${files.length} files would be uploaded.\n`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Upload failed:", err.message ?? err);
  process.exit(1);
});
