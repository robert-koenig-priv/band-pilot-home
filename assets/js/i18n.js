/* BandPilot — client-side i18n.
   English lives in the HTML (fallback). DE/FR come from window.BP_TRANSLATIONS.
   Language is auto-detected from the browser, overridable via the header globe,
   and a manual choice is remembered in localStorage. */
(function () {
  "use strict";

  var SUPPORTED = ["en", "de", "fr", "ka"];
  var LABELS = { en: "EN", de: "DE", fr: "FR", ka: "KA" };
  var STORAGE_KEY = "bp-lang";
  var T = window.BP_TRANSLATIONS || {};

  /* Cache each tagged node's original English so switching back restores it exactly. */
  var cache = [];
  var sel = "[data-i18n],[data-i18n-alt],[data-i18n-content],[data-i18n-aria-label]";
  Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
    if (el.hasAttribute("data-i18n"))
      cache.push({ el: el, type: "html", key: el.getAttribute("data-i18n"), en: el.innerHTML });
    if (el.hasAttribute("data-i18n-alt"))
      cache.push({ el: el, type: "attr", attr: "alt", key: el.getAttribute("data-i18n-alt"), en: el.getAttribute("alt") });
    if (el.hasAttribute("data-i18n-content"))
      cache.push({ el: el, type: "attr", attr: "content", key: el.getAttribute("data-i18n-content"), en: el.getAttribute("content") });
    if (el.hasAttribute("data-i18n-aria-label"))
      cache.push({ el: el, type: "attr", attr: "aria-label", key: el.getAttribute("data-i18n-aria-label"), en: el.getAttribute("aria-label") });
  });

  function translate(lang, key, fallback) {
    if (lang === "en") return fallback;
    var dict = T[lang];
    return (dict && dict[key] != null) ? dict[key] : fallback;
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "en";
    cache.forEach(function (c) {
      var val = translate(lang, c.key, c.en);
      if (c.type === "html") { if (c.el.innerHTML !== val) c.el.innerHTML = val; }
      else if (c.el.getAttribute(c.attr) !== val) { c.el.setAttribute(c.attr, val); }
    });
    var d = document.documentElement;
    d.lang = lang;
    d.classList.remove("i18n-pending");
    window.__bpLang = lang;
    updateSwitcher(lang);
  }

  function detect() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SUPPORTED.indexOf(s) > -1) return s;
    } catch (e) {}
    var langs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < langs.length; i++) {
      var base = (langs[i] || "").slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(base) > -1) return base;
    }
    return "en";
  }

  /* ---- Switcher UI ---- */
  var switches = document.querySelectorAll(".langswitch");

  function closeMenus() {
    Array.prototype.forEach.call(switches, function (sw) {
      sw.classList.remove("is-open");
      var btn = sw.querySelector(".langswitch__btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function updateSwitcher(lang) {
    Array.prototype.forEach.call(switches, function (sw) {
      var cur = sw.querySelector(".langswitch__cur");
      if (cur) cur.textContent = LABELS[lang] || lang.toUpperCase();
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
  }

  document.addEventListener("click", function (e) {
    var pick = e.target.closest("[data-lang]");
    if (pick) {
      e.preventDefault();
      setLang(pick.getAttribute("data-lang"));
      closeMenus();
      var mm = document.querySelector(".mobile-menu");
      if (mm) mm.classList.remove("is-open");
      return;
    }
    var toggle = e.target.closest(".langswitch__btn");
    if (toggle) {
      var sw = toggle.closest(".langswitch");
      var open = sw.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    closeMenus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenus();
  });

  apply(window.__bpLang || detect());
})();
