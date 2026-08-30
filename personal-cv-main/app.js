document.getElementById("year").textContent = new Date().getFullYear();

/* Save as PDF — uses the browser's own print-to-PDF dialogue, so the
   downloaded copy always matches what is on the page. */
document.querySelectorAll("[data-print]").forEach(function (button) {
  button.addEventListener("click", function () {
    window.print();
  });
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
