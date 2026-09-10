#!/usr/bin/env node
// Generates ARK redirect stubs into docs/ (the GitHub Pages publish root)
// from data/modules/*.json.
//
// Qualifier convention, agreed for this project:
//   ark:/NAAN/module-01           -> landing page for the module (base_target)
//   ark:/NAAN/module-01/en        -> English text (variants.en.target)
//   ark:/NAAN/module-01/hi        -> Hindi text (variants.hi.target)
//   ark:/NAAN/module-01/en/pdf    -> English PDF (variants.en.formats.pdf)
//   ark:/NAAN/module-01/en/audio  -> English audio (variants.en.formats.audio)
// A qualifier with no target set is skipped rather than redirected to
// nothing - fill in the JSON record as real files/pages become available
// and rerun this script; it never invalidates identifiers already handed out.
//
// N2T resolver behavior, per RegistryofTypeDesign/scripts/build.js: a
// registered NAAN's resolver rule forwards ark:<NAAN>/<name> to a literal
// `ark:/<NAAN>/<name>` path on the site (colon included), and N2T strips
// hyphens from <name> before forwarding (ARK spec: hyphens are structural,
// not significant). RTD confirmed that by resolving a bare name through
// n2t.net and inspecting the redirect chain (2026-08-05) - it has NOT been
// confirmed here for a *qualified* name (base + /en/pdf), since Archiving
// the Present has no NAAN yet. Once one is assigned and this NAAN constant
// below is filled in, resolve a qualified ARK through n2t.net and check
// whether hyphens are stripped from the qualifier portion too, the same
// way, before trusting the qualified redirect paths this script writes.
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
    writeFile(`ark:/${ARK_NAAN}/servicestatus/index.html`, html);
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
        `ark:/${ARK_NAAN}/${content}`,
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
          `ark:/${ARK_NAAN}/${content}/${lang}`,
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
            `ark:/${ARK_NAAN}/${content}/${lang}/${format}`,
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
