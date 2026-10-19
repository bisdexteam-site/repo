# BISdex Design Specification

Version 0.3, October 2026
Source documents: *BISdex site brief* and the *BISdex Site Mockups* design canvas

This spec describes how the new BISdex site should look and behave. It follows the brief and the reviewed mockups and guides the Astro build. Section 12 records how the open decisions from version 0.1 were settled.

**Changes from 0.1:** relevancy ratings move from a source-level section into each review (5.4, 5.6, 5.7); the summary strip no longer includes relevancy (5.1); the open decisions are settled (12).

**Changes from 0.2:** no one-line summary under the source page title; the Description section covers it (5.1, 5.4).

---

## 1. Design principles

1. **Formal and editorial.** The site reads like a reference work, not a marketing site. Flat surfaces, thin rules, no gradients, shadows, or decorative imagery.
2. **Content first.** Every page leads with its title and the information a librarian came for. Chrome (header, footer) stays light.
3. **Separate the two voices.** Editor-maintained source information and reviewer critiques must look distinct, so readers always know who is speaking.
4. **Accessible by default.** WCAG 2.2 AA is a floor, not a goal. Meaning never depends on color alone.
5. **Stable and citable.** Page structure, headings, and URLs stay consistent so pages can be cited and linked over time.

---

## 2. Design tokens

### 2.1 Color

The palette is built from the BISdex logo. The ALA logo is not used anywhere on the site.

| Token | Hex | Role | Contrast on white | Contrast on surface |
|---|---|---|---|---|
| `--color-primary` | `#083C48` | Header bar, headings, links, primary buttons, grade tile | 12.0:1 | 10.9:1 |
| `--color-primary-hover` | `#0F5A6B` | Link and button hover, focus ring | 7.8:1 | 7.1:1 |
| `--color-logo-gray` | `#98A2AF` | Decorative only: dividers, borders, index letters, "dex" in the wordmark | 2.6:1 | 2.4:1 |
| `--color-text-secondary` | `#5B6672` | Captions, dates, reviewer descriptors, helper notes | 5.9:1 | 5.3:1 |
| `--color-text` | `#1F2A30` | All body text | 14.7:1 | 13.4:1 |
| `--color-surface` | `#F2F5F6` | Intro bands, footer, panels, table striping | n/a | n/a |
| `--color-background` | `#FFFFFF` | Page background | n/a | n/a |

Supporting neutrals (derived, not from the brief):

| Token | Hex | Role |
|---|---|---|
| `--color-rule` | `#E1E6E9` | Hairline dividers between rows and sections; empty meter segments |
| `--color-border-subtle` | `#D5DBDF` | Swatch and panel outlines where needed |

Rules:

- `--color-logo-gray` must never carry text that conveys meaning. The wordmark is exempt as a logotype.
- White text is allowed only on `--color-primary` or `--color-primary-hover`.
- The yellow "Mockup" banner in the canvas is a review aid only and is not part of the production palette.

### 2.2 Typography

| Token | Value |
|---|---|
| `--font-heading` | `"Barlow Condensed", "Arial Narrow", sans-serif` |
| `--font-body` | `"Source Sans 3", system-ui, sans-serif` |
| `--font-mono` | `ui-monospace, monospace` (hex codes, technical notes only) |

Both families are free on Google Fonts; self-host the WOFF2 files in the Astro build instead of loading from Google, so the site makes no third-party font requests. Alternatives reviewed on the canvas: IBM Plex Sans Condensed and Archivo Narrow. The heading face is set in one token so it can be swapped.

Type scale (desktop; see 2.4 for mobile):

| Style | Family | Weight | Size / line height | Case and tracking | Color |
|---|---|---|---|---|---|
| Wordmark "BISdex" | Heading | 700 | 44px / 1 | +0.5px | Primary + logo gray |
| Wordmark subtitle | Heading | 500 | 15px | Uppercase, +1.2px | Secondary |
| Main nav | Heading | 600 | 20px | Uppercase, +0.4px | Primary |
| Page title (source) | Heading | 700 | 64px / 1 | none | Primary |
| Page title (text pages) | Heading | 700 | 56px / 1.05 | none | Primary |
| Home intro line | Heading | 600 | 46px / 1.12 | none | Primary |
| Section heading (h2) | Heading | 700 | 26 to 28px / 1.2 | Uppercase, +0.6px | Primary |
| Sub-heading (h3) | Body | 700 | 18px | none | Text |
| Lead paragraph | Body | 400 | 22px / 1.45 to 1.5 | none | Text |
| Body | Body | 400 | 18px / 1.6 to 1.65 | none | Text |
| Small / caption | Body | 400 | 15 to 16px / 1.5 | none | Secondary |
| Eyebrow label ("On this page") | Heading | 600 | 16px | Uppercase, +0.8px | Secondary |

Rules:

- One h1 per page. Headings never skip a level.
- Body copy line length stays at or under about 75 characters (`max-width: 720px` to `780px`).
- Italics are used for titles in APA citations only.

### 2.3 Spacing, shape, and lines

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Meter segment gaps |
| `--space-2` | 8px | Tight stacks |
| `--space-3` | 12px | List item padding |
| `--space-4` | 16px | Component padding |
| `--space-5` | 24px | Page gutter, grid gaps |
| `--space-6` | 36px | Section vertical padding (source page) |
| `--space-7` | 48px | Section gaps, column gaps |
| `--space-8` | 64px | Intro band top padding |
| `--radius` | 4px | Buttons, panels, grade tile |
| `--rule-hair` | 1px `--color-rule` | Row and section dividers |
| `--rule-frame` | 1px `--color-logo-gray` | Header and footer borders |
| `--rule-strong` | 2px `--color-primary` | Under index heading, above sidebar nav, table header |
| `--brand-bar` | 6px `--color-primary` | Full-width strip at the very top of every page |

### 2.4 Layout and breakpoints

- Content container: `max-width: 1120px`, centered, `24px` side gutters.
- Reading column: `max-width: 720px` (text pages) or `780px` (source page content).
- Layout is fluid and built with flex-wrap and CSS grid, so it reflows without hard breakpoints. Reference widths:
  - **Wide (1024px and up):** source page sections use a two-column layout (heading column 200 to 240px, content column).
  - **Narrow (below about 820px):** section headings stack above their content; the Editorial sidebar stacks above the article; index columns collapse to one.
- Mobile type: page titles scale down to about 44px, home intro to about 34px, section headings to 24px (use `clamp()`).
- No horizontal page scroll at 320px. Wide tables scroll inside their own box.

---

## 3. Global components

### 3.1 Brand bar and header

- 6px primary-teal strip across the top.
- White header with a 1px logo-gray bottom border.
- Left: the BISdex logo (existing logo file in production; the mockups rebuild it in type), linked to Home, with an accessible name of "BISdex home".
- Right: main nav with three items: **Sources** (Home), **About**, **Editorial Policy**.
- The current page shows a 3px primary underline and `aria-current="page"`.
- On narrow screens the nav wraps below the logo. No hamburger menu is needed for three items.

### 3.2 Skip link

First focusable element on every page: "Skip to main content", visually hidden until focused, targets `#main`.

### 3.3 Intro band

Full-width `--color-surface` band under the header holding the page h1 (and, on About, the lead paragraph). Bottom hairline rule.

### 3.4 Footer (site-wide)

`--color-surface` background, 1px logo-gray top border, 15px secondary text, two lines:

1. "BISdex is maintained by the Business Information Sources Committee, BRASS, RUSA, American Library Association · bisdex.team@gmail.com" (email is a `mailto:` link)
2. "Reviews reflect the opinions of individual reviewers, not BISdex or ALA. Read the full disclaimer." (link to Disclaimer)

### 3.5 Links

- Primary teal, underlined, `text-underline-offset: 3 to 4px`.
- Hover: hover teal, with underline thickened to 2px.
- External links that open a new tab say so in visually hidden text.

### 3.6 Buttons

| Variant | Use | Style |
|---|---|---|
| Primary | "Leave a review" | Primary fill, white text, heading font 600 20px uppercase, min height 48px, 24px side padding, 4px radius, trailing external-link icon |
| Secondary | "Copy citation" | White fill, 2px primary border, primary text, body font 700 16px, min height 44px |

Hover: primary background becomes hover teal; secondary border and text become hover teal. Use real `<button>` or `<a>` elements only.

### 3.7 Focus state

All interactive elements: `outline: 3px solid --color-primary-hover; outline-offset: 3px`, shown on `:focus-visible`. Never remove outlines without a replacement.

### 3.8 Icons

Inline stroke SVG only, 14 to 16px, `stroke="currentColor"`, `aria-hidden="true"` when decorative. Current set: external link (arrow out), check mark (verified badge). No emoji.

---

## 4. Page: Home / Index

**Purpose:** a static, alphabetical index of every source. No search box or filters at launch.

Structure:

1. Header
2. Intro band with the h1: "Quick insights into leading & emerging business information sources; by and for librarians"
3. Index section
   - Heading row: h2 "Sources A to Z" with a count on the right ("4 sources at launch"), 2px primary rule below.
   - Source names only, each a link to its source page, 20px semibold, underlined, 1px hairline between rows.
   - Layout: grouped under letter headings (34px heading font in logo gray, decorative), in a responsive grid (`repeat(auto-fill, minmax(240px, 1fr))`). A plain multi-column list without letters was the reviewed alternative; keep the grouping switchable in one place.
4. Footer

Rules: alphabetical by source name, ignoring leading "The"; the list is generated from the source collection at build time.

---

## 5. Page: Source page

**URL pattern:** `/sources/<slug>/` (for example `/sources/ibisworld/`).
Model page: IBISWorld.

### 5.1 Page top

- Breadcrumb: "Sources / [Source name]" (`nav aria-label="Breadcrumb"`).
- h1: source name.
- Caption: "Source information last reviewed [Month Year]".
- Summary strip: off. If turned on later, it shows small bordered tiles for the WCAG grade and review count only.

### 5.2 "On this page" links

A wrapping row of anchor links to every section present on the page, under the top band, with a hairline below. On.

### 5.3 Section layout

Every section uses the same pattern:

- `<section id>` labelled by its h2.
- Two columns on wide screens: h2 on the left (200 to 240px), content on the right (up to 780px). Stacks on narrow screens.
- 36px vertical padding, hairline rule between sections.

### 5.4 Sections, in order

| # | Section | `id` | Content and display |
|---|---|---|---|
| 1 | Source | (page top) | Name, last-reviewed date |
| 2 | Description | `description` | Definition list: **Vendor** (linked to vendor URL), **Best known for** (coverage summary, including coverage claims) |
| 3 | Alternatives | `alternatives` | List of similar or budget-friendly sources. Names in BISdex link to their source page; others show "Not yet in BISdex" in secondary text. An optional short note after each name. |
| 4 | Content | `content` | Definition list: product or module name (bold, primary) with a short description |
| 5 | AI Features | `ai` | Prose description |
| 6 | Use Cases | `usecases` | Two groups with h3 headings, side by side on wide screens: **Teaching and Instruction**; **Commercial and Industry** |
| 7 | Accessibility | `accessibility` | See 5.5 |
| 8 | Reviews | `reviews` | See 5.7; relevancy ratings appear inside each review (5.6) |
| 9 | FAQ | `faq` | Native `<details>`/`<summary>` pairs; first item open; hairline between items |
| 10 | Cite this page | `cite` | See 5.8 |

Optional sections with no content are omitted, along with their "On this page" link.

### 5.5 Accessibility section

Two states:

- **Graded:** a 104px square tile in primary teal with the letter grade in white (heading font 700, 56px), `role="img"` and `aria-label="BISdex WCAG grade B+"`. Beside it: "BISdex WCAG grade", "Based on the Library Accessibility Alliance review ([year])" (linked), and a secondary note "Grade assigned by BISdex editors from the LAA score. How grades are assigned" (linked to Editorial Policy, `#grades`).
- **Not yet reviewed:** the same tile size with a 2px dashed logo-gray border and the text "Not yet reviewed" in secondary gray, plus a note that no LAA review exists yet.

Grades follow the GPA-style table in Section 7. The editorial board assigns them; they are never part of a review.

### 5.6 Relevancy ratings (inside each review)

- Relevancy belongs to the individual reviewer. It is shown inside each review item, never as a source-level section, and never combined across reviews.
- Up to three rows, in this fixed order: Researchers; Teaching / Students; Commercial / Industry / Entrepreneurs. Audiences the reviewer didn't rate are left out; if none were rated, the block is omitted.
- Each row: audience label, a three-segment meter (34 x 10px segments, filled primary or empty `--color-rule`), and the text label (Low, Average, High) in bold primary.
- The meter is `aria-hidden`; the text label carries the meaning.
- Small heading above the rows: "Reviewer's relevancy ratings".

### 5.7 Reviews section

- Heading column shows the h2 plus "[N] published reviews · newest first".
- **Call-to-action panel** (surface background, 4px radius): primary "Leave a review" button linking to the Google Form (`https://forms.gle/JkQis9eyVQNvtebw9`, new tab), with the note: "Reviews are submitted through Google Forms. Contact information is used only for verification and is never published." The button appears from launch.
- **Review item** (`<article>`), newest first, hairline between items:
  1. Reviewer descriptor (15px secondary), built from the fixed fields joined with " · ": role, institution type, experience, relationship to resource, then the badge "✓ Verified by BISdex editors" in primary semibold with the check icon.
  2. Date (`<time>`), "Month Year".
  3. Relevancy ratings (5.6).
  4. Review text, prose, as approved (up to 500 words). Never edited.
  5. Disclosures, only when relevant, 15px secondary, prefixed with bold "Disclosure:". For example, AI use (with the reviewer's description of how AI tools were used) and prior vendor employment.
- Reviewer name and institution are never shown.
- Reviews are not styled as cards with colored side borders; separation is by rules and spacing.

### 5.8 Cite this page

- Label "APA 7".
- Citation in a surface panel with a hanging indent:
  `Business Information Sources Committee. (Year, Month). *Source name*. BISdex. URL`
- Generated at build time from the source name, last-reviewed date, and canonical URL.
- "Copy citation" secondary button copies plain text and announces "Citation copied" through a `role="status"` region.

---

## 6. Page: About

Single reading column (720px) under an intro band holding the h1 "About BISdex" and the lead paragraph. Sections, each with an uppercase h2: Who we are; What each source page covers; What BISdex does not cover (bulleted); Independence; How to cite BISdex (template and example citation in surface panels with hanging indents); Contact (mailto link). No editorial team listing. Copy follows the brief's About draft.

---

## 7. Page: Editorial Policy and Methodology

- Intro band with the h1.
- Two-column layout on wide screens: an "On this page" sidebar (220 to 260px, 2px primary rule above, not sticky) and the article (720px). The sidebar stacks above the article on narrow screens.
- Sections with anchors: Scope; Two kinds of content; Submitting a review; Reviewer guidelines (bulleted, bold lead-ins); Moderation; Published reviews; Reviewer anonymity; Corrections; Relevancy ratings; Accessibility grades (`#grades`); Independence.
- **Grade table:** real `<table>` with a `<caption>`, `<th scope="col">`, a 2px primary rule under the header, alternating surface striping, and a logo-gray divider between the two score/grade column pairs. Wrapped in a horizontally scrollable box on narrow screens.

| Score | Grade | Score | Grade |
|---|---|---|---|
| 97-100 | A+ | 77-79 | C+ |
| 93-96 | A | 73-76 | C |
| 90-92 | A- | 70-72 | C- |
| 87-89 | B+ | 67-69 | D+ |
| 83-86 | B | 65-66 | D |
| 80-82 | B- | Below 65 | F |

Copy follows the brief's Editorial Policy draft.

---

## 8. Page: Disclaimer

Same template as About (intro band with h1, single 720px column). Sections: Reviews are opinions; What editors verify; Editorial review; Source information; Accessibility grades; No endorsement; Trademarks; Privacy; External links. Linked from the footer on every page. Copy follows the brief's Disclaimer draft.

---

## 9. Accessibility requirements (WCAG 2.2 AA)

- **Contrast:** text at least 4.5:1, large text and UI boundaries at least 3:1. All text tokens pass on both white and surface backgrounds (Section 2.1).
- **Color independence:** grades show the letter; relevancy shows the word; links are underlined.
- **Keyboard:** skip link; logical tab order; visible focus (Section 3.7); FAQ uses native disclosure widgets; no keyboard traps.
- **Target size:** interactive controls at least 44 x 44px (24px minimum per WCAG 2.5.8; 44px is the house standard for buttons).
- **Semantics:** landmarks (`header`, `nav` with distinct labels, `main`, `footer`); one h1; definition lists for label/value pairs; `<table>` with caption for the grade scale; `<time>` for dates.
- **Images:** the logo has alt text "BISdex: Business Information Sources Index"; decorative SVGs are `aria-hidden`.
- **New tabs:** external links that open a new tab announce it.
- **Motion:** none required; respect `prefers-reduced-motion` if any is added.
- **Reflow:** usable at 320px width and 200% zoom with no horizontal scroll.

---

## 10. Content and display conventions

- Dates display as "Month Year" (for example "June 2026").
- APA 7 for all citations.
- Reviewer descriptors use only the fixed dropdown values from the review form, separated by " · ". No free text.
- Placeholders in brackets appear only during the build; production pages never show bracketed text.
- No em dashes in site copy.

---

## 11. Build notes (Astro)

- Content collections: `sources` and `reviews` as Markdown with frontmatter; `vendors` as data.
- Shared layout components: `BaseLayout` (head, brand bar, header, skip link, footer), `IntroBand`, `SourceSection`, `GradeTile`, `RelevancyMeter`, `ReviewItem`, `Citation`.
- Tokens live in one `tokens.css` as CSS custom properties matching Section 2 names.
- Fonts self-hosted (WOFF2, `font-display: swap`).
- Keep the `.pages.yml` field list matched to the frontmatter so Pages CMS can be turned on later.
- `<meta name="robots" content="noindex">` and a blocking `robots.txt` until official launch.

---

## 12. Decisions (settled October 2026)

1. **Relevancy with multiple reviews:** ratings are shown on each review only; no source-level Relevancy section (5.6).
2. **Heading typeface:** Barlow Condensed, kept swappable through `--font-heading`.
3. **Home index layout:** letter-grouped grid, kept switchable.
4. **Source page aids:** "On this page" links on; summary strip off.
5. **Launch sources:** IBISWorld first; the other three are added as editors supply their text.
6. **Logo asset:** a typeset wordmark stands in until the existing wordmark is supplied as SVG.
