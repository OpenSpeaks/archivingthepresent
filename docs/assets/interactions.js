document.querySelectorAll(".copy-id").forEach(function (btn) {
  btn.addEventListener("click", function () {
    navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(function () {
      btn.classList.add("copied");
      setTimeout(function () { btn.classList.remove("copied"); }, 1200);
    });
  });
});

document.querySelectorAll(".citation-block").forEach(function (block) {
  var citations = JSON.parse(block.getAttribute("data-citation"));
  var accessed = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  var select = block.querySelector(".citation-style");
  var pre = block.querySelector(".citation-text");
  var copyBtn = block.querySelector(".citation-copy");
  var downloadBtn = block.querySelector(".citation-download");

  function render() {
    var text = citations[select.value].replaceAll("__ACCESSED__", accessed);
    pre.textContent = text;
    copyBtn.setAttribute("data-copy", text);
  }

  select.addEventListener("change", render);
  render();

  downloadBtn.addEventListener("click", function () {
    var text = citations.bibtex.replaceAll("__ACCESSED__", accessed);
    var blob = new Blob([text], { type: "application/x-bibtex" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = block.getAttribute("data-id") + ".bib";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

document.querySelectorAll("[data-toc]").forEach(function (scope) {
  var headings = Array.prototype.slice.call(scope.querySelectorAll("h2, h3, h4"));
  if (headings.length < 2) return;

  var top = +headings[0].tagName[1];
  var nav = document.createElement("nav");
  nav.className = "page-toc";
  nav.setAttribute("aria-labelledby", "page-toc-title");
  nav.innerHTML = '<p class="page-toc-title" id="page-toc-title">On this page</p><ol></ol>';
  var list = nav.querySelector("ol");
  var links = [];

  headings.forEach(function (h) {
    if (!h.id) {
      var slug = h.textContent.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
      var id = slug, n = 2;
      while (document.getElementById(id)) id = slug + "-" + n++;
      h.id = id;
    }
    var li = document.createElement("li");
    li.className = "page-toc-level-" + Math.max(1, +h.tagName[1] - top + 1);
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    list.appendChild(li);
    links.push(a);
  });

  scope.parentNode.insertBefore(nav, scope);

  var offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  var ticking = false;
  function mark() {
    ticking = false;
    var current = 0;
    headings.forEach(function (h, i) {
      if (h.getBoundingClientRect().top <= offset + 24) current = i;
    });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(mark); }
  }, { passive: true });
  mark();
});
