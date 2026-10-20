"""Reusable HTML pieces: section headings, cards, form fields."""
from util import *
from config import *
from data.content import STATS

def hero(h, sub, im, eyebrow=""):
    return f'<section class="ph"><div class="wrap"><p class="eb">{eyebrow}</p><h1>{h}</h1><p class="lead">{sub}</p></div></section>'
def head(t, s="", c=""):
    return f'<div class="sh rv {c}"><h2>{t}</h2>{f"<p>{s}</p>" if s else ""}</div>'
def scard(i, s):
    return f'<article class="card rv"><span class="n">0{i + 1}</span><h3>{s[0]}</h3><p>{s[1]}</p><a class="lk" href="services.html">{s[2]} →</a></article>'
def stats():
    return '<section class="dark"><div class="wrap sg">' + "".join(f'<div class="rv"><b data-n="{n}" data-s="{s}">{n}{s}</b><span>{l}</span></div>' for n, s, l in STATS) + '</div></section>'
def ecard(v):
    return f'<article class="card ev rv"><a href="event-{v["s"]}.html" class="im"><img src="{v["i"]}" alt="{e(v["t"])}" loading="lazy" width="800" height="500"></a><div class="cb"><span class="tag">{v["c"]}</span><h3><a href="event-{v["s"]}.html">{v["t"]}</a></h3><p class="mut">{fd(v["d"])} · {v["tm"]} · {v["l"]}</p><p>{v["ds"]}</p><a class="lk" href="event-{v["s"]}.html">View Event →</a></div></article>'
def dq(v):
    d = __import__("datetime").date.fromisoformat(v["d"])
    return e(" ".join([v["t"], v["c"], v["l"], d.strftime("%d %B %Y %b")]).lower())
def erow(v):
    return f'<article class="card ec rv" data-q="{dq(v)}"><a class="eth" href="event-{v["s"]}.html" tabindex="-1" aria-hidden="true"><img src="{v["i"]}" alt="" loading="lazy" width="400" height="225"></a><div class="ecb"><span class="tag">{v["c"]}</span><h3><a href="event-{v["s"]}.html">{v["t"]}</a></h3><p>{fd(v["d"])} · {v["tm"]} · {v["l"]}</p><a class="btn sm ghost dk" href="event-{v["s"]}.html">View Event</a></div></article>'
def bcard(p):
    return f'<article class="card ev rv"><a href="blog-{p["s"]}.html" class="im"><img src="{p["i"]}" alt="{e(p["t"])}" loading="lazy" width="800" height="500"></a><div class="cb"><span class="tag">{p["c"]}</span><p class="mut">{fd(p["d"])} · {p["r"]} min read</p><h3><a href="blog-{p["s"]}.html">{p["t"]}</a></h3><p>{p["ex"]}</p><a class="lk" href="blog-{p["s"]}.html">Read Article →</a></div></article>'
def cta():
    return f'<section class="dark cta"><div class="wrap rv"><h2>Let\'s Create Something Exceptional Together</h2><p class="lead">Whether you\'re planning a conference, executive networking event, or corporate gathering, our team is ready to help you create an unforgettable experience that delivers real business value.</p><div class="row">{CTA("start-your-event.html", "Start Your Event Journey")}{CTA("contact.html#form", "Contact Our Team", "btn ghost")}</div></div></section>'

HP = '<div class="hp" aria-hidden="true"><label>Leave empty<input name="website" tabindex="-1" autocomplete="off"></label></div>'
CONSENT = '<div class="f"><label class="cb1"><input type="checkbox" id="consent" name="consent" required><span>I agree to be contacted about this request. See our <a href="privacy.html">Privacy Policy</a>.</span></label><small class="err"></small></div>'
def fld(i, l, t="text", req=False, opts=None, ph="", pl="", mx=150, ac="", rows=5):
    r, st = (" required", " *") if req else ("", "")
    a = f' autocomplete="{ac}"' if ac else ""
    p = f' placeholder="{e(pl)}"' if pl else ""
    if t == "select":
        c = f'<select id="{i}" name="{i}"{r}><option value="">{ph or "Select"}</option>' + "".join(f"<option>{x}</option>" for x in opts) + "</select>"
    elif t == "area":
        c = f'<textarea id="{i}" name="{i}" rows="{rows}"{r}{p} maxlength="2000"></textarea>'
    else:
        c = f'<input id="{i}" name="{i}" type="{t}"{r}{p} maxlength="{mx}"{a}>'
    return f'<div class="f"><label for="{i}">{l}{st}</label>{c}<small class="err"></small></div>'
two = lambda *x: '<div class="two">' + "".join(x) + "</div>"
def chk(name, label, opts):
    return f'<fieldset class="chk" data-name="{name}"><legend>{label}</legend><div class="cg">' + "".join(f'<label><input type="checkbox" value="{x}"> {x}</label>' for x in opts) + "</div></fieldset>"
sub = lambda n, t, *x: f'<div class="fs"><h2 class="fh"><b>{n}</b>{t}</h2>' + "".join(x) + "</div>"
def form():
    op = lambda l: "".join(f"<option>{x}</option>" for x in l)
    return f'''<form id="cf" novalidate class="form" data-subject="Event enquiry" aria-label="Contact form"><div class="hp" aria-hidden="true"><label>Leave empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
<div class="two"><div class="f"><label for="name">Full Name *</label><input id="name" name="name" required maxlength="100" autocomplete="name"><small class="err"></small></div><div class="f"><label for="company">Company *</label><input id="company" name="company" required maxlength="120" autocomplete="organization"><small class="err"></small></div></div>
<div class="two"><div class="f"><label for="email">Email Address *</label><input id="email" name="email" type="email" required maxlength="150" autocomplete="email"><small class="err"></small></div><div class="f"><label for="phone">Phone Number</label><input id="phone" name="phone" type="tel" maxlength="30" autocomplete="tel"><small class="err"></small></div></div>
<div class="two"><div class="f"><label for="type">Event Type *</label><select id="type" name="type" required><option value="">Select event type</option>{op(["Conference / Summit", "Executive Networking", "Product Launch", "Gala Dinner / Awards", "Team Building", "Corporate Training", "Other"])}</select><small class="err"></small></div>
<div class="f"><label for="size">Estimated Attendees *</label><select id="size" name="size" required><option value="">Select attendees</option>{op(["10–50", "50–100", "100–200", "200–500", "500+"])}</select><small class="err"></small></div></div>
<div class="f"><label for="msg">Tell us about your event *</label><textarea id="msg" name="msg" rows="5" required maxlength="2000"></textarea><small class="err"></small></div>
<button class="btn" type="submit"><span>Send Message</span></button><p class="st" role="status" aria-live="polite"></p></form>'''

def tile(v, big=False):
    return f'<a class="tile rv{" big" if big else ""}" href="event-{v["s"]}.html"><img src="{v["i"]}" alt="{e(v["t"])}" loading="lazy" width="900" height="600"><div class="tc"><span class="tag2">{v["c"]}</span><h3>{v["t"]}</h3><p>{fd(v["d"])} · {v["l"]}</p></div><span class="go" aria-hidden="true">↗</span></a>'
def pmeta(p):
    return f'{p["c"]} · {fd(p["d"])} · {p["r"]} min read'
def pit(p):
    return f'<a class="it" href="blog-{p["s"]}.html"><img src="{p["i"]}" alt="{e(p["t"])}" loading="lazy" width="300" height="300"><div><span class="cat">{pmeta(p)}</span><h3>{p["t"]}</h3></div></a>'
