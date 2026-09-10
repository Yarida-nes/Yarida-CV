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
