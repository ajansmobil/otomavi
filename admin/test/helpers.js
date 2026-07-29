/**
 * webmodules/admin test yardimcilari — admin.js saf fonksiyonlarinin bagimsiz kopyasi.
 * admin.js'e export eklenmez; test regresyonu icin burada minimal yeniden yazim.
 */
var fs = require("fs");
var path = require("path");

var ADMIN_ROOT = path.resolve(__dirname, "..");

/** webmodules/admin kaynak kok — webtest/admin/test icinden de ayni hedef */
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

/**
 * API yanit sarmalayicisi: GET /api/admin/data/* → { collection, data: <json>, sha }
 * login-history → { data: [...] } (dizi — unwrap atlanir)
 */
function mxAdminUnwrapApiData(resp) {
  if (!resp) {
    return resp;
  }
  if (resp.data && typeof resp.data === "object" && !Array.isArray(resp.data)) {
    return resp.data;
  }
  return resp;
}

function mxAdminNormalizeCategoryDoc(raw) {
  if (!raw || typeof raw !== "object") {
    return { data: [] };
  }
  if (Array.isArray(raw)) {
    return { data: raw.slice() };
  }
  if (Array.isArray(raw.data)) {
    var first = raw.data.length ? raw.data[0] : null;
    if (
      raw.data.length === 0 ||
      (first && typeof first === "object" && (first.id || first.path || first.name))
    ) {
      var docFromRows = { data: raw.data.slice() };
      if (Array.isArray(raw.desc)) {
        docFromRows.desc = raw.desc;
      }
      if (raw.desing) {
        docFromRows.desing = raw.desing;
      }
      if (raw.modulestatus) {
        docFromRows.modulestatus = raw.modulestatus;
      }
      return docFromRows;
    }
  }
  if (!Array.isArray(raw.data)) {
    raw.data = [];
  }
  return raw;
}

/** pagesetting.json yanitini normalize eder */
function mxAdminParsePagesetting(resp) {
  var ps = mxAdminUnwrapApiData(resp) || {};
  if (!Array.isArray(ps.data)) {
    ps.data = [];
  }
  return ps;
}

/** Tek kategori dokumanindaki sayfa satir sayisi */
function mxAdminCountPagesInDoc(doc) {
  if (!doc) {
    return 0;
  }
  var rows = Array.isArray(doc.data) ? doc.data : [];
  return rows.length;
}

/** Webmaker categoryAddRoute slugify — admin.js ile ayni */
function mxAdminSlugifyCategoryPath(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Tek parca guvenli path segmenti */
function mxAdminSanitizeCategoryPath(raw) {
  var seg = String(raw || "").trim();
  if (!seg) {
    return "";
  }
  seg = seg.replace(/[^a-zA-Z0-9_-]/g, "");
  return seg;
}

function mxAdminCategoryPathExists(pagesettingData, pathVal) {
  var rows =
    pagesettingData && Array.isArray(pagesettingData.data)
      ? pagesettingData.data
      : [];
  var i;
  for (i = 0; i < rows.length; i++) {
    if (rows[i] && rows[i].path === pathVal) {
      return true;
    }
  }
  return false;
}

/** Kategori ekleme dogrulama — { ok, key?, path?, name? } */
function mxAdminValidateCategoryAddInput(name, pathInput, pagesettingData) {
  var trimmedName = String(name || "").trim();
  if (!trimmedName) {
    return { ok: false, key: "categoryNameRequired" };
  }
  var rawPath = pathInput ? String(pathInput).trim() : "";
  if (!rawPath) {
    rawPath = mxAdminSlugifyCategoryPath(trimmedName);
  }
  if (!rawPath) {
    rawPath = "kategori-fallback";
  }
  var categoryPath = mxAdminSanitizeCategoryPath(rawPath);
  if (!categoryPath) {
    return { ok: false, key: "categoryPathInvalid" };
  }
  if (mxAdminCategoryPathExists(pagesettingData, categoryPath)) {
    return { ok: false, key: "categoryPathDuplicate" };
  }
  return { ok: true, path: categoryPath, name: trimmedName };
}

function mxAdminReindexCategories(rows) {
  var i;
  for (i = 0; i < rows.length; i++) {
    rows[i].index = i;
  }
}

/** Kategori dokumanlari dizisinden toplam sayfa sayisi (senkron) */
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

/** Render oncesi {{adminApiUrl}} placeholder yapilandirildi mi */
function mxAdminApiConfigured(apiBase) {
  return !!(apiBase && String(apiBase).indexOf("{{") !== 0);
}

/** API taban + yol birlestirme */
function mxAdminApiUrl(apiBase, pathSuffix) {
  if (!mxAdminApiConfigured(apiBase)) {
    return "";
  }
  return String(apiBase).replace(/\/+$/, "") + pathSuffix;
}

/** localhost / 127.0.0.1 onizleme host mu */
function mxAdminIsLocalPreviewHost(hostname) {
  var host = (hostname || "").toLowerCase();
  return host === "localhost" || host === "127.0.0.1";
}

/**
 * Canli site asset URL — admin.js mxAdminPublicSiteAssetUrl saf kopyasi (test).
 * opts: { origin, apiBase, hostname }
 */
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

/** i18n nesnesi mi — admin.js mxAdminIsI18nObject ile ayni */
function mxAdminIsI18nObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return (
    Object.prototype.hasOwnProperty.call(value, "tr") ||
    Object.prototype.hasOwnProperty.call(value, "en")
  );
}

/**
 * Modul form name input -> record.name + mod.name (i18n korunur).
 * admin.js mxAdminCollectModuleFormValues name blogu ile ayni mantik.
 */
function mxAdminApplyModuleNameFromInput(recordName, modName, lang, inputValue) {
  var safeLang = lang === "en" ? "en" : "tr";
  var record = recordName;
  var mod = modName;
  if (!mxAdminIsI18nObject(record)) {
    if (typeof record === "string" && record) {
      record = { tr: record, en: record };
    } else {
      record = {};
    }
  } else {
    record = Object.assign({}, record);
  }
  record[safeLang] = inputValue;
  if (!mxAdminIsI18nObject(mod)) {
    if (typeof mod === "string" && mod) {
      mod = { tr: mod, en: mod };
    } else {
      mod = {};
    }
  } else {
    mod = Object.assign({}, mod);
  }
  mod[safeLang] = inputValue;
  return { recordName: record, modName: mod };
}

/** i18n alan secimi — admin.js mxAdminPickLocalized ile ayni mantik */
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

/** HTML escape — admin.js mxAdminEscapeHtml ile ayni */
function mxAdminEscapeHtml(value) {
  var str = value == null ? "" : String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** User-Agent → kisa cihaz etiketi — admin.js mxAdminFormatDevice ile ayni */
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

/** Sayfa listesi arama filtresi — admin.js mxAdminGetFilteredPages saf kopyasi */
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

/** desing.colors[] icinden token adi ile renk — admin.js mxAdminFindDesingColorToken */
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

/**
 * desing.json → CSS custom property map — admin.js mxAdminApplySiteTheme saf mantik.
 * dark yoksa lite paleti kullanilir.
 */
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

/** Select chevron SVG data-uri — admin.js mxAdminBuildSelectChevronDataUri */
function mxAdminBuildSelectChevronDataUri(mutedHex) {
  var stroke = String(mutedHex || "a9b0b8").replace(/^#/, "");
  return (
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23" +
    stroke +
    "' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")"
  );
}

/** Paket 153 — sayfa kayit oncesi istemci dogrulama (admin.js ile ayni mantik) */
function mxAdminValidatePageFormFields(pageRow, nameByLang) {
  var pathVal = pageRow && pageRow.path ? String(pageRow.path).trim() : "";
  if (!pathVal) {
    return { ok: false, key: "pageValidationPathEmpty" };
  }
  var hasName = false;
  var lang;
  if (nameByLang && typeof nameByLang === "object") {
    for (lang in nameByLang) {
      if (Object.prototype.hasOwnProperty.call(nameByLang, lang)) {
        if (String(nameByLang[lang] || "").trim()) {
          hasName = true;
          break;
        }
      }
    }
  }
  if (!hasName) {
    return { ok: false, key: "pageValidationNameEmpty" };
  }
  return { ok: true };
}

function mxAdminListRowIncludesText(modulestatus) {
  return !!(modulestatus && modulestatus.detail === false);
}

/** Paket 153 — page-record PUT govdesi (admin.js mxAdminHandlePageFormSubmit ile hizali) */
function mxAdminBuildPageRecordPayload(opts) {
  opts = opts || {};
  var pageRow = opts.pageRow || {};
  var record = opts.record && typeof opts.record === "object" ? opts.record : {};
  var textObj = opts.textObj && typeof opts.textObj === "object" ? opts.textObj : {};
  var keywordObj =
    opts.keywordObj && typeof opts.keywordObj === "object" ? opts.keywordObj : {};
  var descObj = opts.descObj && typeof opts.descObj === "object" ? opts.descObj : {};
  var modulestatus = opts.modulestatus || null;
  var hasDescSchema = !!opts.hasDescSchema;
  var out = record;
  out.id = pageRow.id;
  out.path = pageRow.path;
  if (typeof out.name !== "object" || out.name === null) {
    out.name = pageRow.name;
  }
  if (typeof out.keyword !== "object" || out.keyword === null) {
    out.keyword = {};
  }
  if (typeof out.text !== "object" || out.text === null) {
    out.text = {};
  }
  if (hasDescSchema) {
    out.desc = descObj;
  }
  var detailClosed = mxAdminListRowIncludesText(modulestatus);
  if (detailClosed) {
    if (out.text !== undefined) {
      delete out.text;
    }
  } else {
    var lk;
    for (lk in textObj) {
      if (Object.prototype.hasOwnProperty.call(textObj, lk)) {
        out.text[lk] = textObj[lk];
      }
    }
  }
  for (lk in keywordObj) {
    if (Object.prototype.hasOwnProperty.call(keywordObj, lk)) {
      out.keyword[lk] = keywordObj[lk];
    }
  }
  return out;
}

function readAdminFile(name) {
  return fs.readFileSync(path.join(ADMIN_ROOT, name), "utf8");
}

/** Kategori listesinde path cakismasi — admin.js mxAdminCategoryPagePathTaken ile ayni */
function mxAdminCategoryPagePathTakenInList(pathVal, categoryPages) {
  var list = Array.isArray(categoryPages) ? categoryPages : [];
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] && String(list[i].path || "") === pathVal) {
      return true;
    }
  }
  return false;
}

/** Benzersiz klon path — admin.js mxAdminGenerateUniqueClonePath ile ayni */
function mxAdminGenerateUniqueClonePath(sourcePath, categoryPages) {
  var base = String(sourcePath || "sayfa").trim() || "sayfa";
  var candidate = base + "-kopya";
  var n = 2;
  while (mxAdminCategoryPagePathTakenInList(candidate, categoryPages)) {
    candidate = base + "-kopya" + n;
    n += 1;
  }
  return candidate;
}

/** i18n veya duz metin adina kopya eki — admin.js mxAdminClonePageName ile ayni */
function mxAdminClonePageName(name) {
  var suffixTr = " (kopya)";
  var suffixEn = " (copy)";
  if (mxAdminIsI18nObject(name)) {
    var out = {};
    var lang;
    for (lang in name) {
      if (Object.prototype.hasOwnProperty.call(name, lang)) {
        var suf = lang === "en" ? suffixEn : suffixTr;
        out[lang] = String(name[lang] || "") + suf;
      }
    }
    return out;
  }
  return String(name || "") + suffixTr;
}

/** Kaynak page-record + yeni kimlik alanlari — admin.js mxAdminBuildMergedCloneRecord ile ayni */
function mxAdminBuildMergedCloneRecord(sourceRecord, newPageId, newPath, newName) {
  var merged = {};
  var key;
  if (sourceRecord && typeof sourceRecord === "object") {
    for (key in sourceRecord) {
      if (Object.prototype.hasOwnProperty.call(sourceRecord, key)) {
        merged[key] = sourceRecord[key];
      }
    }
  }
  merged.id = newPageId;
  merged.path = newPath;
  merged.name = newName;
  return merged;
}

/** page-add POST govdesi — admin.js mxAdminClonePage addBody ile ayni */
function mxAdminBuildPageAddCloneBody(pageRow) {
  var row = pageRow || {};
  var addBody = {
    status: row.status || "pause"
  };
  if (row.category !== undefined) {
    addBody.category = row.category;
  }
  return addBody;
}

/**
 * change-password POST govdesi (Paket 172).
 * mustReset: yalniz newPassword; normal oturum: currentPassword + newPassword.
 */
function mxAdminBuildChangePasswordRequestBody(opts) {
  opts = opts || {};
  var body = {
    newPassword: String(opts.newPassword || "")
  };
  if (!opts.mustReset) {
    body.currentPassword = String(opts.currentPassword || "");
  }
  return body;
}

/** mustReset modal istemci dogrulama — admin.js mxAdminHandleMustResetSubmit ile hizali */
function mxAdminValidateMustResetPasswordInput(newPassword, confirmPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, key: "changePasswordTooShort" };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, key: "changePasswordMismatch" };
  }
  return { ok: true };
}

/**
 * HTTP golden path — webtest-live-server uzerinden (auth gerekmez).
 * WEBTEST_API_BASE=http://127.0.0.1:8080/api/admin (varsayilan)
 */
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

/** Paket 201 — siparis durum enum (Worker validateSiparisler ile ayni) */
var MXADMIN_ETICARET_SIPARIS_DURUM = [
  "beklemede",
  "onaylandi",
  "hazirlaniyor",
  "kargoda",
  "tamamlandi",
  "iptal"
];

function mxAdminEticaretIsValidDurum(kod) {
  if (!kod) {
    return true;
  }
  return MXADMIN_ETICARET_SIPARIS_DURUM.indexOf(String(kod)) !== -1;
}

/**
 * Siparis listesi filtre (durum + no/musteri arama) — pack UI ile ayni mantik.
 * @param {Array} data
 * @param {{ durum?: string, q?: string }} opts
 */
function mxAdminEticaretFilterSiparisler(data, opts) {
  var list = Array.isArray(data) ? data : [];
  var durum = opts && opts.durum ? String(opts.durum) : "";
  var q = opts && opts.q ? String(opts.q).toLowerCase().trim() : "";
  var out = [];
  var i;
  for (i = 0; i < list.length; i++) {
    var item = list[i] || {};
    if (durum && item.durum !== durum) {
      continue;
    }
    if (q) {
      var no = String(item.no || "").toLowerCase();
      var musteri = String(item.musteri || "").toLowerCase();
      if (no.indexOf(q) === -1 && musteri.indexOf(q) === -1) {
        continue;
      }
    }
    out.push(item);
  }
  return out;
}

/**
 * setting merge: e-ticaret alanlari yazar; langs/description/keyword korunur.
 */
function mxAdminEticaretMergeSettingFields(base, patch) {
  var setting = {};
  var key;
  var src = base && typeof base === "object" ? base : {};
  for (key in src) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      setting[key] = src[key];
    }
  }
  var fields = [
    "currency",
    "taxRate",
    "freeShipping",
    "shippingFee",
    "freeShippingMin",
    "payCreditCard",
    "payBankTransfer",
    "payCashOnDelivery",
    "paymentGateway",
    "shippingTiers",
    "coupons"
  ];
  var p = patch && typeof patch === "object" ? patch : {};
  var f;
  for (f = 0; f < fields.length; f++) {
    if (Object.prototype.hasOwnProperty.call(p, fields[f])) {
      setting[fields[f]] = p[fields[f]];
    }
  }
  return setting;
}

module.exports = {
  ADMIN_ROOT: ADMIN_ROOT,
  resolveWebmodulesAdminRoot: resolveWebmodulesAdminRoot,
  resolveWebtestAdminRoot: resolveWebtestAdminRoot,
  readWebmodulesAdminFile: readWebmodulesAdminFile,
  readWebtestAdminJsIfExists: readWebtestAdminJsIfExists,
  API_BASE: API_BASE,
  mxAdminUnwrapApiData: mxAdminUnwrapApiData,
  mxAdminNormalizeCategoryDoc: mxAdminNormalizeCategoryDoc,
  mxAdminParsePagesetting: mxAdminParsePagesetting,
  mxAdminCountPagesInDoc: mxAdminCountPagesInDoc,
  mxAdminCountPages: mxAdminCountPages,
  mxAdminSlugifyCategoryPath: mxAdminSlugifyCategoryPath,
  mxAdminSanitizeCategoryPath: mxAdminSanitizeCategoryPath,
  mxAdminCategoryPathExists: mxAdminCategoryPathExists,
  mxAdminValidateCategoryAddInput: mxAdminValidateCategoryAddInput,
  mxAdminReindexCategories: mxAdminReindexCategories,
  mxAdminApiConfigured: mxAdminApiConfigured,
  mxAdminApiUrl: mxAdminApiUrl,
  mxAdminIsLocalPreviewHost: mxAdminIsLocalPreviewHost,
  mxAdminPublicSiteAssetUrl: mxAdminPublicSiteAssetUrl,
  mxAdminPickLocalized: mxAdminPickLocalized,
  mxAdminIsI18nObject: mxAdminIsI18nObject,
  mxAdminApplyModuleNameFromInput: mxAdminApplyModuleNameFromInput,
  mxAdminEscapeHtml: mxAdminEscapeHtml,
  mxAdminFormatDevice: mxAdminFormatDevice,
  mxAdminFilterPages: mxAdminFilterPages,
  mxAdminFindDesingColorToken: mxAdminFindDesingColorToken,
  mxAdminBuildSiteThemeVars: mxAdminBuildSiteThemeVars,
  mxAdminBuildSelectChevronDataUri: mxAdminBuildSelectChevronDataUri,
  mxAdminValidatePageFormFields: mxAdminValidatePageFormFields,
  mxAdminBuildPageRecordPayload: mxAdminBuildPageRecordPayload,
  mxAdminListRowIncludesText: mxAdminListRowIncludesText,
  mxAdminCategoryPagePathTakenInList: mxAdminCategoryPagePathTakenInList,
  mxAdminGenerateUniqueClonePath: mxAdminGenerateUniqueClonePath,
  mxAdminClonePageName: mxAdminClonePageName,
  mxAdminBuildMergedCloneRecord: mxAdminBuildMergedCloneRecord,
  mxAdminBuildPageAddCloneBody: mxAdminBuildPageAddCloneBody,
  mxAdminBuildChangePasswordRequestBody: mxAdminBuildChangePasswordRequestBody,
  mxAdminValidateMustResetPasswordInput: mxAdminValidateMustResetPasswordInput,
  readAdminFile: readAdminFile,
  httpGet: httpGet,
  httpPost: httpPost,
  httpPut: httpPut,
  httpDelete: httpDelete,
  httpRequest: httpRequest,
  parseJsonBody: parseJsonBody,
  isServerUnreachable: isServerUnreachable,
  MXADMIN_ETICARET_SIPARIS_DURUM: MXADMIN_ETICARET_SIPARIS_DURUM,
  mxAdminEticaretIsValidDurum: mxAdminEticaretIsValidDurum,
  mxAdminEticaretFilterSiparisler: mxAdminEticaretFilterSiparisler,
  mxAdminEticaretMergeSettingFields: mxAdminEticaretMergeSettingFields
};
