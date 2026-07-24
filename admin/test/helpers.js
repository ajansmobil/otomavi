
var fs = require("fs");
var path = require("path");

var ADMIN_ROOT = path.resolve(__dirname, "..");


function resolveWebmodulesAdminRoot() {
  var normalized = ADMIN_ROOT.replace(/\\/g, "/");
  if (normalized.indexOf("/webmodules/admin") !== -1) {
    return ADMIN_ROOT;
  }
  return path.resolve(__dirname, "../../../webmodules/admin");
}

function resolveWebtestAdminRoot() {
  var normalized = ADMIN_ROOT.replace(/\\/g, "/");
  if (normalized.indexOf("/webtest/admin") !== -1) {
    return ADMIN_ROOT;
  }
  return path.resolve(__dirname, "../../../webtest/admin");
}

function readWebmodulesAdminFile(name) {
  return fs.readFileSync(path.join(resolveWebmodulesAdminRoot(), name), "utf8");
}

function readWebtestAdminJsIfExists() {
  var jsPath = path.join(resolveWebtestAdminRoot(), "admin.js");
  if (!fs.existsSync(jsPath)) {
    return null;
  }
  return fs.readFileSync(jsPath, "utf8");
}


function mxAdminUnwrapApiData(resp) {
  if (!resp) {
    return resp;
  }
  if (resp.data && typeof resp.data === "object" && !Array.isArray(resp.data)) {
    return resp.data;
  }
  return resp;
}


function mxAdminParsePagesetting(resp) {
  var ps = mxAdminUnwrapApiData(resp) || {};
  if (!Array.isArray(ps.data)) {
    ps.data = [];
  }
  return ps;
}


function mxAdminCountPagesInDoc(doc) {
  if (!doc) {
    return 0;
  }
  var rows = Array.isArray(doc.data) ? doc.data : [];
  return rows.length;
}


function mxAdminCountPages(categoryDocs) {
  var total = 0;
  var i;
  if (!categoryDocs || !categoryDocs.length) {
    return 0;
  }
  for (i = 0; i < categoryDocs.length; i++) {
    total += mxAdminCountPagesInDoc(categoryDocs[i]);
  }
  return total;
}


function mxAdminApiConfigured(apiBase) {
  return !!(apiBase && String(apiBase).indexOf("{{") !== 0);
}


function mxAdminApiUrl(apiBase, pathSuffix) {
  if (!mxAdminApiConfigured(apiBase)) {
    return "";
  }
  return String(apiBase).replace(/\/+$/, "") + pathSuffix;
}


function mxAdminIsLocalPreviewHost(hostname) {
  var host = (hostname || "").toLowerCase();
  return host === "localhost" || host === "127.0.0.1";
}


function mxAdminPublicSiteAssetUrl(relPath, opts) {
  opts = opts || {};
  var path = String(relPath || "").replace(/^\/+/, "");
  var hostname = opts.hostname != null ? String(opts.hostname) : "otomavi.com";
  var origin =
    opts.origin != null
      ? String(opts.origin).replace(/\/+$/, "")
      : "https://otomavi.com";
  var apiBase =
    opts.apiBase != null
      ? String(opts.apiBase)
      : "https://webmaker.yunusevgane.workers.dev";

  if (mxAdminIsLocalPreviewHost(hostname)) {
    var segments = path.split("/");
    if (segments[0] === "page" && segments.length >= 3) {
      return mxAdminApiUrl(
        apiBase,
        "/api/admin/data/page-media/" +
          encodeURIComponent(segments[1]) +
          "/" +
          encodeURIComponent(segments.slice(2).join("/"))
      );
    }
    if (segments[0] === "img" && segments.length >= 3) {
      return mxAdminApiUrl(
        apiBase,
        "/api/admin/data/module-media/" +
          encodeURIComponent(segments[1]) +
          "/" +
          encodeURIComponent(segments.slice(2).join("/"))
      );
    }
  }
  return origin + "/" + path;
}


function mxAdminPickLocalized(obj, lang) {
  if (obj == null) {
    return "";
  }
  if (typeof obj === "string" || typeof obj === "number") {
    return String(obj);
  }
  if (typeof obj === "object") {
    if (obj[lang]) {
      return String(obj[lang]);
    }
    if (obj.tr) {
      return String(obj.tr);
    }
    if (obj.en) {
      return String(obj.en);
    }
    var key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
        return String(obj[key]);
      }
    }
  }
  return "";
}


function mxAdminEscapeHtml(value) {
  var str = value == null ? "" : String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


function mxAdminFormatDevice(ua) {
  if (!ua) {
    return "—";
  }
  var s = String(ua);
  var lower = s.toLowerCase();
  if (lower.indexOf("curl/") !== -1 || lower.indexOf("curl ") === 0 || lower === "curl") {
    return "curl";
  }
  if (lower.indexOf("cursor") !== -1) {
    return "Cursor Agent";
  }
  if (lower.indexOf("postman") !== -1) {
    return "Postman";
  }
  if (lower.indexOf("insomnia") !== -1) {
    return "Insomnia";
  }
  var browser = "";
  if (lower.indexOf("edg/") !== -1 || lower.indexOf("edge/") !== -1) {
    browser = "Edge";
  } else if (lower.indexOf("firefox/") !== -1) {
    browser = "Firefox";
  } else if (lower.indexOf("chrome/") !== -1 || lower.indexOf("crios/") !== -1) {
    browser = "Chrome";
  } else if (lower.indexOf("safari/") !== -1 && lower.indexOf("chrome") === -1) {
    browser = "Safari";
  }
  var os = "";
  if (lower.indexOf("windows") !== -1) {
    os = "Windows";
  } else if (lower.indexOf("mac os") !== -1 || lower.indexOf("macintosh") !== -1) {
    os = "macOS";
  } else if (lower.indexOf("android") !== -1) {
    os = "Android";
  } else if (lower.indexOf("iphone") !== -1 || lower.indexOf("ipad") !== -1) {
    os = "iOS";
  } else if (lower.indexOf("linux") !== -1) {
    os = "Linux";
  }
  if (browser && os) {
    return browser + " · " + os;
  }
  if (browser) {
    return browser;
  }
  if (os) {
    return os;
  }
  if (s.length > 48) {
    return s.substring(0, 45) + "…";
  }
  return s;
}


function mxAdminFilterPages(list, searchQuery, lang) {
  var q = (searchQuery || "").toLowerCase().trim();
  if (!q) {
    return list || [];
  }
  var out = [];
  var i;
  for (i = 0; i < (list || []).length; i++) {
    var page = list[i] || {};
    var name = mxAdminPickLocalized(page.name, lang).toLowerCase();
    var ppath = (page.path || "").toLowerCase();
    var pid = (page.id || "").toLowerCase();
    if (name.indexOf(q) !== -1 || ppath.indexOf(q) !== -1 || pid.indexOf(q) !== -1) {
      out.push(page);
    }
  }
  return out;
}


function mxAdminFindDesingColorToken(colorsArr, tokenName) {
  if (!Array.isArray(colorsArr)) {
    return null;
  }
  var i;
  for (i = 0; i < colorsArr.length; i++) {
    var row = colorsArr[i];
    if (row && row.name === tokenName && row.value) {
      return String(row.value);
    }
  }
  return null;
}

function mxAdminHexToRgb(hex) {
  var h = String(hex || "").replace(/^#/, "").trim();
  if (h.length === 3) {
    h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
  }
  if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) {
    return null;
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  };
}

function mxAdminColorWithAlpha(hex, alpha) {
  var rgb = mxAdminHexToRgb(hex);
  if (!rgb) {
    return hex;
  }
  return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}


function mxAdminBuildSiteThemeVars(desingDoc) {
  var out = {};
  if (!desingDoc || typeof desingDoc !== "object") {
    return out;
  }
  var colors = desingDoc.colors || {};
  var palette = colors.dark && colors.dark.length ? colors.dark : colors.lite;
  if (!palette || !palette.length) {
    return out;
  }
  var primary = mxAdminFindDesingColorToken(palette, "--button--");
  var bg = mxAdminFindDesingColorToken(palette, "--bg--");
  var text = mxAdminFindDesingColorToken(palette, "--text--");
  var color1 = mxAdminFindDesingColorToken(palette, "--color1--");
  var color2 = mxAdminFindDesingColorToken(palette, "--color2--");
  if (primary) {
    out["--mxadmin-primary"] = primary;
    out["--mxadmin-primary-soft"] = mxAdminColorWithAlpha(primary, 0.15);
    out["--mxadmin-primary-glow"] = mxAdminColorWithAlpha(primary, 0.35);
  }
  if (bg) {
    out["--mxadmin-bg"] = bg;
    out["--mxadmin-panel"] = color1 || bg;
    out["--mxadmin-card"] = color2 || bg;
  }
  if (text) {
    out["--mxadmin-text"] = text;
  }
  if (color2) {
    out["--mxadmin-card-hover"] = color2;
  }
  return out;
}


function mxAdminBuildSelectChevronDataUri(mutedHex) {
  var stroke = String(mutedHex || "a9b0b8").replace(/^#/, "");
  return (
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23" +
    stroke +
    "' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")"
  );
}

function readAdminFile(name) {
  return fs.readFileSync(path.join(ADMIN_ROOT, name), "utf8");
}


var http = require("http");

var API_BASE = process.env.WEBTEST_API_BASE || "http://127.0.0.1:8080/api/admin";

function httpRequest(method, urlPath, bodyObj, timeoutMs) {
  var ms = typeof timeoutMs === "number" ? timeoutMs : 30000;
  return new Promise(function(resolve, reject) {
    var base = API_BASE.replace(/\/$/, "");
    var pathPart = urlPath.charAt(0) === "/" ? urlPath : "/" + urlPath;
    var full = base + pathPart;
    var u = new URL(full);
    var bodyStr = "";
    var headers = {};
    if (bodyObj && (method === "POST" || method === "PUT" || method === "PATCH")) {
      bodyStr = JSON.stringify(bodyObj);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(bodyStr);
    }
    var req = http.request(
      {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.pathname + u.search,
        method: method,
        headers: headers
      },
      function(res) {
        var chunks = [];
        res.on("data", function(c) {
          chunks.push(c);
        });
        res.on("end", function() {
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") });
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(ms, function() {
      req.destroy(new Error(method + " timeout: " + urlPath));
    });
    if (bodyStr) {
      req.write(bodyStr);
    }
    req.end();
  });
}

function httpGet(urlPath, timeoutMs) {
  return httpRequest("GET", urlPath, null, timeoutMs);
}

function httpPost(urlPath, bodyObj, timeoutMs) {
  return httpRequest("POST", urlPath, bodyObj, timeoutMs);
}

function httpPut(urlPath, bodyObj, timeoutMs) {
  return httpRequest("PUT", urlPath, bodyObj, timeoutMs);
}

function httpDelete(urlPath, timeoutMs) {
  return httpRequest("DELETE", urlPath, null, timeoutMs);
}

function parseJsonBody(res) {
  var b = String(res.body || "").trim();
  if (!b || b.indexOf("<!DOCTYPE") === 0 || b.indexOf("<html") === 0) {
    return null;
  }
  try {
    return JSON.parse(b);
  } catch (_e) {
    return null;
  }
}

function isServerUnreachable(err) {
  return err && (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND");
}

module.exports = {
  ADMIN_ROOT: ADMIN_ROOT,
  resolveWebmodulesAdminRoot: resolveWebmodulesAdminRoot,
  resolveWebtestAdminRoot: resolveWebtestAdminRoot,
  readWebmodulesAdminFile: readWebmodulesAdminFile,
  readWebtestAdminJsIfExists: readWebtestAdminJsIfExists,
  API_BASE: API_BASE,
  mxAdminUnwrapApiData: mxAdminUnwrapApiData,
  mxAdminParsePagesetting: mxAdminParsePagesetting,
  mxAdminCountPagesInDoc: mxAdminCountPagesInDoc,
  mxAdminCountPages: mxAdminCountPages,
  mxAdminApiConfigured: mxAdminApiConfigured,
  mxAdminApiUrl: mxAdminApiUrl,
  mxAdminIsLocalPreviewHost: mxAdminIsLocalPreviewHost,
  mxAdminPublicSiteAssetUrl: mxAdminPublicSiteAssetUrl,
  mxAdminPickLocalized: mxAdminPickLocalized,
  mxAdminEscapeHtml: mxAdminEscapeHtml,
  mxAdminFormatDevice: mxAdminFormatDevice,
  mxAdminFilterPages: mxAdminFilterPages,
  mxAdminFindDesingColorToken: mxAdminFindDesingColorToken,
  mxAdminBuildSiteThemeVars: mxAdminBuildSiteThemeVars,
  mxAdminBuildSelectChevronDataUri: mxAdminBuildSelectChevronDataUri,
  readAdminFile: readAdminFile,
  httpGet: httpGet,
  httpPost: httpPost,
  httpPut: httpPut,
  httpDelete: httpDelete,
  httpRequest: httpRequest,
  parseJsonBody: parseJsonBody,
  isServerUnreachable: isServerUnreachable
};
