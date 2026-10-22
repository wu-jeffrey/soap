# FM Guidelines (template quick-paste)

A single-page template picker for family medicine charting. ~158 templates — common
presentations as brief SOAP notes, exam blocks, procedure notes, letters, and patient
emails — type a couple of letters, press Enter, and the note is on your clipboard,
ready to paste into PSS with tabbable `<<fields>>` for the blanks.

**Use it here: https://tinyurl.com/soapqp** (easy to remember and dictate)

That short link redirects to the permanent home, https://wu-jeffrey.github.io/soap/ —
bookmark whichever you like; if the short link ever stops working or is blocked by
clinic filters, the permanent one always works.

## Setup (once, ~1 minute per room)

1. Open the link above on each exam-room computer.
2. Bookmark it (or set it as a pinned tab) so it sits next to the EMR tab all day.

No install, no account, no login needed to read and copy.

## Daily use

1. Click the tab (or `Cmd/Ctrl+Tab` to it).
2. Just start typing — the search box is always live: `uti`, `knee`, `pap`, `cold`…
   Lay terms and abbreviations work too ("pink eye", "strep", "BP").
3. Press **Enter** — the selected (or top) match is copied.
4. Switch to PSS and paste. Everything in brackets (guillemets `« »` by default —
   PSS's native field markers) is a fill-in field — press **Tab** in PSS to jump
   through them: **type** to fill in a blank, or **delete** an option you're not
   using. Alternatives (like drug choices) are separate self-contained fields, so
   one delete removes the whole option cleanly.

Keyboard: type anywhere to search · `↑`/`↓` select · `Enter` copy · `Esc` clear.
Templates you use most float to the top of the list.

Top-right buttons: **✎ edit mode** (see below), **bracket style** (guillemets `« »`
default, or `<< >>`, `[ ]`, `( )`, or any custom pair) and a **light/dark theme**
toggle. Bracket and theme choices are remembered per browser.

## Editing templates (passphrase required)

Click the **pencil** button (top right) and enter the edit passphrase — once per
browser. While unlocked:

- **Edit** / **Delete** buttons appear on the previewed template.
- **+ New** (top right) adds a template: title, category, search keywords, body.
- Saves go live on **every computer within seconds** (other computers pick the
  change up next time the page loads).

Conventions: wrap anything tabbable in `<<...>>` (shown as `« »` etc. per the
bracket setting); give either/or options their own self-contained `<<field>>`
(punctuation inside) so deleting one leaves a clean sentence. Fields must never
nest. Deletes are soft — every change is kept in history and can be restored by
the maintainer.

## Privacy

- **Nothing you type or copy is ever sent anywhere.** The page's only network
  request is *downloading* the shared template list when it opens.
- It stores **no patient data** — never put patient identifiers into a template.
- If the connection drops, the page keeps working from its last-synced copy of
  the templates.

## How it works (maintainer notes)

- `index.html` — the whole app, served by GitHub Pages. Templates baked into the
  file are only a fallback snapshot; the live list comes from the API.
- `worker/` — a Cloudflare Worker (`fm-templates-api`) with a D1 (SQLite)
  database: public `GET /templates`, passphrase-gated create/update/delete, an
  append-only `revisions` history, and soft deletes with `/restore`. Editors are
  rows in an `editors` table (hashed passphrases), so adding a second editor is
  one INSERT. Deploy with `npx wrangler deploy` from `worker/`.
- `templates.json` — nightly snapshot of the library committed by the
  [backup workflow](.github/workflows/backup.yml), so the data stays versioned
  in git even though edits happen in the database.

## Disclaimer

Templates are documentation scaffolding, not clinical guidance. Review every
note before signing; verify drugs, doses, and follow-up intervals against your
own judgment and local guidelines.
