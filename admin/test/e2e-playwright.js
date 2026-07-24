
var http = require("http");
var playwright = require("playwright");

var LOCAL_BASE = process.env.ADMIN_E2E_BASE || "http://127.0.0.1:8080";
var LIVE_BASE = "https://otomavi.com";
var WORKER_HOST = "webmaker.yunusevgane.workers.dev";

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
  try {
    await runLocalGoldenPath();
  } catch (err) {
    log("FAIL localhost: " + (err && err.message ? err.message : err));
    failures++;
  }
  try {
    await runLiveOptional();
  } catch (err) {
    log("FAIL canli: " + (err && err.message ? err.message : err));
    failures++;
  }
  process.exit(failures ? 1 : 0);
}

main();
