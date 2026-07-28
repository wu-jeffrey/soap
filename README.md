# SOAP Quick Paste

A single-file template picker for family medicine charting. 50 common presentations
as brief SOAP notes — type a couple of letters, press Enter, and the note is on your
clipboard, ready to paste into PSS with tabbable `<<fields>>` for the blanks.

## Setup (once, ~1 minute)

1. Save `soap-quick-paste.html` anywhere on your computer (Desktop or Documents is fine).
2. Double-click it — it opens in your browser as a normal page.
3. Bookmark it and/or pin the tab so it sits next to your EMR tab all day.

That's it. No install, no account, no server.

## Daily use

1. Click the Quick Paste tab (or `Cmd/Ctrl+Tab` to it).
2. Just start typing — the search box is always live: `uti`, `knee`, `pap`, `cold`…
   Lay terms and abbreviations work too ("pink eye", "strep", "BP").
3. Press **Enter** — the top match is copied.
4. Switch to PSS and paste. Everything in `<<double angle brackets>>` is a PSS
   field — use the PSS hotkey to jump through them: **type** to fill in a blank,
   or **delete** an option you're not using. Alternatives (like drug choices) are
   separate self-contained fields, so one delete removes the whole option cleanly.

Keyboard: type anywhere to search · `↑`/`↓` select · `Enter` copy · `Esc` clear.
Templates you use most float to the top of the list.

## Customizing

- **Fields are for what changes per patient.** If something is your *standard*
  (your go-to drug, your usual follow-up interval), don't tab past it forever —
  **Edit** the template once and make it plain text. Make the wording yours; the
  doses and follow-ups in the defaults are generic starting points, not
  recommendations.
- When editing, wrap anything you want tabbable in `<<...>>`. Give either/or
  options their own `<<field>>` each, with punctuation inside, so deleting one
  leaves a clean sentence.
- **+ New template** adds your own. Add good search keywords so it's findable.
- Edits are saved **only in that browser** (localStorage). Use **Export** to
  download a JSON backup, and **Import** to restore it on another computer or
  after a browser cleanup. Export after any big editing session.
- If a template ever shows old `[square bracket]` blanks after an update, click
  **Reset to default** on it — you're seeing a saved edit from an older version.

## Privacy

- The page makes **no network requests** — nothing is sent anywhere, ever.
  You can verify: it works with Wi-Fi turned off.
- It stores **no patient data**. The only thing it touches is your clipboard,
  and only when you press copy.
- Keep it that way: never put patient identifiers into a template.
- The file itself contains only generic templates, so emailing it to yourself
  or carrying it on a USB stick is fine.

## Disclaimer

Templates are documentation scaffolding, not clinical guidance. Review every
note before signing; verify drugs, doses, and follow-up intervals against your
own judgment and local guidelines.
