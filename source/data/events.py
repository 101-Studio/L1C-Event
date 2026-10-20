"""Events. Add one block per event; the page is generated from templates/event.html.

s   page address, lowercase with hyphens, unique  ->  events/<s>.html
t   title                      c   category label
d   date YYYY-MM-DD            tm  time
l   location                   st  "upcoming", "featured" or "past"
i   photo: a name from IM (config.py) or "assets/file.jpg"
ds  short description
Optional: sp=[speakers], ag=[(time, session)], gal=[3 photos], reg="link for the Reserve a Seat button"
"""
from config import IM

EVENTS = [
 dict(s="executive-leaders-dinner", t="Executive Leaders Dinner", c="Leadership Dinners", d="2026-11-12", tm="19:00", l="London, UK", st="upcoming", i=IM["dinner"], ds="An invitation-only dinner where senior leaders exchange ideas in an intimate setting."),
 dict(s="technology-leadership-summit", t="Technology Leadership Summit", c="Business Summits", d="2027-02-18", tm="09:00", l="London, UK", st="featured", i=IM["conf"], ds="A one-day summit for technology and business decision-makers on strategy and growth."),
 dict(s="executive-networking-evening", t="Executive Networking Evening", c="Executive Networking", d="2027-04-22", tm="18:30", l="Paris, France", st="upcoming", i=IM["net"], ds="A curated evening connecting decision-makers across industries."),
 dict(s="leaders-roundtable-series", t="Leaders Roundtable Series", c="Leadership Dinners", d="2026-12-03", tm="19:00", l="London, UK", st="upcoming", i=IM["dine2"], ds="A small-group roundtable dinner for senior leaders to discuss the decisions shaping their industries."),
 dict(s="cx-ai-executive-forum", t="CX and AI Executive Forum", c="Technology Events", d="2027-03-10", tm="10:00", l="Munich, Germany", st="upcoming", i=IM["cons"], ds="An executive forum on customer experience and AI, for technology and CX decision-makers."),
 dict(s="annual-business-conference", t="Annual Business Conference", c="Conferences", d="2027-05-14", tm="09:30", l="London, UK", st="featured", i=IM["conf2"], ds="A full-day conference bringing together business leaders, partners and sponsors."),
 dict(s="product-launch-evening", t="Product Launch Evening", c="Product Launches", d="2027-06-04", tm="18:00", l="London, UK", st="upcoming", i=IM["lights"], ds="An evening launch experience for invited partners, press and clients."),
 dict(s="executive-dinner-series-2025", t="Executive Dinner Series 2025", c="Leadership Dinners", d="2025-05-15", tm="19:30", l="London, UK", st="past", i=IM["dine2"], ds="A dinner series that brought senior leaders together for candid conversations."),
 dict(s="technology-leaders-meetup", t="Technology Leaders Meetup", c="Technology Events", d="2025-03-20", tm="17:30", l="Dublin, Ireland", st="past", i=IM["off"], ds="A meetup for technology leaders and their partners."),
 dict(s="product-showcase-2025", t="Product Showcase", c="Product Launches", d="2025-10-09", tm="17:00", l="London, UK", st="past", i=IM["lights"], ds="A showcase bringing partners and press together for a product reveal."),
]
