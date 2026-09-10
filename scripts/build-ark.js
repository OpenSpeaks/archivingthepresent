#!/usr/bin/env node
// Generates ARK redirect stubs into docs/ (the GitHub Pages publish root)
// from data/modules/*.json.
//
// Qualifier convention:
//   ark:NAAN/module-01           -> landing page for the module (base_target)
//   ark:NAAN/module-01/en        -> English text (variants.en.target)
//   ark:NAAN/module-01/hi        -> Hindi text (variants.hi.target)
//   ark:NAAN/module-01/en/pdf    -> English PDF (variants.en.formats.pdf)
//   ark:NAAN/module-01/en/audio  -> English audio (variants.en.formats.audio)
// A qualifier with no target is skipped, not redirected to nothing. Fill in
// the JSON record and rerun; existing identifiers keep resolving.
//
// N2T's resolver rule for NAAN 86534 is ark:<NAAN>/<name>, no slash after
// the colon. RegistryofTypeDesign's NAAN 54728 uses ark:/<NAAN>/<name>, with
// a slash. Don't assume one NAAN's rule for another - verify with
// curl -sD - -L https://n2t.net/ark:<NAAN>/<name>. Hyphens are stripped from
// <name>, confirmed for bare names on both NAANs; not yet checked for a
// qualified name (base + /en/pdf) on 86534.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { listRecords } from "./lib/records.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "docs");

// Registered 10 Sep 2026 for "O Foundation" - a new, second NAAN scoped to
// Archiving the Present, separate from RegistryofTypeDesign's 54728 (see
// project notes).
const ARK_NAAN = 86534;

function renderRedirectPage(title, targetUrl) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${targetUrl}">
<link rel="canonical" href="${targetUrl}">
<title>${title}</title>
</head>
<body>
<p>Redirecting to <a href="${targetUrl}">${targetUrl}</a>.</p>
</body>
</html>
`;
}

function writeFile(relPath, content) {
  const full = join(outDir, relPath);
  mkdirSync(full.split("/").slice(0, -1).join("/"), { recursive: true });
  writeFileSync(full, content);
}

function writeRedirect(humanPath, literalPath, title, targetUrl) {
  const html = renderRedirectPage(title, targetUrl);
  writeFile(`${humanPath}/index.html`, html);
  if (ARK_NAAN) {
    writeFile(`${literalPath}/index.html`, html);
  }
}

// N2T's own health check periodically resolves ark:<NAAN>/servicestatus,
// which the registered resolver rule forwards here the same way as any
// other identifier - see the "Test ARK" field on the NAAN application.
function writeServiceStatus() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ARK service status</title>
</head>
<body>
<h1>ARK service status</h1>
<p>OK.</p>
</body>
</html>
`;
  writeFile("ark/servicestatus/index.html", html);
  if (ARK_NAAN) {
    writeFile(`ark:${ARK_NAAN}/servicestatus/index.html`, html);
  }
}

function build() {
  const modules = listRecords(join(repoRoot, "data/modules"));
  let written = 0;
  let skipped = 0;

  writeServiceStatus();

  for (const record of modules) {
    const title = record.title?.en ?? record.id;
    const content = record.id.replaceAll("-", "");

    if (record.base_target) {
      writeRedirect(
        `ark/${record.id}`,
        `ark:${ARK_NAAN}/${content}`,
        title,
        record.base_target
      );
      written++;
    } else {
      skipped++;
    }

    for (const [lang, variant] of Object.entries(record.variants ?? {})) {
      if (variant.target) {
        writeRedirect(
          `ark/${record.id}/${lang}`,
          `ark:${ARK_NAAN}/${content}/${lang}`,
          `${title} (${lang})`,
          variant.target
        );
        written++;
      } else {
        skipped++;
      }

      for (const [format, target] of Object.entries(variant.formats ?? {})) {
        if (target) {
          writeRedirect(
            `ark/${record.id}/${lang}/${format}`,
            `ark:${ARK_NAAN}/${content}/${lang}/${format}`,
            `${title} (${lang}, ${format})`,
            target
          );
          written++;
        } else {
          skipped++;
        }
      }
    }
  }

  console.log(`Wrote ${written} redirect stub(s), skipped ${skipped} unset target(s).`);
  if (!ARK_NAAN) {
    console.log(
      "ARK_NAAN is not set yet - only docs/ark/<id>/... stubs were written, not the docs/ark:/<NAAN>/... ones N2T actually needs. Fill in ARK_NAAN once registered and rerun."
    );
  }
}

build();
