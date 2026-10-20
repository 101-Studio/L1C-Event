"""L1C website generator.  Run from this folder:  python3 build.py

Reads the settings and data, fills the templates and writes the finished pages into ../site/.
Files in site/assets/ are never touched; every .html file in site/ is regenerated.
"""
import shutil
import render
from pages import home, services, about, process, events, blog, contact, start, reserve, legal

site = render.SITE_DIR
for asset in ("chatbot.css", "chatbot.js"):
    shutil.copy2(render.BASE / asset, site / "assets" / asset)
for old in site.glob("*.html"): old.unlink()
for folder in ("events", "blog", "legal"): shutil.rmtree(site / folder, ignore_errors=True)

for module in (home, services, about, process, events, blog, contact, start, reserve, legal):
    module.build()
render.finish()
print(f"Built {len(render.PAGES)} pages into {site}")
