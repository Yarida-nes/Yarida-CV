var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Save as PDF — uses the browser's own print-to-PDF dialogue, so the
   downloaded copy always matches what is on the page. */
document.querySelectorAll("[data-print]").forEach(function (button) {
  button.addEventListener("click", function () {
    window.print();
  });
});

/* Closed <details> (the Q&A) print as just their question. Open them all
   while printing, then put them back the way the reader had them. */
var detailsState = [];
window.addEventListener("beforeprint", function () {
  detailsState = Array.prototype.slice
    .call(document.querySelectorAll("details"))
    .map(function (d) {
      var wasOpen = d.open;
      d.open = true;
      return { el: d, open: wasOpen };
    });
});
window.addEventListener("afterprint", function () {
  detailsState.forEach(function (s) {
    s.el.open = s.open;
  });
  detailsState = [];
});

/* Project-card images are optional. If one is missing, drop the broken
   <img> so the CSS fallback (navy panel with a text mark) shows instead. */
document.querySelectorAll(".project-shot img").forEach(function (img) {
  function markMissing() {
    img.parentNode.classList.add("is-missing");
  }
  img.addEventListener("error", markMissing);
  if (img.complete && img.naturalWidth === 0) markMissing();
});

/* Highlight whichever section is currently on screen in the top nav. */
var navLinks = Array.prototype.slice.call(
  document.querySelectorAll('nav a[href^="#"]')
);
var sections = navLinks
  .map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  })
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/* ── Dark mode toggle ────────────────────────────────────────────────────
   The theme is applied before paint by a small inline script in each page's
   <head> (reads localStorage). Here we add the button and keep it in sync. */
(function () {
  var root = document.documentElement;
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function currentTheme() {
    return root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }
  var bar = document.querySelector(".topbar");
  if (!bar) return;

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  var icon = document.createElement("span");
  icon.className = "theme-icon";
  icon.setAttribute("aria-hidden", "true");
  var label = document.createElement("span");
  btn.appendChild(icon);
  btn.appendChild(label);

  function render() {
    var dark = currentTheme() === "dark";
    icon.textContent = dark ? "\u2600" : "\u263D";       /* sun / moon */
    label.textContent = dark ? "Light" : "Dark";
    btn.setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " theme");
  }
  render();

  btn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    render();
  });

  /* Group the GitHub link and the toggle together on the right. */
  var gh = bar.querySelector(".github-link");
  var actions = document.createElement("div");
  actions.className = "topbar-actions";
  if (gh) { bar.insertBefore(actions, gh); actions.appendChild(gh); }
  else { bar.appendChild(actions); }
  actions.appendChild(btn);

  /* If the system flips while no manual choice is stored, refresh the label. */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () { if (!root.getAttribute("data-theme")) render(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();

/* ── Reveal on scroll ────────────────────────────────────────────────────
   Progressive enhancement: only runs when IntersectionObserver exists and the
   reader has not requested reduced motion, so content is always visible if not. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var selectors = [
    ".section", ".metrics div", ".project-card", ".project-row",
    ".timeline-item", ".capability-list li", ".principle-list li",
    ".case", ".study-block", "figure", ".faq details"
  ];
  var nodes = [];
  selectors.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      if (nodes.indexOf(el) === -1) nodes.push(el);
    });
  });
  if (!nodes.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  nodes.forEach(function (el, i) {
    el.classList.add("reveal");
    /* gentle stagger for items that sit in a row together */
    var sib = el.previousElementSibling;
    if (sib && sib.parentNode === el.parentNode) {
      var delay = (i % 4) * 60;
      if (delay) el.style.transitionDelay = delay + "ms";
    }
    io.observe(el);
  });
})();
