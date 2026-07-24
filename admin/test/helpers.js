
var fs = require("fs");
var path = require("path");

var ADMIN_ROOT = path.resolve(__dirname, "..");


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

function readAdminFile(name) {
  return fs.readFileSync(path.join(ADMIN_ROOT, name), "utf8");
}

module.exports = {
  ADMIN_ROOT: ADMIN_ROOT,
  mxAdminUnwrapApiData: mxAdminUnwrapApiData,
  mxAdminParsePagesetting: mxAdminParsePagesetting,
  mxAdminCountPagesInDoc: mxAdminCountPagesInDoc,
  mxAdminCountPages: mxAdminCountPages,
  mxAdminApiConfigured: mxAdminApiConfigured,
  mxAdminApiUrl: mxAdminApiUrl,
  mxAdminPickLocalized: mxAdminPickLocalized,
  mxAdminEscapeHtml: mxAdminEscapeHtml,
  mxAdminFormatDevice: mxAdminFormatDevice,
  mxAdminFilterPages: mxAdminFilterPages,
  readAdminFile: readAdminFile
};
