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

function setScrolled() {
  document.documentElement.classList.toggle("scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", setScrolled, { passive: true });
setScrolled();

document.documentElement.classList.add("js");

var menuButton = document.querySelector(".menu-button");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", open ? "true" : "false");
}
menuButton.addEventListener("click", function () {
  setMenu(menuButton.getAttribute("aria-expanded") === "false");
});
document.querySelectorAll(".tabs a").forEach(function (a) {
  a.addEventListener("click", function () { setMenu(false); });
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});

var joinForm = document.querySelector(".join-form");

if (joinForm) {
  var blocks = joinForm.querySelectorAll(".join-block");
  var pickGroups = joinForm.querySelectorAll("[data-pick-one]");

  joinForm.querySelectorAll("[data-required]").forEach(function (c) { c.required = true; });

  function updateJoinForm() {
    blocks.forEach(function (block) {
      block.hidden = !block.getAttribute("data-show").split("&").every(function (rule) {
        rule = rule.split("=");
        var match = joinForm.querySelector("[name=" + rule[0] + "][value=" + rule[1] + "], [name=" + rule[0] + "] [value=" + rule[1] + "]");
        return match.checked || match.selected;
      });
    });
    joinForm.querySelectorAll("input, textarea, select").forEach(function (c) {
      if (c.name !== "website") c.disabled = !!c.closest(".join-block[hidden]");
    });
    var rest = joinForm.querySelector(".form-rest");
    if (rest) {
      var away = joinForm.querySelector("[name=attend][value=No]").checked || joinForm.querySelector("[name=adult][value=No]").checked;
      rest.inert = away;
      rest.classList.toggle("greyed", away);
    }
    checkPhone();
    pickGroups.forEach(function (group) {
      var boxes = group.querySelectorAll("[type=checkbox]");
      var noneTicked = !Array.prototype.some.call(boxes, function (b) { return b.checked; });
      boxes[0].setCustomValidity(noneTicked && !boxes[0].disabled ? group.getAttribute("data-pick-one") : "");
    });
  }

  var phone = joinForm.querySelector("#phone[aria-describedby=phone-hint]");
  var phoneCode = joinForm.querySelector("#phone_code");
  // Maldives numbers have 7 digits, Bhutan 8 and Sri Lanka 9
  function checkPhone() {
    if (!phone) return;
    var india = phoneCode.value === "+91";
    var ok = india ? /^[6-9]\d{9}$/.test(phone.value) : /^\d{7,10}$/.test(phone.value);
    phone.setCustomValidity(!phone.value || ok ? "" : isHindi()
      ? (india ? "कृपया 10 अंकों का सही मोबाइल नंबर लिखें।" : "कृपया 7 से 10 अंकों का मोबाइल नंबर लिखें, देश के कोड के बिना।")
      : (india ? "Please enter a valid 10-digit mobile number." : "Please enter a mobile number of 7 to 10 digits, without the country code."));
    phoneCode.setCustomValidity(/^\+\d{1,3}$/.test(phoneCode.value) ? "" : isHindi()
      ? "देश का कोड + से शुरू करें, जैसे +91 या +977।"
      : "Start the country code with +, such as +91 or +977.");
  }
  if (phone) {
    phone.addEventListener("input", function () {
      phone.value = phone.value.replace(/\D/g, "");
      checkPhone();
    });
    phoneCode.addEventListener("input", function () {
      phoneCode.value = "+" + phoneCode.value.replace(/\D/g, "");
      checkPhone();
    });
  }

  var repeatCheck = joinForm.querySelector(".repeat-check");
  function askRepeat() {
    repeatCheck.hidden = false;
    repeatCheck.querySelector("input").required = true;
  }
  if (repeatCheck && localStorage.getItem("atp-applied")) askRepeat();

  joinForm.addEventListener("change", updateJoinForm);
  updateJoinForm();

  var token = joinForm.querySelector("[data-token]");
  if (token) {
    fetch(joinForm.action)
      .then(function (r) { return r.json(); })
      .then(function (reply) { token.value = reply.token; });
  }

  joinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var hi = document.documentElement.classList.contains("lang-hi");
    var status = joinForm.querySelector(".form-status");
    var button = joinForm.querySelector("[type=submit]");
    var data = new URLSearchParams(new FormData(joinForm));
    if (phoneCode) {
      data.set("phone", phoneCode.value + " " + phone.value);
      data.delete("phone_code");
    }
    data.delete("family_needed");
    data.delete("has_other");
    data.append("via", "fetch");
    data.append("ui_lang", hi ? "hi" : "en");
    data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    status.textContent = joinForm.dataset[hi ? "sendingHi" : "sending"];
    button.disabled = true;

    fetch(joinForm.action, { method: "POST", body: data })
      .then(function (r) { return r.json(); })
      .then(function (reply) {
        if (!reply.ok && reply.message === "repeat" && repeatCheck) {
          askRepeat();
          status.textContent = isHindi()
            ? "इस ईमेल से पहले ही एक आवेदन आ चुका है। ऊपर दिए बॉक्स को देखें और फिर से भेजें।"
            : "We already have an application with this email. Please see the box above and send again.";
          button.disabled = false;
          repeatCheck.querySelector("input").focus();
          return;
        }
        if (!reply.ok) throw new Error(reply.message);
        if (repeatCheck) localStorage.setItem("atp-applied", "1");
        var thanks = document.querySelector(".join-thanks");
        joinForm.hidden = true;
        thanks.hidden = false;
        thanks.focus();
      })
      .catch(function () {
        status.textContent = joinForm.dataset[hi ? "failedHi" : "failed"];
        button.disabled = false;
      });
  });
}

document.querySelectorAll(".lang-switch button").forEach(function (btn, i, all) {
  btn.addEventListener("click", function () {
    var lang = btn.getAttribute("data-lang");
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("lang-hi", lang === "hi");
    all.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    document.querySelectorAll("[data-hi]").forEach(function (el) {
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
      el.textContent = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
    });
    document.querySelectorAll("textarea[data-max-words]").forEach(function (t) {
      t.dispatchEvent(new Event("input"));
    });
  });
});

function isHindi() {
  return document.documentElement.classList.contains("lang-hi");
}

document.querySelectorAll("textarea[data-max-words]").forEach(function (t) {
  var max = +t.getAttribute("data-max-words");
  var min = +t.getAttribute("data-min-words") || 0;
  var count = document.createElement("span");
  count.className = "word-count";
  count.id = t.id + "-count";
  t.after(count);
  t.setAttribute("aria-describedby", (t.getAttribute("aria-describedby") + " " + count.id).trim());

  t.addEventListener("input", function () {
    var n = (t.value.match(/\S+/g) || []).length;
    var over = n > max;
    var under = n > 0 && n < min;
    count.classList.toggle("over", over || under);
    if (isHindi()) {
      count.textContent = n + " / " + max + " शब्द" + (min ? ", कम से कम " + min : "") + (over ? ", कृपया छोटा करें" : "");
      t.setCustomValidity(over ? max + " शब्दों से ज़्यादा न लिखें।" : under ? "कृपया कम से कम " + min + " शब्द लिखें।" : "");
    } else {
      count.textContent = n + " / " + max + " words" + (min ? ", at least " + min : "") + (over ? ", please shorten" : "");
      t.setCustomValidity(over ? "Please keep this to " + max + " words or fewer." : under ? "Please write at least " + min + " words." : "");
    }
  });
  t.dispatchEvent(new Event("input"));
});

document.querySelectorAll("textarea[data-links]").forEach(function (box) {
  box.addEventListener("change", function () {
    var links = box.value.split(/[\s,;]+/).filter(Boolean);
    box.value = links.join("\n");
    var bad = links.filter(function (link) { return !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(link); });
    box.setCustomValidity(!bad.length ? "" : isHindi()
      ? "हर लिंक http:// या https:// से शुरू होना चाहिए। यह ठीक करें: " + bad[0]
      : "Each link should start with http:// or https://. Please check: " + bad[0]);
  });
});

// Language list and search from Tome (https://gitlab.wikimedia.org/toolforge-repos/tome, MIT),
// assets/languages.csv is Tome's languages.csv with a family column added from Glottolog
// (https://glottolog.org, CC BY 4.0)
var languages = null;

function loadLanguages() {
  if (!languages) {
    languages = fetch("/assets/languages.csv?v=3")
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var seen = {};
        return parseCsvRows(text).slice(1).reduce(function (out, row) {
          var code = (row[0] || "").trim().toLowerCase();
          var name = (row[1] || "").trim();
          if (!code || !name || seen[code]) return out;
          seen[code] = true;
          var split = function (v) { return (v || "").split(";").map(function (a) { return a.trim(); }).filter(Boolean); };
          out.push({ code: code, name: name, localNames: split(row[2]), alternates: split(row[3]), family: (row[4] || "").trim() });
          return out;
        }, []);
      });
  }
  return languages;
}

function parseCsvRows(text) {
  var rows = [], row = [], field = "", inQuotes = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = ""; rows.push(row); row = [];
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function searchLanguages(list, query) {
  var q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  var codeMatches = [], nameMatches = [], altMatches = [];
  list.forEach(function (e) {
    var starts = function (v) { return v.toLowerCase().startsWith(q); };
    if (e.code === q) codeMatches.push(e);
    else if (starts(e.name) || e.localNames.some(starts)) nameMatches.push(e);
    else {
      var alt = e.alternates.find(starts);
      if (alt) altMatches.push({ entry: e, alt: alt });
    }
  });
  var closeness = function (name) { return name.toLowerCase() === q ? 0 : name.length; };
  nameMatches.sort(function (a, b) { return closeness(a.name) - closeness(b.name) || a.name.localeCompare(b.name); });
  altMatches.sort(function (a, b) { return closeness(a.alt) - closeness(b.alt) || a.alt.localeCompare(b.alt); });
  return codeMatches.concat(nameMatches).map(function (e) {
    var local = e.localNames[0];
    return { code: e.code, name: e.name, family: e.family, display: e.name + (local ? " (" + local + ")" : "") + " · " + e.code };
  }).concat(altMatches.map(function (m) {
    var label = m.alt + "-" + m.entry.name;
    return { code: m.entry.code, name: label, family: m.entry.family, display: label + " · " + m.entry.code };
  })).slice(0, 8);
}

function languageCombo(input, onPick, onEnter) {
  var list = document.getElementById(input.getAttribute("aria-controls"));
  var matches = [], active = -1;

  function render() {
    list.innerHTML = "";
    matches.forEach(function (m, i) {
      var li = document.createElement("li");
      li.id = list.id + "-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === active ? "true" : "false");
      li.textContent = m.display;
      li.addEventListener("mousedown", function (e) { e.preventDefault(); pick(m); });
      list.appendChild(li);
    });
    list.hidden = !matches.length;
    input.setAttribute("aria-expanded", matches.length ? "true" : "false");
    if (active >= 0) {
      input.setAttribute("aria-activedescendant", list.id + "-" + active);
      list.children[active].scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function close() { matches = []; active = -1; render(); }
  function pick(m) { onPick(m); close(); }

  input.addEventListener("input", function () {
    var query = input.value;
    loadLanguages().then(function (all) {
      if (input.value !== query) return;
      matches = searchLanguages(all, query);
      active = -1;
      render();
    });
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown" && matches.length) { e.preventDefault(); active = (active + 1) % matches.length; render(); }
    else if (e.key === "ArrowUp" && matches.length) { e.preventDefault(); active = active <= 0 ? matches.length - 1 : active - 1; render(); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(matches[active]); }
    else if (e.key === "Enter" && onEnter) { e.preventDefault(); onEnter(); }
  });
  input.addEventListener("blur", close);
}

var mainLanguage = document.getElementById("language");
if (mainLanguage) {
  var mainCode = mainLanguage.form.elements.language_code;
  var familyFound = mainLanguage.form.querySelector("[data-family-found]");
  var familyNeeded = mainLanguage.form.elements.family_needed;
  var familyNote = mainLanguage.form.querySelector(".family-found");

  var setFamily = function (family) {
    familyFound.value = family;
    familyNeeded.checked = !family;
    familyNote.hidden = !family;
    familyNote.querySelector("[data-family-name]").textContent = family;
    mainLanguage.form.dispatchEvent(new Event("change"));
  };

  mainLanguage.addEventListener("input", function () {
    mainCode.value = "";
    if (familyFound.value) setFamily("");
  });
  languageCombo(mainLanguage, function (m) {
    mainLanguage.value = m.name;
    mainCode.value = m.code;
    setFamily(m.family);
  });

  var moreLanguage = document.getElementById("more_language");
  var added = document.querySelector(".added-languages");
  var picked = null;

  var markOthers = function () {
    mainLanguage.form.elements.has_other.checked = added.children.length > 0;
    mainLanguage.form.dispatchEvent(new Event("change"));
  };

  var addLanguage = function () {
    var name = moreLanguage.value.trim();
    if (!name) return;
    var value = picked && picked.name === name ? name + " (" + picked.code + ")" : name;
    var li = document.createElement("li");
    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "other_languages";
    hidden.value = value;
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "small-btn";
    remove.textContent = isHindi() ? "हटाएँ" : "Remove";
    remove.setAttribute("aria-label", (isHindi() ? "हटाएँ: " : "Remove ") + value);
    remove.addEventListener("click", function () { li.remove(); markOthers(); moreLanguage.focus(); });
    li.append(value + " ", hidden, remove);
    added.appendChild(li);
    markOthers();
    moreLanguage.value = "";
    picked = null;
  };

  languageCombo(moreLanguage, function (m) {
    moreLanguage.value = m.name;
    picked = m;
    addLanguage();
  }, addLanguage);
  document.querySelector(".add-language").addEventListener("click", addLanguage);
}

// assets/airports.csv is from OurAirports (public domain), Indian airports with scheduled flights
var airportSelect = document.getElementById("airport");
if (airportSelect) {
  var stateSelect = document.getElementById("state");
  var airports = fetch("/assets/airports.csv?v=4")
    .then(function (r) { return r.text(); })
    .then(function (text) {
      return parseCsvRows(text).slice(1).filter(function (row) { return row[1]; });
    });

  var listAirports = function () {
    airports.then(function (rows) {
      var chosen = airportSelect.value;
      var state = stateSelect.value;
      var stateName = stateSelect.selectedOptions[0].textContent;
      var hi = isHindi();
      var home = rows.filter(function (row) { return row[3] === state; });
      var groups = home.length
        ? [[hi ? stateName + " में" : "In " + stateName, home, ""],
           [hi ? "दूसरे हवाई अड्डे" : "Other airports", rows.filter(function (row) { return row[3] !== state; }), "elsewhere"]]
        : [[hi ? "सभी हवाई अड्डे" : "All airports", rows, ""]];

      airportSelect.querySelectorAll("optgroup").forEach(function (g) { g.remove(); });
      var notListed = airportSelect.querySelector("[value=Other]");
      groups.forEach(function (group) {
        var optgroup = document.createElement("optgroup");
        optgroup.label = group[0];
        group[1].forEach(function (row) {
          var option = document.createElement("option");
          var code = row[0] ? " (" + row[0] + ")" : "";
          option.value = row[1] + code + ", " + row[2];
          option.textContent = row[1] + ": " + row[2] + code;
          if (group[2]) option.className = group[2];
          optgroup.appendChild(option);
        });
        airportSelect.insertBefore(optgroup, notListed);
      });
      airportSelect.value = chosen;
      if (airportSelect.selectedIndex < 0) airportSelect.value = "";
    });
  };

  stateSelect.addEventListener("change", listAirports);
  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", listAirports);
  });
  listAirports();
}
