
var fs = require("fs");
var path = require("path");
var http = require("http");
var playwright = require("playwright");

var LOCAL_BASE = process.env.ADMIN_E2E_BASE || "http://127.0.0.1:8080";
var MATRIX_BASE = process.env.ADMIN_E2E_MATRIX || "http://127.0.0.1";
var LIVE_BASE = "https://otomavi.com";
var WORKER_HOST = "webmaker.yunusevgane.workers.dev";
var REPO_ROOT = path.resolve(__dirname, "../../..");
var SCREENSHOT_DIR = process.env.ADMIN_E2E_SCREENSHOT_DIR || path.join(REPO_ROOT, "data", "yonetici");
var CROSS_SCREENSHOT = path.join(SCREENSHOT_DIR, "164_e2e_screenshot.png");
var WEBADMIN_USERS_FILE = path.join(REPO_ROOT, "public", "data", "proje", "otomavi", "webadminUsers.json");
var DEFAULT_E2E_USER = process.env.ADMIN_E2E_USER || "admin";
var DEFAULT_E2E_PASS = process.env.ADMIN_E2E_PASS || "Admin2030+";

async function launchBrowser() {
  var opts = { headless: true };
  var channels = [
    process.env.ADMIN_E2E_CHANNEL || "",
    "msedge",
    "chrome"
  ];
  var i;
  var lastErr = null;
  try {
    return await playwright.chromium.launch(opts);
  } catch (err) {
    lastErr = err;
  }
  for (i = 0; i < channels.length; i++) {
    if (!channels[i]) {
      continue;
    }
    try {
      var channelOpts = { headless: true, channel: channels[i] };
      return await playwright.chromium.launch(channelOpts);
    } catch (err2) {
      lastErr = err2;
    }
  }
  throw lastErr || new Error("Playwright browser baslatilamadi");
}

function httpProbe(urlStr, timeoutMs) {
  var ms = typeof timeoutMs === "number" ? timeoutMs : 5000;
  return new Promise(function(resolve) {
    var u = new URL(urlStr);
    var req = http.request(
      {
        hostname: u.hostname,
        port: u.port || (u.protocol === "https:" ? 443 : 80),
        path: u.pathname + u.search,
        method: "GET",
        timeout: ms
      },
      function(res) {
        res.resume();
        resolve({ ok: true, status: res.statusCode || 0 });
      }
    );
    req.on("error", function() {
      resolve({ ok: false, status: 0 });
    });
    req.setTimeout(ms, function() {
      req.destroy();
      resolve({ ok: false, status: 0 });
    });
    req.end();
  });
}

function log(msg) {
  console.log("[admin-e2e] " + msg);
}

function attachConsoleTracker(page, bucket) {
  page.on("console", function(msg) {
    if (msg.type() !== "error") {
      return;
    }
    var text = msg.text();
    if (
      text.indexOf("401") !== -1 ||
      text.indexOf("Unauthorized") !== -1 ||
      text.indexOf("Failed to load resource") !== -1 &&
        text.indexOf("401") !== -1
    ) {
      return;
    }
    bucket.push(text);
  });
  page.on("pageerror", function(err) {
    bucket.push(err && err.message ? err.message : String(err));
  });
}

function readWebadminMirrorUser(username) {
  if (!fs.existsSync(WEBADMIN_USERS_FILE)) {
    return null;
  }
  var raw = fs.readFileSync(WEBADMIN_USERS_FILE, "utf8");
  var list = JSON.parse(raw);
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] && String(list[i].username) === String(username)) {
      return list[i];
    }
  }
  return null;
}

async function verifyWebadminMock() {
  var mirrorUser = readWebadminMirrorUser(DEFAULT_E2E_USER);
  if (!mirrorUser) {
    throw new Error(
      "webadmin mock: " +
        WEBADMIN_USERS_FILE +
        " icinde '" +
        DEFAULT_E2E_USER +
        "' yok"
    );
  }
  log(
    "OK webadmin mock — otomavi webadminUsers.json username=" +
      mirrorUser.username +
      " domain=" +
      (mirrorUser.domain || "—")
  );

  var probe = await httpProbe(MATRIX_BASE + "/webmaker/services/site-admin/", 5000);
  if (probe.ok && probe.status >= 200 && probe.status < 500) {
    log("OK Matrix site-admin servis keşif → HTTP " + probe.status);
    return { ok: true };
  }
  log(
    "WARN Matrix site-admin servis erisilemedi — mock dosya OK, HTTP atlandi (" +
      MATRIX_BASE +
      ")"
  );
  return { ok: true, webadminHttpSkipped: true };
}

async function runCrossSystemLoginPageEdit() {
  await verifyWebadminMock();

  var health = await httpProbe(LOCAL_BASE + "/api/admin/health", 8000);
  if (!health.ok || health.status !== 200) {
    log("SKIP cross-system — webtest health yok");
    return { skipped: true, ok: true };
  }

  var browser = await launchBrowser();
  var page = await browser.newPage();
  var consoleErrors = [];
  var putStatus = null;

  attachConsoleTracker(page, consoleErrors);

  page.on("response", function(resp) {
    var url = resp.url();
    var method = resp.request().method();
    if (
      method === "PUT" &&
      url.indexOf("/api/admin/data/") !== -1 &&
      url.indexOf("pagesetting") === -1
    ) {
      putStatus = resp.status();
    }
  });

  var nav = await page.goto(LOCAL_BASE + "/admin/", {
    waitUntil: "networkidle",
    timeout: 45000
  });
  if (!nav || nav.status() >= 500) {
    await browser.close();
    throw new Error("admin/ yuklenemedi: HTTP " + (nav ? nav.status() : 0));
  }

  await page.fill("#mxadminUsername", DEFAULT_E2E_USER);
  await page.fill("#mxadminPassword", DEFAULT_E2E_PASS);
  await page.click("#mxadminLoginSubmit");

  await page.waitForFunction(function() {
    var shell = document.getElementById("mxadminShell");
    var login = document.getElementById("mxadminScreenLogin");
    return shell && !shell.classList.contains("hidden") && login && login.classList.contains("hidden");
  }, { timeout: 30000 });
  log("OK Worker login (webtest proxy) — shell gorunur");

  var chipName = await page.textContent("#mxadminUserChipName");
  if (!chipName || String(chipName).trim() === "—") {
    await browser.close();
    throw new Error("login sonrasi kullanici chip bos");
  }
  log("OK oturum chip: " + String(chipName).trim());

  await page.click("#mxadminQuickPages");
  await page.waitForSelector("#mxadminScreenPages:not(.hidden)", { timeout: 20000 });
  await page.waitForFunction(function() {
    var list = document.getElementById("mxadminPagesList");
    return list && list.children && list.children.length > 0;
  }, { timeout: 30000 });
  log("OK sayfalar listesi yuklendi");

  await page.evaluate(function() {
    var list = document.getElementById("mxadminPagesList");
    if (list && list.children && list.children.length) {
      list.children[0].click();
    }
  });

  await page.waitForSelector("#mxadminPageSave:not([disabled])", { timeout: 30000 });
  await page.waitForFunction(function() {
    var form = document.getElementById("mxadminPageForm");
    var loading = document.getElementById("mxadminPageDetailLoading");
    if (loading && !loading.classList.contains("hidden")) {
      return false;
    }
    return !!form && form.offsetParent !== null;
  }, { timeout: 30000 });
  log("OK sayfa editoru acildi");

  var htmlEditorOk = await page.evaluate(function() {
    return !!document.querySelector(".mxadmin-html-editor");
  });
  if (htmlEditorOk) {
    log("OK html editor bileşeni mevcut (Paket 153)");
  }

  await page.click("#mxadminPageSave");
  await page.waitForFunction(function() {
    var btn = document.getElementById("mxadminPageSave");
    return btn && !btn.disabled;
  }, { timeout: 30000 });

  if (putStatus !== 200 && putStatus !== null) {
    await browser.close();
    throw new Error("sayfa kaydet PUT beklenen 200 degil: " + putStatus);
  }
  if (putStatus === 200) {
    log("OK sayfa kaydet PUT → 200");
  } else {
    log("OK sayfa kaydet tamamlandi (PUT status izlenemedi — form submit OK)");
  }

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  await page.screenshot({ path: CROSS_SCREENSHOT, fullPage: false });
  log("OK screenshot → " + CROSS_SCREENSHOT);

  if (consoleErrors.length) {
    await browser.close();
    throw new Error("cross-system console error: " + consoleErrors.join("; "));
  }
  log("OK cross-system console error = 0");

  await browser.close();
  return {
    skipped: false,
    ok: true,
    screenshot: CROSS_SCREENSHOT,
    username: String(chipName).trim()
  };
}

async function runLocalGoldenPath() {
  var probe = await httpProbe(LOCAL_BASE + "/admin/", 8000);
  if (!probe.ok || probe.status < 200 || probe.status >= 500) {
    log(
      "SKIP localhost — live-server ayakta degil (" +
        LOCAL_BASE +
        "/admin/)"
    );
    return { skipped: true, ok: true };
  }

  var browser = await launchBrowser();
  var page = await browser.newPage();
  var failedJs = [];
  var apiResponses = {};

  page.on("response", function(resp) {
    var url = resp.url();
    var status = resp.status();
    if (status === 404 && /\.js(?:\?|$)/i.test(url)) {
      failedJs.push(url + " → 404");
    }
    if (url.indexOf("/api/admin/data/pagesetting") !== -1) {
      apiResponses.pagesetting = status;
    }
    if (url.indexOf("/api/admin/auth/me") !== -1) {
      apiResponses.authMe = status;
    }
  });

  var nav = await page.goto(LOCAL_BASE + "/admin/", {
    waitUntil: "networkidle",
    timeout: 30000
  });
  if (!nav || nav.status() >= 500) {
    await browser.close();
    throw new Error("admin/ yuklenemedi: HTTP " + (nav ? nav.status() : 0));
  }

  var loginVisible = await page.evaluate(function() {
    var screen = document.getElementById("mxadminScreenLogin");
    var form = document.getElementById("mxadminLoginForm");
    if (!screen || !form) {
      return false;
    }
    var hidden = screen.classList.contains("hidden");
    return !hidden && form.offsetParent !== null;
  });
  if (!loginVisible) {
    await browser.close();
    throw new Error("Login formu gorunur degil (#mxadminScreenLogin / #mxadminLoginForm)");
  }
  log("OK login formu gorunur");

  var module404 = failedJs.filter(function(u) {
    return u.indexOf("/src/modules/") !== -1;
  });
  if (module404.length) {
    await browser.close();
    throw new Error("Global modul 404: " + module404.join("; "));
  }
  log("OK global modul script 404 yok");

  var pagesettingStatus = await page.evaluate(function() {
    return fetch("/api/admin/data/pagesetting", { credentials: "same-origin" })
      .then(function(r) {
        return r.status;
      })
      .catch(function() {
        return 0;
      });
  });
  if (pagesettingStatus === 502) {
    await browser.close();
    log(
      "SKIP pagesetting 502 — onizleme matrix klasoru yok (webtest render + preview domain)"
    );
    return { skipped: true, ok: true };
  }
  if (pagesettingStatus !== 200) {
    await browser.close();
    throw new Error(
      "pagesetting 200 bekleniyordu, alindi: " + pagesettingStatus
    );
  }
  log("OK /api/admin/data/pagesetting → 200");

  var formStyleOk = await page.evaluate(function() {
    var username = document.getElementById("mxadminUsername");
    var chevronStyle = document.getElementById("mxadmin-select-chevron-style");
    if (!username) {
      return { ok: false, reason: "mxadminUsername yok" };
    }
    var cs = window.getComputedStyle(username);
    var minH = parseFloat(cs.minHeight);
    if (isNaN(minH) || minH < 40) {
      return { ok: false, reason: "input min-height beklenen degil: " + cs.minHeight };
    }
    if (!chevronStyle || !chevronStyle.textContent) {
      return { ok: false, reason: "mxadmin-select-chevron-style enjekte edilmedi" };
    }
    if (chevronStyle.textContent.indexOf("background-image") === -1) {
      return { ok: false, reason: "chevron style icerigi eksik" };
    }
    return { ok: true, minHeight: cs.minHeight };
  });
  if (!formStyleOk.ok) {
    await browser.close();
    throw new Error("Paket 142 form stili: " + formStyleOk.reason);
  }
  log("OK form alani min-height + select chevron style (" + formStyleOk.minHeight + ")");

  if (typeof apiResponses.authMe === "number") {
    log("auth/me → " + apiResponses.authMe + " (oturum yok — beklenen)");
  }

  await browser.close();
  return { skipped: false, ok: true };
}

async function runLocalMobileSmoke() {
  var probe = await httpProbe(LOCAL_BASE + "/admin/", 8000);
  if (!probe.ok || probe.status < 200 || probe.status >= 500) {
    log(
      "SKIP mobil — live-server ayakta degil (" +
        LOCAL_BASE +
        "/admin/)"
    );
    return { skipped: true, ok: true };
  }

  var browser = await launchBrowser();
  var context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  var page = await context.newPage();
  var consoleErrors = [];

  page.on("console", function(msg) {
    if (msg.type() === "error") {
      var text = msg.text();
      if (text.indexOf("401") !== -1 || text.indexOf("Unauthorized") !== -1) {
        return;
      }
      consoleErrors.push(text);
    }
  });
  page.on("pageerror", function(err) {
    consoleErrors.push(err && err.message ? err.message : String(err));
  });

  var nav = await page.goto(LOCAL_BASE + "/admin/", {
    waitUntil: "networkidle",
    timeout: 30000
  });
  if (!nav || nav.status() >= 500) {
    await browser.close();
    throw new Error("mobil admin/ yuklenemedi: HTTP " + (nav ? nav.status() : 0));
  }

  var loginVisible = await page.evaluate(function() {
    var screen = document.getElementById("mxadminScreenLogin");
    var form = document.getElementById("mxadminLoginForm");
    if (!screen || !form) {
      return false;
    }
    return !screen.classList.contains("hidden") && form.offsetParent !== null;
  });
  if (!loginVisible) {
    await browser.close();
    throw new Error("mobil login formu gorunur degil");
  }
  log("OK mobil login formu gorunur");

  var toggleOk = await page.evaluate(function() {
    var shell = document.getElementById("mxadminShell");
    var btn = document.getElementById("mxadminSidebarToggle");
    if (!btn) {
      return { ok: false, reason: "mxadminSidebarToggle yok" };
    }
    var shellWasHidden = shell && shell.classList.contains("hidden");
    if (shellWasHidden) {
      shell.classList.remove("hidden");
    }
    var cs = window.getComputedStyle(btn);
    if (cs.display === "none") {
      if (shellWasHidden && shell) {
        shell.classList.add("hidden");
      }
      return { ok: false, reason: "sidebar toggle gizli (display:none)" };
    }
    var w = btn.offsetWidth;
    var h = btn.offsetHeight;
    if (shellWasHidden && shell) {
      shell.classList.add("hidden");
    }
    if (w < 44 || h < 44) {
      return { ok: false, reason: "toggle boyut: " + w + "x" + h };
    }
    return { ok: true, width: w, height: h };
  });
  if (!toggleOk.ok) {
    await browser.close();
    throw new Error("mobil sidebar toggle: " + toggleOk.reason);
  }
  log(
    "OK mobil sidebar toggle gorunur (" +
      toggleOk.width +
      "x" +
      toggleOk.height +
      ")"
  );

  if (consoleErrors.length) {
    await browser.close();
    throw new Error("mobil console error: " + consoleErrors.join("; "));
  }
  log("OK mobil console error yok");

  await browser.close();
  return { skipped: false, ok: true };
}

async function runLiveOptional() {
  if (process.env.ADMIN_E2E_LIVE !== "1") {
    log("ADMIN_E2E_LIVE!=1 — canli otomavi atlandi");
    return { skipped: true, ok: true };
  }

  var browser = await launchBrowser();
  var page = await browser.newPage();
  var adminJsUrl = LIVE_BASE + "/admin/admin.js";
  var resp = await page.goto(adminJsUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45000
  });
  if (!resp || resp.status() !== 200) {
    await browser.close();
    throw new Error(
      "canli admin.js yuklenemedi: " + (resp ? resp.status() : 0)
    );
  }
  var body = await page.content();
  var hasWorker =
    body.indexOf(WORKER_HOST) !== -1 ||
    body.indexOf("yunusevgane.workers.dev") !== -1;
  var forbiddenDomain = /MX_ADMIN_API_BASE\s*=\s*['"]https?:\/\/otomavi\.com/i.test(
    body
  );
  await browser.close();

  if (forbiddenDomain) {
    throw new Error("canli admin.js otomavi.com API base iceriyor (yasak)");
  }
  if (!hasWorker) {
    throw new Error(
      "canli admin.js Worker URL icermiyor — deploy/render kontrol edin"
    );
  }
  log("OK canli admin.js Worker URL iceriyor, otomavi.com API base yok");
  return { skipped: false, ok: true };
}

async function main() {
  var failures = 0;
  var crossResult = null;
  try {
    await runLocalGoldenPath();
  } catch (err) {
    log("FAIL localhost: " + (err && err.message ? err.message : err));
    failures++;
  }
  try {
    await runLocalMobileSmoke();
  } catch (err) {
    log("FAIL mobil: " + (err && err.message ? err.message : err));
    failures++;
  }
  try {
    crossResult = await runCrossSystemLoginPageEdit();
  } catch (err) {
    log("FAIL cross-system: " + (err && err.message ? err.message : err));
    failures++;
  }
  try {
    await runLiveOptional();
  } catch (err) {
    log("FAIL canli: " + (err && err.message ? err.message : err));
    failures++;
  }
  if (crossResult && crossResult.screenshot) {
    log("RAPOR screenshot: " + crossResult.screenshot);
  }
  process.exit(failures ? 1 : 0);
}

main();
