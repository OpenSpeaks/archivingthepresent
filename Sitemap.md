# Archiving the Present — Site Map (draft)

Working sitemap for the network website, eponymous with the book *Archiving
the Present: A Community Guide to Archiving Languages, Memories, and
Knowledges*. OpenSpeaks convenes the network; this site is its public face.
Started 21 Aug 2026 ahead of a likely public launch. Status: domain
registered, teaser landing page built (24 Aug 2026); full sitemap below
still draft, not built out.

**24 Aug 2026 — domain + landing page:**
- Domain `archivingthepresent.cc` is registered.
- A single-page teaser/landing page is built at `docs/index.html` in this
  folder (GitHub Pages `/docs` convention — repo root reserved for
  planning docs and source assets, `docs/` is the publish folder).
  `docs/CNAME` is already set to `archivingthepresent.cc`.
- Hero treatment: the book cover photo (`book.jpeg`) perspective-corrected
  into a flat card image, sampled/tiled paper texture from the same photo
  as a seamless page background, rotated card with a floating drop-shadow
  animation. Wordmark rendered from `wordmark-logo.pdf` (vector), recolored
  to the book's ink red, used in the footer.
- Copy credits OpenSpeaks as the network's lead ("led by OpenSpeaks," in
  a dual-tone red/gray treatment — no bold, color carries the emphasis)
  and states the 3 Sep 2026 Kochi launch date. Specific member orgs
  (PARI/ELAR/Bukkafe) deliberately not named yet — the network will grow,
  so that roster belongs in §6 Organizations later, not hardcoded on a
  teaser page. Partner/funder logos also left off this first pass — full set
  is in `.../Manual/Cover/Manual-logos/BackCover-BLUE-C-83.59_M68.75_Y0_K0.pdf`
  (Bukkafe/OpenSpeaks/Creative Commons/PARI as publishers; Wikimedia
  Foundation/Samagata Foundation/Creative Commons as supporters; FOSS
  United, Endangered Languages Project, ELAR, Adivasi Lives Matter, Whose
  Knowledge?, Rising Voices, WikiConference India Kochi 2026, Open
  Knowledge Initiatives IIIT Hyderabad, and Jhatkaa as in-partnership-with)
  — to be added to §6 Organizations once that section is built.
- Repo created and pushed: `github.com/OpenSpeaks/archivingthepresent`
  (public), GitHub Pages enabled (`main`, `/docs`), live at
  `https://openspeaks.github.io/archivingthepresent/` pending DNS.
  Not yet done: DNS for `archivingthepresent.cc` pointed at GitHub Pages
  (registrar-side step), full multi-section site (this landing page is a
  placeholder ahead of the full 11-section build below).

Related context already on file, not repeated in full here:
- `~/HANDOFFS/openspeaks-writing-style.md` — book production state (title,
  ISBN, publisher, license, module/appendix structure)
- `~/HANDOFFS/openspeaks.md` — program/grant history, partner list, funder
  details
- `~/.claude/projects/.../memory/project_archiving_the_present_network.md`
  — naming decision, "led by OpenSpeaks" credit rule

---

## 1. Home

- Mission statement: oral knowledge as equal to written knowledge; the
  network's purpose in one paragraph
- Book cover + launch CTA (download / read online / order print)
- "Led by OpenSpeaks" credit line, linking out to OpenSpeaks's own
  Meta-Wiki program pages for funder-facing/grant-history detail
- Partner org logos (linking to §6)
- Latest field diary / news teaser (linking to §9)

## 2. The Book

- Full text online, module by module (matches the book's actual structure,
  confirm order against `ALL_MODULES_FINAL_SOURCE.md` before building):
  Preface, Introduction, Modules 1–8, Appendix A, Appendix B, Glossary,
  Gratitude, Contributors
- Download: PDF (embedded-font edition); note the vectorised backup exists
  but isn't necessarily the public-facing file
- Print edition info: Bukkafe, first edition of 50 copies tied to the 3 Sep
  Kochi launch; note re: future/standard printings once that's resolved
  with Bukkafe
- Metadata block: ISBN 978-81-982289-0-1 · CC BY-SA 4.0 (text and Siddhesh
  Gautam's illustrations) · co-published by Bukkafe and Creative Commons,
  in association with OpenSpeaks (O Foundation) · supported by Wikimedia
  Foundation, Creative Commons, Samagata Foundation
- Illustrator credit: Siddhesh Gautam, with cover/interior art shown
- Per-module trainer/author byline links → People (§5)

## 3. Learn

- Link out to the Wiki Learn portal for the self-paced courseware —
  **hosted externally, not rebuilt on this site** (see note below)
- CLDAT workshop series record: the 8 online sessions (May–Aug 2026) and
  the Kochi in-person day (3 Sep 2026) — as a completed-cohort record once
  the series wraps, not a live registration page
- Trainer list for the series (links into §5), distinct from the book's
  author list where they differ

## 4. Archives — Community Voices

- Links out to PARI language-version pages (People's Archive of Rural
  India), organised by language/community
- Community-documented language collections — per-language or
  per-community landing pages, each pointing to where the primary material
  lives (ELAR deposit, Language Archive Cologne, Wikimedia Commons)
- Each individual resource cited via its ARK identifier (see §7) rather
  than a bare external link, so citations survive a host moving

## 5. People

- Bios: the ~20 CLDAT trainers, OpenSpeaks Fellows, book
  authors/contributors, advisors (Mandana Seyfeddinipur, Padmini Ray
  Murray), illustrator (Siddhesh Gautam)
- One consistent bio format (name, community/language, role, 1–2 lines) —
  reuse whatever format the book's own Contributors chapter already
  settled on rather than inventing a second one
- Full-name credit for every contribution, per standing practice — no
  contribution folded into a generic "team" credit

## 6. Organizations — Network Partners

- OpenSpeaks (convening org — links to Meta-Wiki program pages)
- Network members: People's Archive of Rural India (PARI), Endangered
  Languages Archive (ELAR), Bukkafe, and future members
- Named project partners (from WMF3 proposal): Language Archive Cologne,
  Design Beku, Maee, Devalsari Environment Protection and Technology
  Development Society, Factum, ADS Sora, Lanjia Saora Development Agency,
  Rekhta Foundation
- Funders/supporters: Wikimedia Foundation, Creative Commons, Samagata
  Foundation — distinct section from "partners," per the publisher vs.
  funder vs. collaborator distinction already settled for the book's
  colophon (`openspeaks-writing-style.md`)

## 7. Resources & Citation (ARK)

- Plain-language explainer: what an ARK (Archival Resource Key) is, why
  the network uses persistent identifiers, how to cite a resource found
  on the site
- ARK resolver / lookup entry point
- Individual resource landing pages — one per archived item (interview,
  recording, transcript), each with its ARK, minimal metadata, rights/
  consent status, and a link to the fuller record (ELAR, Language Archive
  Cologne, Commons, or WikiVoice once that infrastructure is live)
- **Open technical question, flag before building:** who mints and hosts
  the ARK NAAN (Name Assigning Authority Number) — OpenSpeaks/O Foundation
  directly, or via an existing registered assigner (e.g. a library
  consortium, or piggybacking on a partner's existing ARK setup). Worth
  resolving before this section is designed, not after.

## 8. Ethics & Consent

- FAIR and CARE principles, explained plainly (not just named)
- Consent protocols — the practical piece the book itself centers, drawn
  from the same material as the manual's consent sections
- Fair remuneration / labour practices summary, linking to the fuller
  program documentation on Meta-Wiki

## 9. News / Field Diaries

- Blog-style updates, reusing the "field diary" format already used in
  OpenSpeaks's own Diff posts and LinkedIn updates
- Launch post, workshop recaps, individual community documentation
  stories

## 10. Get Involved

- How a community or organisation joins the network
- Contact point
- Link to relevant open calls (fellowships, grants, hardware donation
  drive) if still live at launch time

## 11. About / Credits

- Network history and governance (how OpenSpeaks convenes it, how members
  join)
- Colophon-equivalent page: publisher, license, ISBN, funder list — the
  web equivalent of the book's own colophon page, kept consistent with it

---

## Notes on scope and open questions

**Resolves an open question from the network-naming decision (19 Aug):**
whether the self-paced courseware needs to be live on this site by 3 Sep.
Per this conversation, learning content links out to the Wiki Learn portal
rather than being rebuilt here — so the launch scope is lighter than a full
courseware build: site shell, the book, the network identity/partner
pages, and outbound links (Wiki Learn, PARI, ELAR deposits). That's a much
more achievable 3 Sep target than hosting courseware in-repo.

**Still open, worth deciding before build starts:**
- Exact URL for the Wiki Learn portal link (not yet confirmed in any file
  reviewed this session)
- ARK NAAN/hosting decision (§7)
- Whether "Archives — Community Voices" (§4) links out entirely or holds
  any content directly — affects hosting/storage scope
- One GitHub Pages repo (per the 19 Aug naming-decision memory) is still
  the assumed platform; confirm this still holds now that ARK and
  external-portal linking are in the mix, since ARK resolution sometimes
  implies a redirect/server component GitHub Pages can't do natively
  (static-file workaround: a flat redirect table is fine at this scale)
