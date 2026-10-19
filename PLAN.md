# BISdex: build plan

A static Astro site for BISdex (Business Information Sources Index), edited by the BISdex editorial team through files in this repo and hosted on Cloudflare Workers.

- **Readers:** coding agents (Claude Code) who carry out the tasks, and the human operator who reviews their work.
- **Status:** 2026-10-15. Plan written; no code yet. Next task: P0-T1. Waiting on the operator for the inputs in section 9 (IBISWorld text, page copy, reviewer descriptor values).
- **How to use this file:** read sections 1 to 6 once, then work one task from section 8 per session.

---

## 1. For the operator

You are the operator. Agents do the work; you review it on GitHub.

- **Start a session:** open a Claude Code cloud session on `bisdexteam-site/repo` and say "Read PLAN.md, then do task P1-T1", or "do the next task" (the agent picks the first unchecked task whose dependencies are done and whose inputs exist).
- **Before launch:** agents commit and push straight to `main`. Each task is one commit. Review it afterward on GitHub (the commit's diff plus the handoff note, which is the commit message body). Undo a bad task with a revert.
- **After launch:** agents work on a branch and open a pull request. You review the Cloudflare preview link and the diff, then merge. Section 6.1 has the rules for both modes.
- **Giving content to agents:** paste or attach the editors' text in the session, and the agent saves it under `docs/handover/` before converting it (5.6).
- **Changing the plan:** edit this file, or ask an agent to. Record any decision that changes how things are built in section 10.
- **Operator-only work:** anything involving an account (GitHub settings, Cloudflare, Google Forms, Gmail) is marked **operator**. Agents don't log in to anything.

---

## 2. Project summary

| | |
| --- | --- |
| Owner | Business Information Sources Committee (BISC), BRASS, RUSA, American Library Association |
| Contact details | bisdex.team@gmail.com (public contact; also owns the review Google Form) |
| Goals | Free, public, no logins; WCAG 2.2 AA; fast; stable, citable URLs; easy for editors to update through files |
| Calls to action | "Leave a review" button on each source page, opening the Google Form `https://forms.gle/JkQis9eyVQNvtebw9` in a new tab. Contact by email. The site itself has no forms, search, comments, accounts or cookies. |
| Editors | The BISdex editorial team. They hand over text; an agent converts it. They decide WCAG grades and approve reviews. |

**Stakes:** reviews are moderated for legal liability before publication, and the site publishes them exactly as approved. WCAG 2.2 AA failures block launch. No cost or pricing data is ever stored in this repo, because the repo is public and its history is visible.

### Content rules (agents must follow)

- **Names:** "BISdex" (never "BisDex" or "BISDEX"). Full name "Business Information Sources Index". The owner is "Business Information Sources Committee" on first mention, then "the committee". Source and vendor names exactly as the editors give them.
- **Word for word:** text from `docs/handover/` is copied exactly. Only change formatting (Markdown structure, frontmatter). If the text seems wrong, keep it as is and raise it in the handoff note. One exception: **Alternatives** are restructured into one name plus a note per entry (5.2). Keep the editors' words in the note wherever possible, and list every restructured entry, before and after, in the handoff note for the operator to approve.
- **Reviews are never edited.** Not for typos, not for style. The review body is exactly the approved text.
- **Never invent** reviews, ratings, grades, citations, quotes, claims, dates, vendor details or descriptor values. Use a placeholder.
- **Placeholders:** square-bracket text that reads naturally, such as `[IBISWorld one-line summary]`. The placeholder inventory (P5-T2) must find none before launch.
- **Style:** no em dashes anywhere in site copy. Dates display as "Month Year". Citations follow APA 7. Section headings and button labels exactly as in `docs/DESIGN.md`.
- **No cost data.** Not in content, comments, commit messages or handover files. If handover text contains prices or license terms, leave them out of the handover file, and say so in the handoff note.

---

## 3. Stack

| Area | Choice | Notes |
| --- | --- | --- |
| Framework | Astro 7.x (7.4.0 current as of 2026-10-15) | Static output only. No SSR, no adapter, no UI framework (no React, Vue, etc.). Check the Astro docs: version 7 may postdate your training data. |
| Runtime / package manager | Node 22 LTS, npm | Pin with `.nvmrc` and `"engines"` in `package.json`. Commit `package-lock.json`. |
| Language | TypeScript, `strict` | Astro's strict tsconfig preset. Path alias `@/*` → `src/*`. |
| Styling | Plain CSS | Tokens in `src/styles/tokens.css` (names from `docs/DESIGN.md` section 2). Component styles scoped in `.astro` files. No Tailwind, no CSS framework. |
| Content | Astro content collections, Markdown + YAML frontmatter | Schemas in `src/content.config.ts`. One small Markdown renderer dependency for Markdown inside frontmatter fields (5.2). |
| Lint / format | `astro check`, ESLint with `eslint-plugin-astro` (including its jsx-a11y rules), Prettier with `prettier-plugin-astro` | One command: `npm run check`. |
| CMS | None at launch | `.pages.yml` is kept in step with the schemas so Pages CMS can be turned on later (5.3). |
| Hosting | Cloudflare Workers with static assets, Workers Builds from GitHub | `wrangler.jsonc` points at `./dist`. Build command `npm run build`, deploy command `npx wrangler deploy`. Free `*.workers.dev` address. |
| Domain / DNS | `*.workers.dev` for now | Exact address unknown until the Worker exists (Q4). |
| Analytics | Cloudflare Web Analytics | Cookie-free, so no consent banner. Beacon token supplied by the operator (Q7). |
| Client JS | Copy-citation button only | Every page works without JavaScript. |

---

## 4. Site structure

Structure follows the BISdex site brief (operator, 2026-10-15). Page layouts are specified in `docs/DESIGN.md`.

| Route | Page | Sections (in order) | Content source |
| --- | --- | --- | --- |
| `/` | Home / index | Intro band (h1); "Sources A to Z" with count; letter-grouped list of source names linking to source pages | `sources` collection |
| `/sources/<slug>/` | Source page | Page top (breadcrumb, name, summary, last reviewed); "On this page" links; Description; Alternatives; Content; AI Features; Use Cases; Accessibility; Reviews; FAQ; Cite this page | `sources`, `reviews`, `vendors` |
| `/about/` | About | Intro band (h1, lead); Who we are; What each source page covers; What BISdex does not cover; Independence; How to cite BISdex; Contact | `pages/about.md` |
| `/editorial-policy/` | Editorial Policy and Methodology | Intro band; sidebar "On this page"; Scope; Two kinds of content; Submitting a review; Reviewer guidelines; Moderation; Published reviews; Reviewer anonymity; Corrections; Relevancy ratings; Accessibility grades (`#grades`, with grade table); Independence | `pages/editorial-policy.md` |
| `/disclaimer/` | Disclaimer | Intro band; Reviews are opinions; What editors verify; Editorial review; Source information; Accessibility grades; No endorsement; Trademarks; Privacy; External links | `pages/disclaimer.md` |
| `404` | Page not found | Intro band ("Page not found"); one line with a link to the index | code |

There is no Relevancy section on source pages. Relevancy ratings appear on each review (operator, 2026-10-15).

**Main menu:** Sources (home), About, Editorial Policy.

**On every page:** brand bar, skip link, header (logo and menu), footer (committee credit with contact email; disclaimer line linking to `/disclaimer/`).

**Not in scope:** search, filters (location and design still undecided, operator 2026-10-15), comments, accounts, cost data, legacy redirects.

---

## 5. Architecture

### 5.1 Directory layout

```
.
├── CLAUDE.md                 # standing rules for agents
├── PLAN.md                   # this file (removed at launch)
├── README.md                 # what the site is, commands
├── .nvmrc                    # Node 22
├── .pages.yml                # Pages CMS config, kept in step with schemas
├── astro.config.mjs          # static output, site URL, trailing slashes
├── wrangler.jsonc            # Workers static assets config
├── docs/
│   ├── DESIGN.md             # design spec; wins on anything visual
│   ├── EDITING.md            # editor guide (P5-T3)
│   └── handover/             # editors' text, verbatim, never published
│       └── <slug>.md
├── public/
│   ├── robots.txt            # blocks all crawlers until launch
│   ├── favicon.svg
│   └── fonts/                # self-hosted WOFF2
└── src/
    ├── config.ts             # site URL, form URL, contact email, indexing flag, analytics token
    ├── content.config.ts     # collection schemas: the single source of truth
    ├── content/
    │   ├── sources/<slug>.md
    │   ├── reviews/<source-slug>/<yyyy-mm>-<n>.md
    │   ├── vendors.yaml
    │   └── pages/{about,editorial-policy,disclaimer}.md
    ├── components/           # IntroBand, SourceSection, GradeTile, RelevancyMeter, ReviewItem, Citation, ...
    ├── layouts/BaseLayout.astro
    ├── lib/                  # dates, sorting, citation text, markdown rendering
    ├── pages/                # routes from section 4
    └── styles/{tokens.css,global.css}
```

### 5.2 Content model

**Rule:** templates own layout and fixed wording (headings, captions, button labels). Content files hold only what editors supply. `src/content.config.ts` is the single source of truth for every field; `.pages.yml` and `docs/EDITING.md` follow it.

Rich-text fields are Markdown strings in frontmatter, rendered by one helper in `src/lib/`. Dates are stored as `YYYY-MM` strings and displayed as "Month Year".

**`sources`** (`src/content/sources/<slug>.md`; slug = filename, lowercase, hyphens)

| Field | Type | Req. | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | Display name |
| `sortName` | string | no | Only if sorting should differ from `name`; leading "The" is ignored automatically |
| `summary` | string | yes | One-line summary under the h1 |
| `lastReviewed` | `YYYY-MM` | yes | Shown at the top and used in the citation |
| `vendor` | reference → `vendors` | yes | |
| `bestKnownFor` | Markdown | yes | Coverage summary, including dated coverage claims |
| `alternatives` | list of `{ name, source?, note? }` | no | One flat list, in the editors' order. `source` is a reference to `sources` when the alternative is in BISdex; otherwise "Not yet in BISdex" is shown. Links to the old Google Site are dropped, never carried over. |
| `content` | list of `{ name, description }` | no | Products or modules |
| `aiFeatures` | Markdown | no | |
| `useCases.teaching` | list of Markdown | no | APA 7 citations or pointers |
| `useCases.commercial` | list of Markdown | no | APA 7 citations |
| `accessibility.grade` | enum `A+ A A- B+ B B- C+ C C- D+ D F` | no | Set by the editorial board, never by reviewers. Absent = "Not yet reviewed". |
| `accessibility.laaUrl` | URL | with grade | Library Accessibility Alliance review |
| `accessibility.laaYear` | number | with grade | |
| `faq` | list of `{ question, answer }` | no | `answer` is Markdown |

**`reviews`** (`src/content/reviews/<source-slug>/<yyyy-mm>-<n>.md`; body = the approved review text, verbatim)

| Field | Type | Req. | Notes |
| --- | --- | --- | --- |
| `source` | reference → `sources` | yes | |
| `date` | `YYYY-MM` | yes | |
| `role`, `institutionType`, `experience`, `relationship` | enums | yes | Exact Google Form dropdown values (Q3). Joined with " · " in the descriptor. |
| `relevancy.researchers`, `relevancy.teaching`, `relevancy.commercial` | enum `Low Average High` | no | The reviewer's own ratings. Never combined across reviews. |
| `disclosures` | list of `{ label, text }` | no | e.g. AI use, prior vendor employment |

Every published review shows the "Verified by BISdex editors" badge; there is no field for it. Reviewer names and institutions are never stored.

**`vendors`** (`src/content/vendors.yaml`): `id`, `name`, `url`.

**`pages`** (`src/content/pages/<id>.md`): `title`, `lead` (optional), Markdown body. h2s in the body become the section anchors and the Editorial Policy sidebar.

### 5.3 Pages CMS readiness

Pages CMS is not turned on. `.pages.yml` mirrors the collections in 5.2 (same fields, labels, required flags, enum options) so turning it on later only needs the operator to install its GitHub App. Unknowns, for the P0-T2 spike: whether it supports references between collections, nested lists of objects, and a Markdown field inside frontmatter. Where it doesn't, note the gap in `.pages.yml` comments and the decision log. Don't change the schema to suit it.

### 5.4 Design and theme

`docs/DESIGN.md` is the design spec and wins over this plan on anything visual. Tokens go in from the first layout task (P3-T1); there is no placeholder theme. Components use tokens only, never raw hex values. Its section 12 defaults are what we build (Barlow Condensed headings, letter-grouped index, "On this page" links on, summary strip off), each kept as a one-place change.

### 5.5 Accessibility build requirements (every task)

From `docs/DESIGN.md` section 9: landmarks, one h1, no skipped heading levels, visible focus, skip link, 44px buttons, `<time>` for dates, definition lists for label/value pairs, meaning never by color alone, external new-tab links announced, usable at 320px and 200% zoom with no horizontal scroll. These apply to every task that touches markup, not only the audit in Phase 5.

### 5.6 Content handover and conversion

1. The operator pastes or attaches editors' text in a session.
2. The agent saves it unchanged as `docs/handover/<slug>.md`, with cost or pricing data removed (2, content rules), and a one-line header saying where it came from and when.
3. The agent converts it into the source file (and review files, if any), changing structure only.
4. In the handoff note, the agent lists any field the text didn't supply (left as placeholders) and anything that didn't fit the schema.

Legacy reviews carried over from the Google Site get descriptors and dates assigned by editors; agents never infer them.

### 5.7 Publishing a new review (after launch)

The operator pastes an approved review (text, date, descriptor values, relevancy ratings, disclosures) into a session and says which source it belongs to. The agent adds the review file and nothing else. If any value doesn't match the schema, the agent stops and asks; it doesn't adjust the review. `docs/EDITING.md` includes a copy-and-paste prompt for this.

### 5.8 SEO, indexing and performance

- `src/config.ts` has `allowIndexing = false` until launch. While false, every page gets `<meta name="robots" content="noindex">` and `public/robots.txt` disallows everything.
- Every page: unique `<title>` ("Page · BISdex"), meta description, canonical URL from `SITE_URL`.
- Sitemap via `@astrojs/sitemap`.
- Fonts self-hosted, WOFF2, `font-display: swap`, only the weights in DESIGN.md.
- Client JS budget: the copy-citation script only, inline and under 2 KB.

### 5.9 Site settings

`src/config.ts` holds everything that may change in one place: `SITE_URL` (placeholder until Q4), `REVIEW_FORM_URL`, `CONTACT_EMAIL`, `allowIndexing`, `ANALYTICS_TOKEN` (empty until Q7; the beacon is omitted when empty).

---

## 6. Agent working agreement

### 6.1 Ground rules

1. **Git, before launch:** commit to `main` and push at the end of the task. One commit per task. The commit message is the "Suggested commit message" line, and the body is the full handoff note (6.4). Never force-push, rebase, reset or rewrite history.
2. **Git, after launch** (once P7-T4 is checked off): work on a branch named `task/<id>-<short-slug>`, push it, and open a pull request to `main` with the handoff note as its description. Never push to `main` and never merge.
3. **Ask before starting the dev server.** Prefer `npm run build` and `npm run preview` to verify.
4. **One task per session.** Stay inside its scope. Log anything outside it in section 11 instead of doing it.
5. **No accounts.** Don't log in to or change any external service.
6. **Content rules** (section 2) apply to every file you write.
7. **Ask before you assume.** If a decision this plan doesn't cover would be expensive to undo, stop and ask. Record the answer in section 10.
8. **Docs first.** Check the official Astro, Cloudflare and Pages CMS docs before using a feature.
9. **Don't mention the plan in the codebase.** Code comments, README and docs never mention `PLAN.md`, task IDs, phases or work "coming later". Each comment describes the code as it is now.
10. **Missing inputs:** if a task's inputs (section 9) aren't in the repo or the session, don't start it with invented content. Say so and pick another task, or stop.

### 6.2 Commands

```sh
npm install
npm run check      # astro check + eslint + prettier --check
npm run build      # must pass with zero new warnings
npm run preview    # serve dist/ locally
npm run format     # prettier --write
```

No `npm test`: see section 7. After changing `src/content.config.ts`, rebuild before trusting type errors.

### 6.3 Definition of done (every task)

- `npm run check` and `npm run build` pass.
- No new accessibility lint warnings. Interactive UI was checked with the keyboard.
- No new tests or testing tools beyond section 7.
- The task's own "Done when" items are met.
- The task is checked off in section 8, a line is added to section 11, and the status line at the top is updated.

### 6.4 Handoff note (end every session with this)

```
Task: P#-T#  <title>
Changed: <files, grouped>
Verified: <commands run + results; pages checked, or "not checked in a browser">
Not done / follow-ups: <…>
Questions for operator: <…>
Suggested commit message: <imperative, 72 chars or fewer>
```

Post it in the session as well as in the commit or pull request.

---

## 7. Testing (light by design)

Testing exists to catch broken content and broken pages, not to cover code. The site has almost no logic.

- **The automated gate:** `npm run build`, which validates every content file against the schemas (bad grade, bad date, unknown descriptor value or missing reference fails the build).
- **Before each commit:** `npm run check` and `npm run build`.
- **Unit tests:** none.
- **One-time checks, not kept as tests** (run by hand, results in the handoff note): keyboard pass, 320px and 200% zoom check, axe browser check, Lighthouse, citation text against APA 7, placeholder inventory.
- **Not planned:** CI, browser tests, coverage, visual regression. Revisit only if a real failure gets through.

---

## 8. Task list

Status: `[ ]` todo · `[x]` done. Run tasks in order unless the dependencies allow otherwise. Each task is sized for one agent session.

### Phase 0: Housekeeping and spikes

- [ ] **P0-T1 · Scaffold the Astro project**
  - Create a minimal Astro 7 project in the repo root (TypeScript strict, no sample pages or integrations beyond `@astrojs/sitemap`).
  - Add `.nvmrc`, `engines`, the npm scripts in 6.2, ESLint, Prettier, `.gitignore`.
  - Add `wrangler.jsonc` for static assets from `./dist` with the 404 page used for unknown routes (check current Cloudflare docs).
  - Add `src/config.ts` (5.9), `public/robots.txt` blocking all crawlers, and a short `README.md`.
  - One placeholder `src/pages/index.astro` with a single h1 so the build has output.
  - **Done when:** `npm run check` and `npm run build` pass from a clean clone, and `dist/index.html` exists.

- [ ] **P0-T2 · Spike: Cloudflare and Pages CMS unknowns**
  - From official docs only, answer: trailing-slash and 404 behavior for Workers static assets; how preview URLs work for non-production branches in Workers Builds; how Web Analytics is added on a `workers.dev` address (manual beacon or automatic); the Pages CMS questions in 5.3.
  - Record the answers in section 10. Change `wrangler.jsonc` only if the answers require it.
  - **Done when:** each question has a decision-log line or an open question in section 9.
  - *Depends on P0-T1.*

- [ ] **P0-T3 · Connect Cloudflare (operator)**
  - Create the Worker from `bisdexteam-site/repo` in the Cloudflare dashboard: build `npm run build`, deploy `npx wrangler deploy`, production branch `main`. Turn on preview URLs for non-production branches.
  - Send the resulting `workers.dev` address to an agent to fill in `SITE_URL` (Q4).
  - **Done when:** a push to `main` deploys and the address loads.
  - *Depends on P0-T1.*

### Phase 1: Content model

- [ ] **P1-T1 · Collections and schemas**
  - Write `src/content.config.ts` with `sources`, `reviews`, `vendors` and `pages` exactly as in 5.2.
  - Add `src/lib/` helpers: `YYYY-MM` → "Month Year", sort-name (ignore leading "The"), Markdown string rendering.
  - Add one bracket-placeholder source and review to prove the schemas build, and delete them in P2-T1.
  - **Done when:** the build passes, and a deliberately invalid grade, date or descriptor value makes it fail (check by hand, then revert).
  - *Depends on P0-T1. Descriptor enums need Q3; until then use the placeholder value `[Descriptor value]` and leave the task unchecked.*

- [ ] **P1-T2 · Pages CMS config**
  - Write `.pages.yml` matching 5.2, using the P0-T2 findings.
  - **Done when:** every schema field appears in `.pages.yml` with the same name, label and required flag, and gaps are commented.
  - *Depends on P0-T2, P1-T1.*

### Phase 2: Import

- [ ] **P2-T1 · IBISWorld source and reviews**
  - Follow 5.6 with the IBISWorld handover text. Grade **B** (editorial board, 2026-10-15). LAA review: `https://www.libraryaccessibility.org/evaluation/ibisworld`, year 2025 (operator, 2026-10-19). Add the vendor to `vendors.yaml`. Alternatives: one list of seven or more entries, restructured as name + note per 2 (content rules); Mintel, BCC Research and Capital IQ become plain names (not yet in BISdex).
  - Remove the placeholder source and review from P1-T1.
  - **Done when:** the build passes, the handover file is in `docs/handover/`, and the handoff note lists any fields left as placeholders.
  - *Depends on P1-T1. Needs Q1.*

- [ ] **P2-T2 · About, Editorial Policy and Disclaimer copy**
  - Follow 5.6 with the brief's drafts, into `src/content/pages/`. The grade table goes in the Editorial Policy body as a Markdown table under the "Accessibility grades" heading.
  - **Done when:** all three files build, with headings matching section 4.
  - *Depends on P1-T1. Needs Q2.*

### Phase 3: Layout shell

- [ ] **P3-T1 · Tokens, fonts and base styles**
  - `tokens.css` with every token in DESIGN.md section 2; self-hosted Barlow Condensed (500, 600, 700) and Source Sans 3 (400, 600, 700, 400 italic); `global.css` with base type, links, focus, skip-link styles.
  - **Done when:** no raw hex values outside `tokens.css`, and no request to any font host in the built HTML.
  - *Depends on P0-T1.*

- [ ] **P3-T2 · Base layout, header, footer, 404**
  - `BaseLayout` (head per 5.8, brand bar, skip link, header with logo and menu with `aria-current`, `<main id="main">`, footer), `IntroBand`, the 404 page.
  - Logo: typeset wordmark as in the mockups until the SVG arrives (Q5).
  - **Done when:** the placeholder index uses the layout; keyboard tab order is skip link, logo, menu; noindex meta is present while `allowIndexing` is false.
  - *Depends on P3-T1.*

### Phase 4: Pages

- [ ] **P4-T1 · Home index** (DESIGN.md section 4)
  - **Done when:** sources are grouped by letter, sorted ignoring leading "The", with the count, and the layout reflows to one column at 320px.
  - *Depends on P2-T1, P3-T2.*

- [ ] **P4-T2 · Source page: top and editorial sections**
  - Route `/sources/[slug]/`; page top; "On this page" links; `SourceSection`; Description, Alternatives, Content, AI Features, Use Cases, FAQ. Empty optional sections are omitted, along with their "On this page" link.
  - **Done when:** the IBISWorld page renders every section it has data for, and the headings outline is valid.
  - *Depends on P4-T1.*

- [ ] **P4-T3 · Source page: accessibility and reviews**
  - `GradeTile` (both states), Reviews section with the call-to-action panel and `ReviewItem` (descriptor, badge, date, relevancy rows with `RelevancyMeter`, text, disclosures), newest first, with the count.
  - Relevancy is shown inside each review only, in the fixed audience order, and audiences a reviewer didn't rate are left out.
  - **Done when:** both grade states are checked (temporarily remove the grade, then restore it), and the review descriptor shows only schema values.
  - *Depends on P4-T2.*

- [ ] **P4-T4 · Cite this page**
  - `Citation` component per DESIGN.md 5.8, with the copy button as progressive enhancement and a `role="status"` announcement.
  - **Done when:** the generated citation matches the APA 7 pattern in DESIGN.md 5.8, and the button works by keyboard and is absent without JavaScript.
  - *Depends on P4-T2.*

- [ ] **P4-T5 · About, Editorial Policy and Disclaimer pages**
  - Templates per DESIGN.md sections 6 to 8, including the Editorial Policy sidebar from h2s and the accessible grade table.
  - **Done when:** all three render from `src/content/pages/`, and `/editorial-policy/#grades` lands on the grade section.
  - *Depends on P2-T2, P3-T2.*

### Phase 5: Hardening

- [ ] **P5-T1 · Accessibility pass**
  - Run the one-time checks in section 7 on every route and fix what fails.
  - **Done when:** results per route are in the handoff note, with no open AA failures.
  - *Depends on Phase 4.*

- [ ] **P5-T2 · SEO, performance and placeholder inventory**
  - Check titles, descriptions, canonicals and the sitemap; run Lighthouse; search `src/` for bracket placeholders and list them.
  - **Done when:** the list of remaining placeholders, each with its open question, is in the handoff note and section 9.
  - *Depends on P5-T1.*

- [ ] **P5-T3 · Editor guide**
  - `docs/EDITING.md`: what to hand over for a new source, the field reference (from 5.2), how grades are entered, the copy-and-paste prompt for publishing a review (5.7), and how to read a failed build.
  - **Done when:** the guide covers every field in the schemas, in plain language.
  - *Depends on P2-T1.*

### Phase 6: Remaining launch sources

- [ ] **P6-T1 · Second launch source** (Q6)
- [ ] **P6-T2 · Third launch source** (Q6)
- [ ] **P6-T3 · Fourth launch source** (Q6)
  - Each: follow 5.6, add the vendor if new, and link alternatives that now exist in BISdex.
  - **Done when:** the source builds and appears in the index.
  - *Depends on P2-T1; can run any time after it.*

### Phase 7: Launch

- [ ] **P7-T1 · Analytics** (agent): add the Web Analytics beacon per the P0-T2 findings. *Needs Q7.*
- [ ] **P7-T2 · Content sign-off** (**operator**, with the editorial team): every page read and approved; the placeholder inventory is empty.
- [ ] **P7-T3 · Turn on indexing** (agent): set `allowIndexing = true` and allow crawling in `robots.txt`.
- [ ] **P7-T4 · Go live** (**operator**): confirm the production deploy, put a notice with the new address on the old Google Site, and announce. From here on, rule 2 in 6.1 applies.
- [ ] **P7-T5 · Remove the plan** (agent, first pull request after launch): delete `PLAN.md`; trim `CLAUDE.md` to the maintenance rules (content rules, git and account rules, testing, review publishing); search the repo for plan references.

### Later (no tasks yet)

- Filters (WCAG grade, relevancy): location and design undecided.
- Turning on Pages CMS.
- A custom domain.

---

## 9. Open questions

| # | Question | Who answers | Blocks |
| --- | --- | --- | --- |
| Q1 | IBISWorld handover text, remaining parts: one-line summary, last-reviewed date, Content, Use Cases, FAQ, any carried-over reviews (Description, Alternatives and AI Features are in `docs/handover/ibisworld.md`) | Operator / editors | P2-T1 and every Phase 4 task |
| Q2 | About, Editorial Policy and Disclaimer copy (the brief's drafts) | Operator | P2-T2, P4-T5 |
| Q3 | Exact Google Form dropdown values for role, institution type, experience and relationship to the resource | Operator | Finishing P1-T1 |
| Q4 | The Worker's `workers.dev` address | Operator (after P0-T3) | Canonical URLs and citations; not the build |
| Q5 | Logo as SVG | Operator | Final header; a typeset wordmark stands in |
| Q6 | The other three launch sources and their handover text | Editors | Phase 6 |
| Q7 | Web Analytics beacon token | Operator | P7-T1 |

---

## 10. Decision log

| Date | Decision |
| --- | --- |
| 2026-10-15 | Static Astro site, Cloudflare Workers static assets, built from GitHub (`bisdexteam-site/repo`). No SSR. |
| 2026-10-15 | Before launch, agents commit straight to `main`; after launch, every change is a pull request with a preview link. (operator) |
| 2026-10-15 | Claude Code does the build work; standing rules live in `CLAUDE.md`. (operator) |
| 2026-10-15 | `docs/DESIGN.md` is the design spec and wins on anything visual. Design tokens from the first layout task; no placeholder theme. (operator) |
| 2026-10-15 | DESIGN.md section 12 defaults are built as easy swaps: Barlow Condensed, letter-grouped index, "On this page" on, summary strip off. (operator) |
| 2026-10-15 | Relevancy ratings belong to each review and appear on each review; no Relevancy section on source pages; never combined. Replaces DESIGN.md 0.1 sections 5.4 row 8 and 5.6. (operator) |
| 2026-10-15 | WCAG letter grades are entered by the editorial board in the source file; never part of the review form. IBISWorld: B. (operator) |
| 2026-10-15 | Editors hand over text; agents convert it word for word and keep the original in `docs/handover/`. (operator) |
| 2026-10-15 | Approved reviews are published by an agent from text the operator pastes in. (operator) |
| 2026-10-15 | Filters are out of the build; location undecided. (operator) |
| 2026-10-19 | Alternatives: one flat list per source; each entry restructured as name + note, with the restructuring approved by the operator in the handoff; links to the old Google Site dropped. (operator) |
| 2026-10-15 | Build on IBISWorld first; other launch sources are added one task each as their text arrives. (operator) |
| 2026-10-15 | Light testing: the build validates content; no unit tests, no CI. (operator) |
| 2026-10-15 | No redirects from the old Google Site; a notice there points to the new address. |

---

## 11. Log

One line per finished task, newest first: `YYYY-MM-DD · P#-T# · what changed · follow-ups`.

- 2026-10-19 · operator request · IBISWorld Description, Alternatives and AI Features saved to docs/handover/ibisworld.md · rest of Q1 still needed
- 2026-10-19 · operator request · IBISWorld LAA review link and year added to P2-T1 · handover text (Q1) still needed
- 2026-10-15 · operator request · PLAN.md, CLAUDE.md and docs/DESIGN.md (v0.2) added · inputs Q1 to Q3 needed before Phase 2
