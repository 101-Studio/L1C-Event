"""Checks the built site. Run from the source folder:  python3 check_site.py

1. Every link, image, stylesheet, script and font resolves to a real file (and #anchors exist).
2. url() references inside the CSS resolve.
3. sitemap.xml lists every page.
4. Security lint: no inline scripts or event handlers, safe target="_blank", no http:// resources.
5. Secret scan: API keys, tokens, passwords and private keys in any text file of the project
   (site-standalone/ is skipped: it is a copy of site/ with large embedded font data).
Exit code 1 if anything is wrong.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
problems, notes = [], []
pages = sorted(SITE.rglob("*.html"))
ids = {p: set(re.findall(r'\bid="([^"]+)"', p.read_text(encoding="utf-8"))) for p in pages}
ATTR = re.compile(r'\b(href|src)="([^"]*)"')
n_links = 0

for p in pages:
    text = p.read_text(encoding="utf-8")
    rel = p.relative_to(SITE)
    for attr, url in ATTR.findall(text):
        if re.match(r"(?:[a-z][a-z0-9+.-]*:|//)", url, re.I):
            if url.startswith("http://"): problems.append(f"{rel}: insecure http:// address {url}")
            continue
        n_links += 1
        path, frag = re.match(r"([^?#]*)(?:\?[^#]*)?(?:#(.*))?", url).groups("")
        target = p if not path else (p.parent / path).resolve()
        if not target.exists(): problems.append(f"{rel}: missing file {url}"); continue
        if target.is_dir(): problems.append(f"{rel}: link points to a folder {url}"); continue
        if frag and target.suffix == ".html" and frag not in ids.get(target, set()):
            problems.append(f"{rel}: missing anchor #{frag} in {target.name}")
    if re.search(r"<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>", text): problems.append(f"{rel}: inline script")
    if re.search(r"\son(?:click|submit|load|error|mouse\w+)=", text): problems.append(f"{rel}: inline event handler")
    for tag in re.findall(r"<a\b[^>]*target=\"_blank\"[^>]*>", text):
        if "noopener" not in tag: problems.append(f"{rel}: target=_blank without rel=noopener")
    if 'style="' in text: notes.append(f"{rel}: inline style attribute")

for css in SITE.rglob("*.css"):
    for u in re.findall(r"url\(([^)]+)\)", css.read_text(encoding="utf-8")):
        u = u.strip("'\" ")
        if u.startswith(("data:", "http")): continue
        if not (css.parent / u.split("?")[0].split("#")[0]).resolve().exists(): problems.append(f"{css.name}: missing url({u})")

smap = (SITE / "sitemap.xml").read_text(encoding="utf-8")
for p in pages:
    rel = p.relative_to(SITE).as_posix()
    if rel == "404.html": continue
    slug = rel[:-10] if rel.endswith("/index.html") else ("" if rel == "index.html" else rel)
    if f"/{slug}</loc>" not in smap: problems.append(f"sitemap.xml: missing {rel}")

SECRET = re.compile(r"api[_-]?key|secret|passw(?:or)?d|bearer |private[_ -]?key|BEGIN (?:RSA|EC|OPENSSH)|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|xox[bp]-", re.I)
scanned = 0
for f in ROOT.rglob("*"):
    if f.is_file() and "site-standalone" not in f.parts and f.suffix in {".html", ".js", ".css", ".py", ".txt", ".xml", ".json", ".yml", ""} and f.name not in ("check_site.py", "README.txt") and "LICENSE" not in f.name:
        scanned += 1
        for i, line in enumerate(f.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
            if SECRET.search(line): problems.append(f"{f.relative_to(ROOT)}:{i}: possible secret: {line.strip()[:80]}")
hidden = [f.relative_to(ROOT).as_posix() for f in ROOT.rglob(".*") if f.is_file() and f.name not in (".nojekyll", ".gitignore")]
if hidden: problems.append(f"hidden files present: {hidden}")

print(f"{len(pages)} pages, {n_links} local links/assets checked, {scanned} files scanned for secrets")
for n in sorted(set(notes)): print("note:", n)
for pr in problems: print("PROBLEM:", pr)
print("OK, nothing broken" if not problems else f"{len(problems)} problem(s)")
sys.exit(1 if problems else 0)
