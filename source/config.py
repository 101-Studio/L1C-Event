"""Site-wide settings. Change the domain, email and phone here, then run build.py."""
SITE = "https://www.l1c.example"   # the real domain, without a trailing slash
EMAIL = "info@l1c.example"         # public contact email
PHONES = ["+44 20 0000 0000"]      # public phone number(s)
LOCATION = "London, United Kingdom"

# Photos. A name from IM can be used in data/events.py, data/posts.py and data/content.py.
# To use your own photo, put the file in site/assets/ and write "assets/your-file.jpg" instead of a web address.
U = lambda i: f"https://images.unsplash.com/photo-{i}?auto=format&fit=crop&w=1600&q=75"
IM = dict(hero=U("1511795409834-ef04bbd61622"), team=U("1556761175-5973dc0f32e7"), net=U("1511578314322-379afb476865"),
          conf=U("1505373877841-8d25f7d46678"), conf2=U("1540575467063-178a50c2df87"), dinner=U("1519167758481-83f550bb49b3"),
          dine2=U("1414235077428-338989a2e8c0"), cons=U("1486406146926-c627a92ad1ab"), off=U("1477959858617-67f85cf4f1df"),
          lights=U("1492684223066-81342ee5ff30"), nyc=U("1480714378408-67cf0d13bc1b"), lon=U("1513635269975-59663e0ac1ad"),
          dxb=U("1512453979798-5ea266f8880c"), par=U("1502602898657-3e91760cbb34"))

# Main menu: (page name, label)
NAV = [("index", "Home"), ("services", "Services"), ("about", "About"), ("process", "Process"), ("events", "Events"), ("blog", "Blog"), ("contact", "Contact")]

# Where each page is written inside site/. Pages not listed here are written as <name>.html
ROUTES = {"events": "events/index.html", "blog": "blog/index.html", "reserve": "events/reserve.html",
          "privacy": "legal/privacy.html", "cookies": "legal/cookies.html", "terms": "legal/terms.html"}

NH = 38; NW = round(NH * 188 / 76)   # logo size in the header (the width follows the image ratio)

ORG = {"@context": "https://schema.org", "@type": "Organization", "name": "Level One Connect", "alternateName": "L1C", "url": SITE,
       "logo": f"{SITE}/assets/logo.png", "description": "Premium corporate event management and executive networking company.",
       "address": {"@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB"}, "telephone": PHONES[0], "email": EMAIL}
