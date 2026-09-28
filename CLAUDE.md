# CLAUDE.md – instructions for Claude Code

> בעברית, בקצרה: זו תיקיית האתר של ערכת הקלפים "לחיות טוב יותר – זה בידיים שלך" של רונית ליין.
> התפקיד של Claude Code כאן הוא לפרסם את האתר ב־GitHub Pages ולדחוף עדכונים – לא לעצב אותו מחדש.

## What this repository is

A finished, static one-page website (Hebrew, right-to-left) that sells Ronit Lein's card kit through WhatsApp.
It was designed in Claude Design (a canvas in the Claude app) and converted to plain HTML/CSS/JS.

- `docs/` – **the live site**. GitHub Pages serves this folder as is. There is no build step on GitHub.
- `design/` – a snapshot of the design canvas files the site is generated from (`*.dc.html`, `base.css`, tokens).
- `tools/build.py` – regenerates `docs/` from `design/` (Python 3.8+, standard library only). See `tools/README.md`.
- `site.config.json` – site URL, title, description, contact details used by the build.
- `CHANGELOG.md` – every update, newest first. Read the top entry before pushing an update.

## Ground rules

1. **Do not change the design, texts, prices or behaviour unless the user explicitly asks you to.**
   Normally changes are made in the Claude chat (on the design canvas) and arrive here as an updated folder;
   your job is to review, commit, push and verify.
2. If the user does ask you for a direct change, keep it minimal, and add a line under
   "Direct edits" in the top entry of `CHANGELOG.md` saying exactly what you changed and in which file,
   so the change can be carried back into the design canvas. Tell the user you did this.
3. Never add analytics, tracking pixels, cookies, forms, chat widgets or third-party scripts.
   The privacy policy (`docs/privacy.html`) promises there are none. If the user wants one, update the policy too and tell them.
4. The site has no secrets and needs none. Never commit tokens or credentials.
5. `docs/assets/js/site.js`, `docs/assets/css/site.css` and `docs/index.html` are generated. Prefer editing
   `design/` or `tools/src/` and running `python3 tools/build.py`. If Python isn't available, a small direct edit
   in `docs/` is acceptable – but log it (rule 2), because the next build from the chat would overwrite it.
6. Keep the WhatsApp number (972507428319) and the prepared messages exactly as they are.

## First publish – GitHub Pages

Ask the user before anything that creates something on their account (the repository, its name and its visibility).

1. **Tools.** Check `git --version` and `gh --version`, then `gh auth status`.
   If `gh` is missing or not logged in, help the user install it (https://cli.github.com) and run `gh auth login`
   themselves. Do not ask for or handle their password or tokens.
2. **Repository.** Suggest the name `ronit-cards` (the user may choose another).
   GitHub Pages on a free account requires a **public** repository – say so and get a yes.
   The repository contains only the site and its design files; nothing private.
   ```bash
   git init -b main            # skip if .git already exists
   git add -A
   git commit -m "Ronit cards site – first version"
   gh repo create <name> --public --source=. --remote=origin --push
   ```
3. **Turn on Pages** from branch `main`, folder `/docs`:
   ```bash
   gh api -X POST "repos/{owner}/{repo}/pages" -f "source[branch]=main" -f "source[path]=/docs"
   ```
   (If it already exists, use `-X PUT` with the same fields.)
4. **Find the address:** `gh api "repos/{owner}/{repo}/pages" --jq .html_url`
   → usually `https://<owner>.github.io/<repo>/`.
5. **Put the real address in the site** (it must end with `/`). Replace every `https://SITE-URL/` with it in:
   `site.config.json`, `docs/index.html`, `docs/accessibility.html`, `docs/privacy.html`, `docs/404.html`,
   `docs/robots.txt`, `docs/sitemap.xml`.
   Then `grep -rn "SITE-URL" docs site.config.json` must print nothing.
   Commit ("Set the site address") and push.
6. **Wait for the deploy:** `gh api "repos/{owner}/{repo}/pages/builds/latest" --jq .status` until it is `built`
   (usually 1–2 minutes).
7. **Verify** with `curl -sI` that these return 200: the home page, `assets/css/site.css`, `assets/js/site.js`,
   `assets/img/og-image.jpg`, `accessibility.html`, `privacy.html`; and that a made-up path returns the 404 page.
   Open the home page HTML and confirm the canonical and `og:image` tags show the real address.
8. **Report** the live address to the user, and suggest they send the link to themselves on WhatsApp to see the preview card.

## Custom domain (only when the user asks)

1. Create `docs/CNAME` containing just the domain (for example `cards.example.co.il`), commit and push.
2. DNS at the domain registrar: for a subdomain, a `CNAME` record to `<owner>.github.io`; for a root domain,
   `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   The user does this in their registrar's panel – explain the exact records, don't ask for their login.
3. `gh api -X PUT "repos/{owner}/{repo}/pages" -f cname=<domain>`; once the certificate is ready,
   `gh api -X PUT "repos/{owner}/{repo}/pages" -F https_enforced=true`.
4. Replace the old address with `https://<domain>/` everywhere listed in step 5 above (including `site.config.json`), commit, push, verify.

## Publishing an update from the chat

When the user says the folder was updated from the Claude chat:

1. `git status` and `git diff --stat` – see what changed. Read the top entry of `CHANGELOG.md`.
2. Make sure the live address survived: `grep -rn "SITE-URL" docs site.config.json` prints nothing.
   If it's back, put the real address back (step 5 of the first publish) and tell the user.
3. If Python is available: `python3 tools/build.py --check` should print `up to date`
   (it means `docs/` really matches `design/`). If it lists files, tell the user rather than guessing.
4. Commit with the CHANGELOG entry's title as the message, push, wait for the deploy, verify as in step 7, report.

## How the site works (for orientation)

- `docs/index.html` holds all sections in order: Nav, Hero, Welcome, Approach, Kit, Inside, Taste, Who, About,
  Voices, How, Workshops, Products, Pricing, Faq, Footer. Each section root carries `data-sec="<Name>"`.
- Scroll reveal: `<html data-motion="on">` (set by a tiny script in `<head>`) hides blocks with `data-in="0"`
  until `site.js` flips them to `1` as they enter the screen. With "reduce motion", without JavaScript,
  or if `site.js` fails to load within 4 seconds, everything is simply shown.
- Event bindings from the design are kept as `data-on-click="draw"` etc.; `site.js` wires them per section.
- Images: `docs/assets/img/`. Fonts are self-hosted in `docs/assets/fonts/` (SIL Open Font License, files included).
- Companion pages: `accessibility.html` (accessibility statement), `privacy.html`, `404.html`.
