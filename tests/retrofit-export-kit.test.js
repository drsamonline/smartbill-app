/* tests/retrofit-export-kit.test.js — the proof for the export-kit retrofit.
 *
 *   node tests/retrofit-export-kit.test.js [path-to-index.html]
 *
 * What this proves, and why it is written this way.
 *
 * The two exports in this app used to hand-roll the whole
 * Blob -> URL.createObjectURL -> <a download> -> revoke dance: once for the Word
 * (.doc) invoice and once for the JSON backup. export-kit exists to be that code
 * ONCE, so both now call Export.save().
 *
 * A test that asserted "createObjectURL is gone" would pass on a broken page — an
 * assertion that a capability DISAPPEARED is exactly the retrofit that had to be
 * reverted on read-live-transform-app. So this suite does not look for absence. It
 * BOOTS the real page, calls the app's own public functions (exportWord, backupData,
 * and the shared __exportAll block), and asserts that a file with the right name,
 * the right mime type and the right bytes came out of Export.save.
 *
 * On the page as it was before the retrofit there is no Export at all and the two
 * functions go straight to createObjectURL, so every assertion below fails: the
 * suite bites.
 *
 * No dependencies: a small vm sandbox stands in for the browser, and Vue is stubbed
 * at createApp so setup() runs headlessly. The app is never modified for the test.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var targets = process.argv[2]
  ? [path.resolve(process.argv[2])]
  : [path.join(root, "index.html"), path.join(root, "docs", "play", "index.html")];

var pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name + (extra ? "  (" + extra + ")" : "")); }
}

/* ---------- pull the two script blocks out of the page ----------
 * A naive /<script>([\s\S]*?)<\/script>/ split cannot be used here: exportWord()
 * builds a .doc whose HTML contains a literal <script>...</script> pair inside a
 * template literal, so the regex would cut the app script in half. The page is a
 * single app script, so: the kit block ends where the app script begins, and the
 * app script runs to the last </script> in the document. */
function parts(html) {
  var appAt = html.indexOf("const { createApp");
  var appJs = appAt === -1 ? "" : html.slice(appAt, html.lastIndexOf("</script>"));
  var kitAt = html.indexOf("/* export-kit");
  var kitJs = "";
  if (kitAt !== -1 && appAt !== -1) {
    kitJs = html.slice(html.indexOf("<script>", kitAt) === -1 ? kitAt : kitAt, html.lastIndexOf("</script>", appAt));
  }
  return { appJs: appJs, kitJs: kitJs };
}

/* ---------- the smallest browser the app actually needs ---------- */
function makeDom() {
  var byId = {
    "print-area": { innerHTML: "<table><tr><td>Widget</td><td>100.00</td></tr></table>" }
  };
  function el(tag) {
    return {
      tagName: String(tag || "div").toUpperCase(),
      style: {}, children: [], textContent: "", innerHTML: "",
      href: "", download: "", rel: "", clicked: 0,
      click: function () { this.clicked++; },
      remove: function () {}, setAttribute: function () {}, addEventListener: function () {}
    };
  }
  var doc = {
    title: "SmartBill India - Pro Billing",
    body: { appendChild: function () {}, removeChild: function () {}, children: [] },
    documentElement: el("html"),
    createElement: el,
    getElementById: function (id) { return byId[id] || null; },
    querySelector: function () { return el("h1"); },
    querySelectorAll: function () { return []; },
    addEventListener: function () {}
  };
  return doc;
}

function boot(html) {
  var p = parts(html);
  var doc = makeDom();
  var saved = [];          // every file the page tried to write
  var alerts = [];
  var store = {};
  var sandbox = {
    console: console,
    document: doc,
    Blob: Blob,
    URL: URL,
    TextEncoder: TextEncoder,
    setTimeout: function () {}, clearTimeout: function () {},
    alert: function (m) { alerts.push(String(m)); },
    confirm: function () { return true; },
    prompt: function () { return null; },
    navigator: { userAgent: "node" },
    location: { search: "", reload: function () {} },
    localStorage: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
      setItem: function (k, v) { store[k] = String(v); },
      removeItem: function (k) { delete store[k]; },
      key: function (i) { return Object.keys(store)[i] || null; },
      get length() { return Object.keys(store).length; }
    },
    indexedDB: { open: function () { return { onupgradeneeded: null, onsuccess: null, onerror: null }; } },
    FileReader: function () {},
    Image: function () {}
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  var captured = null;
  sandbox.Vue = {
    createApp: function (opts) { captured = opts; return { mount: function () { return opts; } }; },
    ref: function (v) { return { value: v }; },
    reactive: function (o) { return o; },
    computed: function (fn) { return { get value() { return fn(); } }; },
    watch: function () {}, onMounted: function () {}, nextTick: function () {}, toRefs: function (o) { return o; }
  };
  vm.createContext(sandbox);
  if (p.kitJs) vm.runInContext(p.kitJs, sandbox, { filename: "export-kit.js" });
  if (p.appJs) vm.runInContext(p.appJs, sandbox, { filename: "app.js" });

  // Every kit function that produces a FILE is recorded. save() alone is not enough:
  // Export.json() and Export.text() call the kit's own internal save(), not the
  // exported property, so a save()-only spy would miss a backup that did go through
  // the kit. What is being proved is that the app reaches the kit at all.
  var MIMES = {
    save: null, json: "application/json", text: "text/plain;charset=utf-8",
    csv: "text/csv;charset=utf-8", blob: "application/octet-stream", saveZip: "application/zip"
  };
  if (sandbox.Export) {
    Object.keys(MIMES).forEach(function (fn) {
      if (typeof sandbox.Export[fn] !== "function") return;
      var real = sandbox.Export[fn];
      sandbox.Export[fn] = function (name, data, mime) {
        saved.push({ via: fn, name: name, data: data, mime: mime || MIMES[fn] });
        return { size: 0, type: mime, __spy: true };
      };
      sandbox.Export["__real_" + fn] = real;
    });
  }

  var api = null;
  if (captured && typeof captured.setup === "function") {
    try { api = captured.setup(); } catch (e) { api = { __error: e }; }
  }
  return { w: sandbox, doc: doc, api: api, saved: saved, alerts: alerts };
}

function asText(d) {
  if (typeof d === "string") return d;
  try { return JSON.stringify(d); } catch (e) { return ""; }
}
function asObj(d) {
  if (d && typeof d === "object" && !(d instanceof Uint8Array) && typeof d.byteLength !== "number") return d;
  try { return JSON.parse(String(d)); } catch (e) { return null; }
}

function run(file) {
  console.log("\n" + path.relative(root, file));
  var html = fs.readFileSync(file, "utf8");
  var env = boot(html);

  ok("the page boots and exposes its API (exportWord, backupData)",
    !!env.api && typeof env.api.exportWord === "function" && typeof env.api.backupData === "function",
    env.api && env.api.__error ? String(env.api.__error).slice(0, 120) : "");

  ok("export-kit is INLINED in the page, so the app is still one file (no kit script src)",
    !!env.w.Export && typeof env.w.Export.save === "function" && !/<script[^>]+src=[^>]*export-kit/i.test(html));

  /* ---- the Word export ---- */
  var before = env.saved.length;
  if (env.api && typeof env.api.exportWord === "function") env.api.exportWord();
  var doc = env.saved[env.saved.length - 1];
  ok("exportWord() writes through Export.save (one file, not the hand-rolled dance)",
    env.saved.length === before + 1 && !!doc, "saved=" + env.saved.length);
  ok("the .doc keeps the invoice number as its filename",
    !!doc && /^.+\.doc$/.test(String(doc.name)) && String(doc.name).indexOf(env.api.invoice.number) === 0,
    doc && doc.name);
  ok("the .doc keeps the Word mime type", !!doc && doc.mime === "application/msword", doc && doc.mime);
  ok("the .doc keeps its UTF-8 BOM and the invoice markup",
    !!doc && asText(doc.data).charCodeAt(0) === 0xfeff && asText(doc.data).indexOf("Widget") !== -1);

  /* ---- the JSON backup ---- */
  before = env.saved.length;
  if (env.api && typeof env.api.backupData === "function") env.api.backupData();
  var bk = env.saved[env.saved.length - 1];
  ok("backupData() writes through Export.save", env.saved.length === before + 1 && !!bk);
  ok("the backup is still named SmartBill_Backup_<date>.json",
    !!bk && /^SmartBill_Backup_\d{4}-\d{2}-\d{2}\.json$/.test(String(bk.name)), bk && bk.name);
  ok("the backup is still application/json", !!bk && bk.mime === "application/json", bk && bk.mime);
  var parsed = asObj(bk && bk.data);
  ok("the backup still carries version, master and savedInvoices",
    !!parsed && parsed.version === "8.0" && !!parsed.master && Array.isArray(parsed.savedInvoices));
  ok("the backup still announces itself the same way",
    env.alerts.some(function (a) { return /Backup downloaded/.test(a); }));

  /* ---- the shared four-things block that ships INSIDE the .doc ---- */
  // It is not page-level code here: the injector block is part of the exported
  // document, so its guarded Export.save call is what the .doc carries. The retrofit
  // must not have removed it.
  ok("the exported .doc still carries the shared four-things block (export/restore/undo/keyboard)",
    !!doc && asText(doc.data).indexOf("__exportAll") !== -1 && asText(doc.data).indexOf("__importAll") !== -1);
}

targets.forEach(run);
console.log("\n" + pass + "/" + (pass + fail) + " passed");
process.exit(fail ? 1 : 0);
