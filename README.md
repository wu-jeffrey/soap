# SOAP Quick Paste

A single-file template picker for family medicine charting. 158 templates — common presentations
as brief SOAP notes, exam blocks, procedure notes, letters, and patient emails —
type a couple of letters, press Enter, and the note is on your
clipboard, ready to paste into PSS with tabbable `<<fields>>` for the blanks.

**Use it here: https://tinyurl.com/soapqp** (easy to remember and dictate)

That short link redirects to the permanent home, https://wu-jeffrey.github.io/soap/ —
bookmark whichever you like; if the short link ever stops working or is blocked by
clinic filters, the permanent one always works.

## Setup (once, ~1 minute per room)

1. Open the link above on each exam-room computer.
2. Bookmark it (or set it as a pinned tab) so it sits next to the EMR tab all day.

No install, no account, no login. The page is static — after it loads it makes
no further network requests, so it keeps working even if the connection drops
mid-clinic. Offline fallback: `File → Save Page As…` gives you a local copy
([index.html](index.html)) that works with no internet at all.

## Daily use

1. Click the Quick Paste tab (or `Cmd/Ctrl+Tab` to it).
2. Just start typing — the search box is always live: `uti`, `knee`, `pap`, `cold`…
   Lay terms and abbreviations work too ("pink eye", "strep", "BP").
3. Press **Enter** — the top match is copied.
4. Switch to PSS and paste. Everything in brackets (guillemets `« »` by default —
   PSS's native field markers) is a fill-in field — press **Tab** in PSS to jump
   through them: **type** to fill in a blank, or **delete** an option you're not
   using. Alternatives (like drug choices) are separate self-contained fields, so
   one delete removes the whole option cleanly.

Keyboard: type anywhere to search · `↑`/`↓` select · `Enter` copy · `Esc` clear.
Templates you use most float to the top of the list.

Top-right buttons: **bracket style** (guillemets `« »` default, or `<< >>`,
`[ ]`, `( )`, or any custom pair — match whatever your PSS actually accepts) and
a **light/dark theme** toggle. Both choices are remembered per browser.

## Customizing

Templates live in [index.html](index.html) — one deployed source of truth, so a
change shows up in every exam room within minutes of a push. To reword a
template, add one, or turn a tabbable field into your standard plain text
(your go-to drug, your usual follow-up), tell the maintainer what you want and
it gets baked in for everyone. Conventions: wrap anything tabbable in
`<<...>>`; give either/or options their own self-contained `<<field>>` (with
punctuation inside) so deleting one leaves a clean sentence.

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
