var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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


/* ── Reveal on scroll ────────────────────────────────────────────────────
   Progressive enhancement: only runs when IntersectionObserver exists and the
   reader has not requested reduced motion, so content is always visible if not. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var selectors = [
    ".section", ".metrics div", ".project-card", ".project-row",
    ".timeline-item", ".capability-list li",
    ".case", ".study-block", "figure"
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

/* ── Back-to-top button ──────────────────────────────────────────────────
   Injected on every page; appears after scrolling down, returns to the top. */
(function () {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<span aria-hidden="true">\u2191</span>';
  document.body.appendChild(btn);

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScroll() {
    btn.classList.toggle("is-shown", (window.pageYOffset || document.documentElement.scrollTop) > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
})();
