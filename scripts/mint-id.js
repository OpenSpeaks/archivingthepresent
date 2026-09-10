#!/usr/bin/env node
// Computes the next free id and a collision-safe slug for a new module
// record, so nobody has to eyeball the highest existing id by hand.
// Ported from RegistryofTypeDesign/scripts/mint-id.js. Makes no filesystem
// changes unless --write is passed.
//
// Usage:
//   node scripts/mint-id.js module "Planning before documenting"
//   node scripts/mint-id.js module "Planning before documenting" --write
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  KIND_CONFIG,
  slugify,
  listRecords,
  nextId,
  uniqueSlug,
  sameTitleCollisions,
} from "./lib/records.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(__dirname, "..");

function buildStub(id, slug, title, today) {
  return {
    id,
    slug,
    title: { en: title },
    authors: [],
    // Bare ark:/NAAN/<id> target - a landing view of the module (overview,
    // links to every language/format below it). Not the English text
    // itself: see the qualifier convention note in scripts/build-ark.js.
    base_target: null,
    // One entry per language this module exists in. Each language's
    // `target` is what ark:/NAAN/<id>/<lang> resolves to; `formats` holds
    // ark:/NAAN/<id>/<lang>/<format> targets (pdf, audio, ...), left empty
    // until that file actually exists - build-ark.js skips null/absent
    // targets rather than emitting a redirect to nothing.
    variants: {
      en: { target: null, formats: {} },
    },
    record_status: "active",
    superseded_by: null,
    created_at: today,
    updated_at: today,
  };
}

function main() {
  const [, , kindArg, titleArg, ...rest] = process.argv;
  const write = rest.includes("--write");

  if (!kindArg || !KIND_CONFIG[kindArg] || !titleArg) {
    console.error(
      'Usage: node scripts/mint-id.js module "Module title" [--write]'
    );
    process.exit(1);
  }

  const { dir, prefix } = KIND_CONFIG[kindArg];
  const absDir = join(repoRoot, dir);
  const records = listRecords(absDir);

  const id = nextId(records, prefix);
  const baseSlug = slugify(titleArg);
  const existingSlugs = new Set(records.map((r) => r.slug));
  const slug = uniqueSlug(baseSlug, existingSlugs);

  const collisions = sameTitleCollisions(records, titleArg);

  console.log(`Next ${kindArg} id: ${id}`);
  console.log(
    `Suggested slug: ${slug}` +
      (slug !== baseSlug
        ? ` (disambiguated, "${baseSlug}" is already taken)`
        : "")
  );

  if (collisions.length) {
    console.log(
      `\nWarning: ${collisions.length} existing active ${kindArg} record(s) already use the title "${titleArg}":`
    );
    for (const r of collisions) console.log(`  - ${r.id} (${r.slug})`);
    console.log(
      "If this is the same module, edit that file instead of minting a new id."
    );
  }

  if (write) {
    const today = new Date().toISOString().slice(0, 10);
    const outPath = join(absDir, `${slug}.json`);
    if (existsSync(outPath)) {
      console.error(`\nRefusing to overwrite existing file: ${outPath}`);
      process.exit(1);
    }
    const stub = buildStub(id, slug, titleArg, today);
    writeFileSync(outPath, JSON.stringify(stub, null, 2) + "\n");
    console.log(`\nWrote stub: ${dir}/${slug}.json`);
    console.log("Fill in authors, base_target, and variants targets, then run `npm run build:ark`.");
  }
}

main();
