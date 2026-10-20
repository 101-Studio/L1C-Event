/* L1C site behaviour: menu, theme toggle, animations, forms, events search, carousel, cursor glow. */
(function () {
  var d = document,
    rm = matchMedia("(prefers-reduced-motion:reduce)").matches,
    h = d.getElementById("hd"),
    mb = d.getElementById("mb"),
    m = d.getElementById("menu");
  function sc() {
    h.classList.toggle("sc", scrollY > 30);
  }
  sc();
  addEventListener("scroll", sc, { passive: true });
  mb.onclick = function () {
    var o = m.classList.toggle("open");
    mb.setAttribute("aria-expanded", o);
    d.body.style.overflow = o ? "hidden" : "";
  };
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && m.classList.contains("open")) mb.click();
  });
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) {
          x.target.classList.add("in");
          io.unobserve(x.target);
          var b =
            x.target.querySelector("[data-n]") ||
            (x.target.dataset.n ? x.target : null);
          if (b && !rm) cnt(b);
        }
      });
    },
    { threshold: 0.15 },
  );
  d.querySelectorAll(".rv").forEach(function (e) {
    io.observe(e);
  });
  function cnt(b) {
    var n = +b.dataset.n,
      s = b.dataset.s,
      t = 0;
    (function f() {
      t += n / 50;
      if (t >= n) {
        b.textContent = n + s;
        return;
      }
      b.textContent = Math.floor(t) + s;
      requestAnimationFrame(f);
    })();
  }
  var hb = d.querySelector(".hero");
  if (hb && !rm)
    addEventListener(
      "scroll",
      function () {
        hb.style.backgroundPositionY = "calc(50% + " + scrollY * 0.25 + "px)";
      },
      { passive: true },
    );
  d.querySelectorAll(".steps button").forEach(function (b) {
    b.onclick = function () {
      d.querySelectorAll(".steps button").forEach(function (x) {
        x.classList.remove("on");
        x.setAttribute("aria-selected", "false");
      });
      d.querySelectorAll(".sp").forEach(function (x) {
        x.classList.remove("on");
      });
      b.classList.add("on");
      b.setAttribute("aria-selected", "true");
      d.querySelectorAll(".sp")[b.dataset.i].classList.add("on");
    };
  });
  /* forms: validation, spam protection, sending */
  d.querySelectorAll("form.form").forEach(function (f) {
    var t0 = Date.now(),
      st = f.querySelector(".st"),
      label = f.dataset.btn || "Send Message";
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      st.textContent = "";
      var ok = true,
        data = {};
      f.querySelectorAll(".f").forEach(function (w) {
        var i = w.querySelector("input,select,textarea"),
          v =
            i.type === "checkbox"
              ? i.checked
                ? "Yes"
                : ""
              : i.value.replace(/[\u0000-\u001f<>]/g, " ").trim(),
          er = "";
        if (i.required && !v) er = "This field is required.";
        else if (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
          er = "Enter a valid email address.";
        else if (i.type === "tel" && v && !/^[+\d\s()-]{6,30}$/.test(v))
          er = "Enter a valid phone number.";
        w.classList.toggle("bad", !!er);
        w.querySelector(".err").textContent = er;
        i.setAttribute("aria-invalid", !!er);
        if (er && ok) {
          ok = false;
          i.focus();
        }
        data[i.name] = v;
      });
      if (!ok) return;
      f.querySelectorAll("fieldset.chk").forEach(function (g) {
        data[g.dataset.name] = [].slice
          .call(g.querySelectorAll("input:checked"))
          .map(function (x) {
            return x.value;
          })
          .join(", ");
      });
      var okMsg =
        f.dataset.ok ||
        "Thank you! Your message has been sent. We'll reply shortly.";
      if (f.website.value || Date.now() - t0 < 2500) {
        st.textContent = okMsg;
        f.reset();
        return;
      }
      var b = f.querySelector("button[type=submit]");
      b.disabled = true;
      b.querySelector("span").textContent = "Sending…";
      function done(s, msg) {
        b.disabled = false;
        b.querySelector("span").textContent = label;
        st.textContent = msg;
        if (s) f.reset();
      }
      if (window.L1C_ENDPOINT) {
        fetch(window.L1C_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(function (r) {
            if (!r.ok) throw 0;
            done(1, okMsg);
          })
          .catch(function () {
            done(
              0,
              "Something went wrong. Please email us directly at " +
                d.body.dataset.email +
                ".",
            );
          });
      } else {
        var body = Object.keys(data)
          .map(function (k) {
            return k + ": " + data[k];
          })
          .join("\n");
        location.href =
          "mailto:" +
          d.body.dataset.email +
          "?subject=" +
          encodeURIComponent(
            (f.dataset.subject || "Event enquiry") +
              " from " +
              data.name +
              (data.event ? " - " + data.event : ""),
          ) +
          "&body=" +
          encodeURIComponent(body);
        done(1, "Your email app should open with the message ready to send.");
      }
    });
  });

  /* theme toggle */
  var tt = d.getElementById("tt"),
    root = d.documentElement;
  function setT(t) {
    root.dataset.theme = t;
    tt.setAttribute("aria-pressed", t === "dark");
    try {
      localStorage.setItem("l1c-theme", t);
    } catch (e) {}
  }
  tt.setAttribute("aria-pressed", root.dataset.theme === "dark");
  tt.onclick = function () {
    setT(root.dataset.theme === "dark" ? "light" : "dark");
  };

  /* card and tile hover spotlight */
  d.querySelectorAll(".card,.tile").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* cursor glow: one effect for every page and section (mouse devices only) */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !rm) {
    var c = d.createElement("div"),
      x = -999,
      y = -999,
      cx = x,
      cy = y,
      queued = false,
      DARK = ".hero,.ph,.dark,.nf,footer,header,.tile,.cs,.lim,.pic,.im,.eth";
    c.className = "cur";
    c.setAttribute("aria-hidden", "true");
    d.body.appendChild(c);
    // Pick the glow layer that suits what is under the cursor.
    function surface() {
      queued = false;
      var el = d.elementFromPoint(x, y);
      c.dataset.s = root.dataset.theme === "dark" || (el && el.closest(DARK)) ? "dark" : "light";
    }
    function queue() {
      if (!queued) {
        queued = true;
        requestAnimationFrame(surface);
      }
    }
    addEventListener(
      "pointermove",
      function (e) {
        x = e.clientX;
        y = e.clientY;
        if (!c.classList.contains("on")) {
          cx = x;
          cy = y;
        }
        c.classList.add("on");
        queue();
      },
      { passive: true },
    );
    addEventListener("scroll", queue, { passive: true });
    d.documentElement.addEventListener("pointerleave", function () {
      c.classList.remove("on");
    });
    (function tick() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      c.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(tick);
    })();
  }

  /* the events search box must not reload the page */
  d.querySelectorAll("form.sbar").forEach(function (f) {
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
    });
  });

  /* rotating event words in the hero */
  var rw = d.getElementById("rw");
  if (rw && !rm) {
    var ws = [
        "Executive Networking",
        "Leadership Dinners",
        "Business Summits",
        "Corporate Conferences",
        "Product Launches",
        "Technology Events",
      ],
      wi = 0;
    setInterval(function () {
      rw.classList.add("out");
      setTimeout(function () {
        wi = (wi + 1) % ws.length;
        rw.textContent = ws[wi];
        rw.classList.remove("out");
      }, 400);
    }, 2600);
  }

  /* if a photo cannot load, show the dark placeholder instead of a broken image */
  d.querySelectorAll("img").forEach(function (im) {
    function bad() {
      im.classList.add("nophoto");
    }
    im.addEventListener("error", bad);
    if (im.complete && im.naturalWidth === 0 && im.src.indexOf("data:") !== 0)
      bad();
  });

  /* prefill forms from the link, e.g. ?type=Executive+Networking or ?event=event-slug */
  new URLSearchParams(location.search).forEach(function (val, key) {
    if (!/^[a-z]+$/i.test(key)) return;
    var el = d.querySelector('form.form [name="' + key + '"]');
    if (!el) return;
    if (el.tagName === "SELECT") {
      [].slice.call(el.options).forEach(function (o) {
        if (o.value === val || o.dataset.slug === val) el.value = o.value;
      });
    } else el.value = val.slice(0, 150);
  });
  var evsel = d.getElementById("event"),
    evinfo = d.getElementById("evinfo");
  if (evsel) {
    var showEv = function () {
      var o = evsel.options[evsel.selectedIndex];
      evinfo.textContent =
        o && o.value ? o.dataset.when + " · " + o.dataset.loc : "";
    };
    evsel.addEventListener("change", showEv);
    showEv();
  }

  /* events search */
  var es = d.getElementById("es");
  if (es) {
    var cards = [].slice.call(d.querySelectorAll(".ec")),
      secs = [].slice.call(d.querySelectorAll(".evs")),
      cnt = d.getElementById("ecount");
    es.addEventListener("input", function () {
      var terms = es.value.toLowerCase().split(/\s+/).filter(Boolean),
        n = 0;
      cards.forEach(function (c) {
        var hit = terms.every(function (t) {
          return c.dataset.q.indexOf(t) > -1;
        });
        c.hidden = !hit;
        if (hit) n++;
      });
      secs.forEach(function (s) {
        s.hidden = !s.querySelector(".ec:not([hidden])");
      });
      cnt.textContent = terms.length
        ? n
          ? n + (n > 1 ? " events found" : " event found")
          : "No events match your search."
        : "";
    });
  }

  /* photo carousel */
  var car = d.querySelector(".car");
  if (car) {
    var tr = car.querySelector(".ctrack"),
      timer,
      go = function (n) {
        var max = tr.scrollWidth - tr.clientWidth,
          step = tr.firstElementChild.getBoundingClientRect().width + 18,
          beh = rm ? "auto" : "smooth";
        if (n > 0 && tr.scrollLeft >= max - 4)
          tr.scrollTo({ left: 0, behavior: beh });
        else if (n < 0 && tr.scrollLeft <= 4)
          tr.scrollTo({ left: max, behavior: beh });
        else tr.scrollBy({ left: n * step, behavior: beh });
      },
      play = function () {
        if (!rm)
          timer = setInterval(function () {
            go(1);
          }, 4500);
      },
      stop = function () {
        clearInterval(timer);
      };
    car.querySelector(".cprev").onclick = function () {
      go(-1);
    };
    car.querySelector(".cnext").onclick = function () {
      go(1);
    };
    car.addEventListener("mouseenter", stop);
    car.addEventListener("mouseleave", play);
    car.addEventListener("focusin", stop);
    car.addEventListener("touchstart", stop, { passive: true });
    play();
  }
})();
