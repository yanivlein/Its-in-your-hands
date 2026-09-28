# tools – building the site from the design

```bash
python3 tools/build.py            # regenerate docs/ from design/
python3 tools/build.py --check    # only report whether docs/ is out of date
```

Python 3.8 or newer, standard library only. The build is deterministic: the same `design/` gives the same `docs/`.

## What the build does

| Input | Output |
|---|---|
| `design/Main.dc.html` – the order of the sections and the page-level CSS | the order of sections in `docs/index.html` |
| `design/<Section>.dc.html` – each section's markup, CSS and logic | its HTML in `docs/index.html`, its CSS in `docs/assets/css/site.css` |
| the content constants in the section scripts (`CARDS`, `GATES`, `GLOW`, `PHOTO`, `TITLES`, `MSG`, `msg`) | data inside `docs/assets/js/site.js`, WhatsApp links in the HTML |
| `design/base.css`, `design/ds/livingbetter/tokens.css`, `tools/src/fonts.css`, `tools/src/extra.css` | the rest of `site.css` |
| `tools/src/site.js` | `docs/assets/js/site.js` (behaviour of every section, written to match each section's `DCLogic`) |
| `tools/src/pages/*` + `site.config.json` | `index.html` shell, `accessibility.html`, `privacy.html`, `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest` |

Conversion rules for the section templates:
- the first render of each section is written into the HTML (initial classes, `aria-*`, texts, the first Taste card);
  `context()` in `build.py` lists these initial values – a new `{{ hole }}` in the design fails the build until it is added there;
- `data-motion`, the board size style and `ref="{{ setRoot }}"` are removed; the root gets `data-sec` and `data-reveal`
  (the reveal observer's rootMargin and threshold, read from the section script);
- `ref="{{ setX }}"` becomes `data-ref="x"`, `onClick="{{ fn }}"` becomes `data-on-click="fn"` (same for the other events);
- every `data-in` starts at `0`; text holes get `data-bind` so `site.js` can update them;
- `/_blob/<id>` image references become files in `docs/assets/img/` through `tools/assets.json`;
- `.lb[data-motion="on"]` selectors become `html[data-motion="on"] .lb`.

## Images

`docs/assets/img/` holds the optimised images (the canvas originals re-encoded; hero, welcome and the logo are resized WebP,
the watercolour washes have softened edges). The build never touches them.
A new image in the design shows up as `/_blob/<id>`: add the file to `docs/assets/img/` and map the id in `tools/assets.json`,
otherwise the build stops and names the missing id.

## Updating from the canvas (for the Claude chat)

1. Read the changed files from the live canvas and copy them into `design/` unchanged.
2. Take `site.config.json` from the user's folder first – after the first publish it holds the live address,
   and building with the placeholder would put `SITE-URL` back into the site.
3. Run the build, check the result in a browser at 1440 and 390 px (and with reduced motion).
4. Add a CHANGELOG entry, then write the changed files into the user's folder.
