# BISdex: agent instructions

Read `PLAN.md` before starting work. Do one task per session from its section 8, and end with the handoff note in its section 6.4. `docs/DESIGN.md` wins on anything visual.

## Hard rules

- **Git before launch:** commit to `main` and push at the end of the task, one commit per task, with the handoff note as the commit body. Never force-push, rebase, reset or rewrite history.
- **Git after launch** (once PLAN.md task P7-T4 is checked off): work on a `task/<id>-<slug>` branch and open a pull request. Never push to `main`; never merge.
- **No accounts.** Don't log in to or change GitHub settings, Cloudflare, Google or any other service.
- **Content:**
  - Copy editors' handover text word for word; change structure only.
  - Never edit an approved review in any way.
  - Never invent reviews, ratings, grades, citations, claims, dates or descriptor values. Use a `[bracketed placeholder]`.
  - No cost, pricing or license-term data anywhere in the repo.
  - No em dashes in site copy.
- **No new tests, test tools or CI.** The build is the gate: `npm run check && npm run build`.
- **Code comments and docs never mention PLAN.md, task IDs or future work.**
