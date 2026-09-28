#!/usr/bin/env python3
"""Build the live site (docs/) from the design snapshot (design/).

    python3 tools/build.py            # build
    python3 tools/build.py --check    # build into a temp folder and report differences only

Standard library only (Python 3.8+). What it does:
  * reads the section files that the Claude Design canvas is made of (design/*.dc.html),
    in the order of the full-page board (design/Main.dc.html);
  * turns each section's template into plain HTML with the initial state filled in,
    event bindings kept as data-on-* attributes and refs as data-ref attributes;
  * collects the design CSS (tokens, base.css, every section) into assets/css/site.css;
  * injects the content constants of the section scripts (cards, gates, titles...)
    into assets/js/site.js, which re-implements the section behaviour without the
    design runtime;
  * writes index.html plus the companion pages from tools/src/pages/.
Images are not copied or resized here: they live in docs/assets/img/ and every canvas
image id must be listed in tools/assets.json.
"""
import hashlib
import html
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
DESIGN = ROOT / "design"
SRC = ROOT / "tools" / "src"
CONFIG = json.loads((ROOT / "site.config.json").read_text("utf-8"))
ASSETS = json.loads((ROOT / "tools" / "assets.json").read_text("utf-8"))["images"]

ABOVE_FOLD = {"Nav", "Hero"}          # images here load eagerly
EVENTS = {"Click": "click", "MouseEnter": "mouseenter", "MouseLeave": "mouseleave",
          "MouseMove": "mousemove", "Focus": "focus", "Blur": "blur", "KeyDown": "keydown"}


class BuildError(Exception):
    pass


# ---------------------------------------------------------------- reading the design

def read_dc(name):
    path = DESIGN / f"{name}.dc.html"
    s = path.read_text("utf-8")
    helmet = re.search(r"<helmet>(.*?)</helmet>", s, re.S)
    markup = re.search(r"</helmet>(.*?)</x-dc>", s, re.S)
    script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', s, re.S)
    if not (helmet and markup and script):
        raise BuildError(f"{path.name}: unexpected file structure")
    css = "\n".join(re.findall(r"<style>(.*?)</style>", helmet.group(1), re.S))
    return {"name": name, "css": css, "markup": markup.group(1).strip(), "script": script.group(1)}


def section_order():
    s = (DESIGN / "Main.dc.html").read_text("utf-8")
    main = re.search(r"<main>(.*?)</main>", s, re.S)
    if not main:
        raise BuildError("Main.dc.html: no <main>")
    names = re.findall(r'<dc-import name="(\w+)"', main.group(1))
    everything = re.findall(r'<dc-import name="(\w+)"', s)
    before = everything[:everything.index(names[0])]
    after = everything[everything.index(names[-1]) + 1:]
    page_css = "\n".join(re.findall(r"<style>(.*?)</style>", s, re.S))
    return before, names, after, page_css


def scan_literal(src, i):
    """Return the end index of the JS literal that starts at src[i]."""
    while src[i] in " \t\r\n":
        i += 1
    if src[i] in "'\"":
        q, j = src[i], i + 1
        while src[j] != q:
            j += 2 if src[j] == "\\" else 1
        return i, j + 1
    if src[i] not in "{[":
        raise BuildError("literal expected")
    depth, j = 0, i
    while True:
        c = src[j]
        if c in "'\"":
            q = c
            j += 1
            while src[j] != q:
                j += 2 if src[j] == "\\" else 1
        elif src.startswith("/*", j):
            j = src.index("*/", j) + 1
        elif c in "{[":
            depth += 1
        elif c in "}]":
            depth -= 1
            if depth == 0:
                return i, j + 1
        j += 1


ESC = {"n": "\n", "t": "\t", "\\": "\\", "'": "'", '"': '"'}


def js_to_py(src):
    """Tiny converter for the plain object/array/string/number literals used in the sections."""
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if c in "'\"":
            q, j, buf = c, i + 1, []
            while src[j] != q:
                if src[j] == "\\":
                    buf.append(ESC.get(src[j + 1], src[j + 1]))
                    j += 2
                else:
                    buf.append(src[j])
                    j += 1
            out.append(json.dumps("".join(buf), ensure_ascii=False))
            i = j + 1
        elif src.startswith("/*", i):
            i = src.index("*/", i) + 2
        elif src.startswith("//", i):
            i = src.index("\n", i)
        elif c.isalpha() or c in "_$" or c.isdigit() or (c == "." and src[i + 1].isdigit()):
            j = i
            while j < n and (src[j].isalnum() or src[j] in "_$."):
                j += 1
            word, k = src[i:j], j
            while k < n and src[k] in " \t\r\n":
                k += 1
            if k < n and src[k] == ":":
                out.append(json.dumps(word))
            elif word in ("true", "false", "null") or re.fullmatch(r"\d*\.?\d+", word):
                out.append(word if not word.startswith(".") else "0" + word)
            else:
                raise BuildError(f"not a plain literal: {word}")
            i = j
        else:
            out.append(c)
            i += 1
    text = re.sub(r",(\s*[}\]])", r"\1", "".join(out))
    return json.loads(text)


def js_const(script, name, required=True):
    m = re.search(r"\bconst\s+%s\s*=\s*" % re.escape(name), script)
    if not m:
        if required:
            raise BuildError(f"const {name} not found")
        return None
    a, b = scan_literal(script, m.end())
    return js_to_py(script[a:b])


# ---------------------------------------------------------------- helpers

def img_path(blob_id, prefix="assets/img/"):
    if blob_id not in ASSETS:
        raise BuildError(f"image /_blob/{blob_id} is not in tools/assets.json")
    f = ASSETS[blob_id]
    if not (ROOT / "docs" / "assets" / "img" / f).exists():
        raise BuildError(f"docs/assets/img/{f} is missing")
    return prefix + f


def map_blobs(text, prefix):
    return re.sub(r"/_blob/([0-9a-f]{32})", lambda m: img_path(m.group(1), prefix), text)


def map_blobs_deep(value):
    if isinstance(value, str):
        return map_blobs(value, "assets/img/")
    if isinstance(value, list):
        return [map_blobs_deep(v) for v in value]
    if isinstance(value, dict):
        return {k: map_blobs_deep(v) for k, v in value.items()}
    return value


def wa_link(script, msg):
    m = re.search(r"https://wa\.me/(\d+)\?text=", script)
    if not m:
        raise BuildError("WhatsApp number not found in the section script")
    return f"https://wa.me/{m.group(1)}?text=" + quote(msg, safe="-_.!~*'()")


def lookup(ctx, expr, where):
    cur = ctx
    for part in expr.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            raise BuildError(f"{where}: no initial value for {{{{ {expr} }}}} (add it to CONTEXT in tools/build.py)")
    return str(cur)


# ---------------------------------------------------------------- initial state per section
# Mirrors the first render of each section's DCLogic (what renderVals() returns on load).

def context(sec):
    name, script = sec["name"], sec["script"]
    ctx = {}
    msg = re.search(r"const msg = '((?:[^'\\]|\\.)*)'", script)
    if msg:
        ctx["waHref"] = wa_link(script, js_to_py("'" + msg.group(1) + "'"))
    if name == "Nav":
        ids = js_const(script, "ids")
        ctx.update(rootCls="is-fixed", c={i: "" for i in ids}, a={i: "false" for i in ids},
                   openStr="false", menuLabel="פתיחת התפריט")
    elif name == "Kit":
        glow = js_const(script, "GLOW")
        ctx.update({f"g{k}": {"card": "is-on" if k == 1 else "", "pressed": "true" if k == 1 else "false"} for k in range(1, 7)})
        ctx.update(glow=glow["1"], fanCls="is-intro")
    elif name == "Taste":
        gates, cards = js_const(script, "GATES"), js_const(script, "CARDS")
        c = cards[0]
        ctx.update(card={"n": c["n"], "t": c["t"], "x": c["x"], "q1": c["q"][0], "q2": c["q"][1], "q3": c["q"][2],
                         "face": c["face"], "back": c["back"]},
                   dots=[{"color": gates[str(k)]["band"], "cls": "is-on" if k == c["g"] else ""} for k in range(1, 7)],
                   cardLabel=f"קלף {c['n']}, {c['t']}, שער {gates[str(c['g'])]['name']}",
                   flipCls="", frontHidden="false", backHidden="true", flipLabel="הפכו את הקלף",
                   dealCls="", deckCls="", live="")
    elif name == "How":
        photo, titles = js_const(script, "PHOTO"), js_const(script, "TITLES")
        keys = re.findall(r"\{\{ ph\.(\w+) \}\}", sec["markup"])
        ctx.update(a={f"i{i}": "is-active" if i == 1 else "" for i in range(1, 10)},
                   cur="1", curTitle=titles[0], cntCls="",
                   ph={k: "is-on" if photo["1"] == k else "" for k in keys})
    elif name == "Pricing":
        msgs = js_const(script, "MSG")
        ctx["wa"] = {k: wa_link(script, v) for k, v in msgs.items()}
    elif name == "Faq":
        ctx.update({f"q{k}": {"cls": "is-open" if k == 1 else "", "exp": "true" if k == 1 else "false"} for k in range(1, 5)})
    return ctx


# ---------------------------------------------------------------- markup

def convert_markup(sec, ctx):
    name, m = sec["name"], sec["markup"]
    where = f"{name}.dc.html"

    # the section root: design-only attributes out, a hook for the script in
    m = m.replace(' data-motion="{{ motion }}"', "")
    m = re.sub(r' style="width: \{\{ rootW \}\}; height: \{\{ rootH \}\};"', "", m)
    reveal = re.search(r"rootMargin: '([^']*)', threshold: ([\d.]+)", sec["script"])
    hook = f' data-sec="{name}"'
    if reveal:
        hook += f' data-reveal="{reveal.group(1)}|{reveal.group(2)}"'
    if ' ref="{{ setRoot }}"' not in m:
        raise BuildError(f"{where}: root element has no ref")
    m = m.replace(' ref="{{ setRoot }}"', hook, 1)
    m = re.sub(r' ref="\{\{ set(\w+) \}\}"', lambda x: f' data-ref="{x.group(1)[0].lower() + x.group(1)[1:]}"', m)

    def event(x):
        ev = EVENTS.get(x.group(1))
        if not ev:
            raise BuildError(f"{where}: unsupported event on{x.group(1)}")
        return f' data-on-{ev}="{x.group(2)}"'
    m = re.sub(r' on([A-Z]\w*)="\{\{ (\w+) \}\}"', event, m)
    m = re.sub(r'data-in="\{\{ [\w.]+ \}\}"', 'data-in="0"', m)

    # photos that swap with the idea being read (How): remember each one's key
    m = re.sub(r'class="how-ph \{\{ ph\.(\w+) \}\}"', r'class="how-ph {{ ph.\1 }}" data-ph="\1"', m)

    # repeats
    def repeat(x):
        items = ctx.get(x.group(1))
        if not isinstance(items, list):
            raise BuildError(f"{where}: no list for sc-for {x.group(1)}")
        alias, body = x.group(2), x.group(3)
        return "".join(re.sub(r"\{\{ %s\.(\w+) \}\}" % alias,
                              lambda y: html.escape(str(item[y.group(1)]), quote=True), body) for item in items)
    m = re.sub(r'<sc-for list="\{\{ (\w+) \}\}" as="(\w+)"[^>]*>(.*?)</sc-for>', repeat, m, flags=re.S)

    # holes inside attribute values
    def attr(x):
        val = re.sub(r"\{\{ ([\w.]+) \}\}", lambda y: html.escape(lookup(ctx, y.group(1), where), quote=True), x.group(2))
        return f'{x.group(1)}="{val}"'
    m = re.sub(r'([\w:-]+)="([^"]*\{\{[^"]*)"', attr, m)

    # text holes: the element (or a span) gets data-bind so the script can update it
    m = re.sub(r"<(\w+)([^<>]*)>\{\{ ([\w.]+) \}\}</\1>",
               lambda x: f'<{x.group(1)}{x.group(2)} data-bind="{x.group(3)}">{html.escape(lookup(ctx, x.group(3), where), quote=False)}</{x.group(1)}>', m)
    m = re.sub(r"\{\{ ([\w.]+) \}\}",
               lambda x: f'<span data-bind="{x.group(1)}">{html.escape(lookup(ctx, x.group(1), where), quote=False)}</span>', m)
    if "{{" in m or "}}" in m:
        raise BuildError(f"{where}: template syntax left over")

    # images: real paths; below the fold load lazily; the hero ones first
    m = map_blobs(m, "assets/img/")

    def img(x):
        tag = x.group(0)
        if name in ABOVE_FOLD:
            if name == "Hero" and ('class="hero-lockup"' in tag or '/hero.webp"' in tag):
                tag = tag.replace("<img ", '<img fetchpriority="high" ', 1)
            return tag
        if " loading=" not in tag:
            tag = tag.replace("<img ", '<img loading="lazy" ', 1)
        if " decoding=" not in tag:
            tag = tag.replace("<img ", '<img decoding="async" ', 1)
        return tag
    m = re.sub(r"<img\b[^>]*>", img, m)

    # tidy class lists
    m = re.sub(r'class="([^"]*)"', lambda x: 'class="%s"' % " ".join(x.group(1).split()), m)
    m = m.replace(' class=""', "")

    # footer: the legal pages exist now
    if name == "Footer":
        m = m.replace('<a href="#">הצהרת נגישות</a>', '<a href="accessibility.html">הצהרת נגישות</a>')
        m = m.replace('<a href="#">מדיניות פרטיות</a>', '<a href="privacy.html">מדיניות פרטיות</a>')
    if 'href="#"' in m:
        raise BuildError(f'{where}: empty link (href="#") left')
    return m


# ---------------------------------------------------------------- css

def strip_comments(css):
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


def convert_css(css, where):
    css = re.sub(r"(^|\n)\s*body\{margin:0\}\s*", r"\1", css)
    css = css.replace('.lb[data-motion="on"]', 'html[data-motion="on"] .lb')
    if "data-motion" in css.replace('html[data-motion="on"] .lb', ""):
        raise BuildError(f"{where}: a data-motion selector the build does not know")
    css = map_blobs(css, "../img/")
    if css.count("{") != css.count("}"):
        raise BuildError(f"{where}: unbalanced braces")
    return css.strip()


# ---------------------------------------------------------------- script data

def script_data(secs):
    by = {s["name"]: s for s in secs}
    d = {}
    if "Kit" in by:
        d["kitGlow"] = js_const(by["Kit"]["script"], "GLOW")
    if "Taste" in by:
        d["tasteGates"] = js_const(by["Taste"]["script"], "GATES")
        d["tasteCards"] = map_blobs_deep(js_const(by["Taste"]["script"], "CARDS"))
    if "How" in by:
        d["howPhoto"] = js_const(by["How"]["script"], "PHOTO")
        d["howTitles"] = js_const(by["How"]["script"], "TITLES")
    return d


# ---------------------------------------------------------------- pages

def short_hash(data):
    return hashlib.sha1(data.encode("utf-8")).hexdigest()[:10]


def fill(template, values):
    def rep(x):
        k = x.group(1)
        if k not in values:
            raise BuildError(f"page template: unknown placeholder @{k}@")
        return values[k]
    return re.sub(r"@(\w+)@", rep, template)


def build(out):
    before, main_names, after, page_css = section_order()
    names = before + main_names + after
    secs = [read_dc(n) for n in names]
    for s in secs:
        s["html"] = convert_markup(s, context(s))

    # css
    parts = [(SRC / "fonts.css").read_text("utf-8"),
             "/* design tokens: design/ds/livingbetter/tokens.css */\n" + strip_comments((DESIGN / "ds/livingbetter/tokens.css").read_text("utf-8")).strip(),
             "/* design/base.css */\n" + convert_css(strip_comments((DESIGN / "base.css").read_text("utf-8")), "base.css"),
             "/* design/Main.dc.html */\n" + convert_css(page_css, "Main.dc.html")]
    for s in secs:
        parts.append(f"/* design/{s['name']}.dc.html */\n" + convert_css(s["css"], s["name"] + ".dc.html"))
    parts.append((SRC / "extra.css").read_text("utf-8"))
    css = "\n\n".join(p.strip() for p in parts) + "\n"
    css = re.sub(r"\n{3,}", "\n\n", css)

    # js
    js_src = (SRC / "site.js").read_text("utf-8")
    if "/*@DATA@*/" not in js_src:
        raise BuildError("tools/src/site.js: /*@DATA@*/ marker missing")
    js = js_src.replace("/*@DATA@*/{}", json.dumps(script_data(secs), ensure_ascii=False, separators=(",", ":")))

    # price for the structured data comes from the pricing section itself
    price = None
    pr = next((s for s in secs if s["name"] == "Pricing"), None)
    if pr:
        mm = re.search(r"במחיר (\d+) ₪", js_const(pr["script"], "MSG").get("kit", ""))
        price = mm.group(1) if mm else None

    site_url = CONFIG["siteUrl"]
    if not site_url.endswith("/"):
        raise BuildError("site.config.json: siteUrl must end with /")
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "name": CONFIG["shortTitle"], "url": site_url, "inLanguage": "he-IL"},
        {"@type": "Product", "name": "לחיות טוב יותר – זה בידיים שלך", "description": CONFIG["description"],
         "image": site_url + CONFIG["ogImage"], "brand": {"@type": "Brand", "name": "זה בידיים שלך"},
         "manufacturer": {"@type": "Person", "name": CONFIG["owner"]}}]}
    if price:
        ld["@graph"][1]["offers"] = {"@type": "Offer", "price": price, "priceCurrency": CONFIG["currency"],
                                     "availability": "https://schema.org/InStock", "url": site_url + "#pricing"}

    values = {
        "SITE_URL": site_url, "TITLE": html.escape(CONFIG["title"]), "DESCRIPTION": html.escape(CONFIG["description"], quote=True),
        "OG_IMAGE": site_url + CONFIG["ogImage"], "OG_IMAGE_ALT": html.escape(CONFIG["ogImageAlt"], quote=True),
        "THEME_COLOR": CONFIG["themeColor"], "SHORT_TITLE": html.escape(CONFIG["shortTitle"]),
        "OWNER": html.escape(CONFIG["owner"]), "PHONE": CONFIG["phoneDisplay"], "EMAIL": CONFIG["email"],
        "UPDATED": html.escape(CONFIG["updated"]), "CSS_V": short_hash(css), "JS_V": short_hash(js),
        "JSON_LD": json.dumps(ld, ensure_ascii=False, indent=1).replace("</", "<\\/"),
        "NAV": "\n".join(s["html"] for s in secs if s["name"] in before),
        "MAIN": "\n".join(s["html"] for s in secs if s["name"] in main_names),
        "FOOTER": "\n".join(s["html"] for s in secs if s["name"] in after),
        "WA_HREF": context(next(s for s in secs if s["name"] == "Footer"))["waHref"] if "Footer" in names else "",
    }

    (out / "assets/css").mkdir(parents=True, exist_ok=True)
    (out / "assets/js").mkdir(parents=True, exist_ok=True)
    write(out / "assets/css/site.css", css)
    write(out / "assets/js/site.js", js)
    for tpl in sorted((SRC / "pages").iterdir()):
        write(out / tpl.name, fill(tpl.read_text("utf-8"), values))
    return names


def write(path, text):
    # always LF, whatever the operating system, so a build on Windows gives the same files
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def main():
    check = "--check" in sys.argv
    docs = ROOT / "docs"
    try:
        if check:
            with tempfile.TemporaryDirectory() as tmp:
                out = Path(tmp)
                build(out)
                changed = [p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()
                           and (not (docs / p.relative_to(out)).exists() or (docs / p.relative_to(out)).read_bytes() != p.read_bytes())]
                print("up to date" if not changed else "would change: " + ", ".join(changed))
        else:
            names = build(docs)
            print("built docs/ from " + ", ".join(names))
    except BuildError as e:
        print("build failed: " + str(e), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
