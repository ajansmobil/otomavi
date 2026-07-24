
var assert = require("assert");
var helpers = require("./helpers");

var BANNED_CLASSES = [
  "mxadmin-modules-grid",
  "mxadmin-color-grid",
  "mxadmin-layout-chips",
  "mxadmin-pages-layout"
];

var CLASS_ALLOW = {
  hidden: true,
  "is-active": true,
  "material-symbols-outlined": true
};


function parseMxAdminI18n(js) {
  var marker = "var MX_ADMIN_I18N = ";
  var start = js.indexOf(marker);
  assert.ok(start !== -1, "MX_ADMIN_I18N tanimi bulunamadi");
  var rest = js.substring(start + marker.length);
  var end = rest.indexOf("\nvar mxAdminState");
  assert.ok(end !== -1, "MX_ADMIN_I18N kapanisi bulunamadi");
  var objStr = rest.substring(0, end).trim();
  if (objStr.charAt(objStr.length - 1) === ";") {
    objStr = objStr.slice(0, -1);
  }
  return new Function("return " + objStr)();
}


function findHexOutsideRoot(css) {
  var rootStart = css.indexOf(":root");
  var rootEnd = -1;
  if (rootStart !== -1) {
    var brace = css.indexOf("{", rootStart);
    var depth = 0;
    var i;
    for (i = brace; i < css.length; i++) {
      if (css.charAt(i) === "{") {
        depth++;
      } else if (css.charAt(i) === "}") {
        depth--;
        if (depth === 0) {
          rootEnd = i + 1;
          break;
        }
      }
    }
  }
  var outside = rootEnd > 0 ? css.substring(rootEnd) : css;
  var hits = [];
  var re = /#([0-9a-fA-F]{3,8})\b/g;
  var m;
  while ((m = re.exec(outside)) !== null) {
    hits.push(m[0]);
  }
  return hits;
}


function stripHtmlComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}


function findHardcodedUiText(html) {
  var issues = [];
  var cleaned = stripHtmlComments(html);
  cleaned = cleaned.replace(/\sdata-mxadmin-i18n-(?:title|aria)="[^"]*"/g, "");
  var reTag = /<([a-zA-Z][^>]*?)>([^<]*)</g;
  var m;
  while ((m = reTag.exec(cleaned)) !== null) {
    var attrs = m[1];
    var inner = (m[2] || "").trim();
    if (!inner) {
      continue;
    }
    if (attrs.indexOf("data-mxadmin-i18n=") !== -1) {
      continue;
    }
    if (/^[\d\s—\-\/\.ENTR]+$/.test(inner)) {
      continue;
    }
    if (/^[a-z_]+$/.test(inner)) {
      continue;
    }
    if (/[A-Za-z\u00C0-\u024F]/.test(inner)) {
      issues.push("metin: \"" + inner.substring(0, 40) + "\"");
    }
  }
  var reAttr = /(?<![\w-])(title|aria-label|placeholder)="([^"]+)"/g;
  while ((m = reAttr.exec(cleaned)) !== null) {
    var val = m[2];
    var matchIdx = m.index;
    var tagStart = cleaned.lastIndexOf("<", matchIdx);
    var tagEnd = cleaned.indexOf(">", matchIdx);
    var tagChunk = tagStart !== -1 && tagEnd !== -1 ? cleaned.substring(tagStart, tagEnd + 1) : "";
    if (m[1] === "placeholder" && tagChunk.indexOf("data-mxadmin-i18n-placeholder=") !== -1) {
      continue;
    }
    if (/^[\d\s—\-\/\.]+$/.test(val)) {
      continue;
    }
    if (/[A-Za-z\u00C0-\u024F]/.test(val)) {
      issues.push(m[1] + ": \"" + val + "\"");
    }
  }
  return issues;
}

describe("webmodules/admin rust-compliance", function() {
  var html;
  var css;
  var js;
  var i18n;

  before(function() {
    html = helpers.readAdminFile("index.html");
    css = helpers.readAdminFile("admin.css");
    js = helpers.readAdminFile("admin.js");
    i18n = parseMxAdminI18n(js);
  });

  describe("prefix", function() {
    it("index.html id degerleri mxadmin ile baslar", function() {
      var re = /\bid="([^"]+)"/g;
      var m;
      var bad = [];
      while ((m = re.exec(html)) !== null) {
        if (m[1].indexOf("mxadmin") !== 0) {
          bad.push(m[1]);
        }
      }
      assert.deepStrictEqual(bad, [], "mxadmin disi id: " + bad.join(", "));
    });

    it("index.html admin siniflari mxadmin- ile baslar (istisnalar haric)", function() {
      var re = /class="([^"]+)"/g;
      var m;
      var bad = [];
      while ((m = re.exec(html)) !== null) {
        var parts = m[1].split(/\s+/);
        var j;
        for (j = 0; j < parts.length; j++) {
          var cls = parts[j];
          if (!cls || CLASS_ALLOW[cls]) {
            continue;
          }
          if (cls.indexOf("mxadmin-") !== 0 && cls.indexOf("mxadmin") !== 0) {
            bad.push(cls);
          }
        }
      }
      assert.deepStrictEqual(bad, [], "izinsiz sinif: " + bad.join(", "));
    });

    it("admin.js public fonksiyonlar mxAdmin prefix", function() {
      var re = /^function\s+([a-zA-Z_$][\w$]*)\s*\(/gm;
      var m;
      var bad = [];
      while ((m = re.exec(js)) !== null) {
        if (m[1].indexOf("mxAdmin") !== 0) {
          bad.push(m[1]);
        }
      }
      assert.deepStrictEqual(bad, [], "mxAdmin disi fonksiyon: " + bad.join(", "));
    });
  });

  describe("MX_ADMIN_I18N", function() {
    it("tr ve en ayni key setine sahip", function() {
      var trKeys = Object.keys(i18n.tr || {}).sort();
      var enKeys = Object.keys(i18n.en || {}).sort();
      assert.deepStrictEqual(trKeys, enKeys, "tr/en key farki");
    });

    it("data-mxadmin-i18n keyleri tr sozlugunde tanimli", function() {
      var re = /data-mxadmin-i18n="([^"]+)"/g;
      var m;
      var missing = [];
      while ((m = re.exec(html)) !== null) {
        if (i18n.tr[m[1]] === undefined) {
          missing.push(m[1]);
        }
      }
      assert.deepStrictEqual(missing, [], "eksik i18n key: " + missing.join(", "));
    });

    it("data-mxadmin-i18n-placeholder keyleri tanimli", function() {
      var re = /data-mxadmin-i18n-placeholder="([^"]+)"/g;
      var m;
      var missing = [];
      while ((m = re.exec(html)) !== null) {
        if (i18n.tr[m[1]] === undefined) {
          missing.push(m[1]);
        }
      }
      assert.deepStrictEqual(missing, [], "eksik placeholder key: " + missing.join(", "));
    });

    it("data-mxadmin-i18n-title keyleri tanimli", function() {
      var re = /data-mxadmin-i18n-title="([^"]+)"/g;
      var m;
      var missing = [];
      while ((m = re.exec(html)) !== null) {
        if (i18n.tr[m[1]] === undefined) {
          missing.push(m[1]);
        }
      }
      assert.deepStrictEqual(missing, [], "eksik title key: " + missing.join(", "));
    });

    it("data-mxadmin-i18n-aria keyleri tanimli", function() {
      var re = /data-mxadmin-i18n-aria="([^"]+)"/g;
      var m;
      var missing = [];
      while ((m = re.exec(html)) !== null) {
        if (i18n.tr[m[1]] === undefined) {
          missing.push(m[1]);
        }
      }
      assert.deepStrictEqual(missing, [], "eksik aria key: " + missing.join(", "));
    });

    it("HTML sabit gorunur metin yok (title istisna)", function() {
      var issues = findHardcodedUiText(html);
      assert.deepStrictEqual(issues, [], "sabit metin: " + issues.join("; "));
    });
  });

  describe("admin.css token", function() {
    it(":root --mxadmin-* tanimlari var", function() {
      assert.ok(css.indexOf(":root") !== -1, ":root blogu");
      assert.ok(/(--mxadmin-[a-zA-Z0-9-]+)\s*:/.test(css), "--mxadmin-* token");
    });

    it(":root disinda ham #hex yok", function() {
      var hexes = findHexOutsideRoot(css);
      assert.deepStrictEqual(hexes, [], "ham hex: " + hexes.join(", "));
    });

    it("@media breakpoint (768 veya 1024)", function() {
      assert.ok(
        css.indexOf("@media (max-width: 768px)") !== -1 ||
          css.indexOf("@media (max-width: 1024px)") !== -1,
        "mobil breakpoint eksik"
      );
    });
  });

  describe("yasak siniflar", function() {
    BANNED_CLASSES.forEach(function(cls) {
      it(cls + " kullanilmiyor", function() {
        assert.strictEqual(html.indexOf(cls), -1, "index.html");
        assert.strictEqual(css.indexOf(cls), -1, "admin.css");
        assert.strictEqual(js.indexOf(cls), -1, "admin.js");
      });
    });
  });

  describe("bagimsizlik (Matrix import yasak)", function() {
    it("index.html icinde /src/modules/ veya public/src script src yok", function() {
      var re = /<script[^>]+src=["']([^"']+)["']/gi;
      var m;
      var bad = [];
      while ((m = re.exec(html)) !== null) {
        var src = m[1];
        if (src.indexOf("/src/modules/") !== -1 || src.indexOf("public/src") !== -1) {
          bad.push(src);
        }
      }
      assert.deepStrictEqual(bad, [], "Matrix modul import: " + bad.join(", "));
    });

    it("admin.js icinde require.*confirmDelete yok", function() {
      assert.ok(!/require\s*\([^)]*confirmDelete/.test(js), "confirmDelete require yasak");
    });

    it("mxAdminConfirmDelete tanimli", function() {
      assert.ok(js.indexOf("function mxAdminConfirmDelete") !== -1, "mxAdminConfirmDelete");
    });

    it("Global_confirmDelete alias satiri var", function() {
      assert.ok(/var Global_confirmDelete\s*=\s*mxAdminConfirmDelete/.test(js), "Global_confirmDelete alias");
    });
  });

  describe("sayfa CRUD rust", function() {
    it("mxAdminAddPage ve mxAdminDeletePage tanimli", function() {
      assert.ok(js.indexOf("function mxAdminAddPage") !== -1, "mxAdminAddPage");
      assert.ok(js.indexOf("function mxAdminDeletePage") !== -1, "mxAdminDeletePage");
    });

    it("mxAdminDeletePage Global_confirmDelete kullanir", function() {
      var start = js.indexOf("function mxAdminDeletePage");
      assert.ok(start !== -1);
      var chunk = js.substring(start, start + 1200);
      assert.ok(chunk.indexOf("Global_confirmDelete") !== -1, "Global_confirmDelete");
    });
  });
});
