
var assert = require("assert");
var helpers = require("./helpers");

describe("webmodules/admin API yardimcilari", function() {
  describe("mxAdminUnwrapApiData", function() {
    it("null/undefined aynen doner", function() {
      assert.strictEqual(helpers.mxAdminUnwrapApiData(null), null);
      assert.strictEqual(helpers.mxAdminUnwrapApiData(undefined), undefined);
    });

    it("data nesnesi ic ice JSON ise data doner", function() {
      var inner = { name: "Site", data: [{ path: "kurumsal" }] };
      var wrapped = { collection: "pagesetting", data: inner, sha: "abc" };
      assert.deepStrictEqual(helpers.mxAdminUnwrapApiData(wrapped), inner);
    });

    it("data dizisi ise (login-history) sarmalayici korunur", function() {
      var wrapped = { data: [{ ip: "1.2.3.4", success: true }] };
      assert.deepStrictEqual(helpers.mxAdminUnwrapApiData(wrapped), wrapped);
    });

    it("duz nesne zaten aciksa aynen doner", function() {
      var plain = { domain: "ornek.com" };
      assert.deepStrictEqual(helpers.mxAdminUnwrapApiData(plain), plain);
    });
  });

  describe("mxAdminParsePagesetting", function() {
    it("data eksikse bos dizi ekler", function() {
      var out = helpers.mxAdminParsePagesetting({ collection: "pagesetting" });
      assert.ok(Array.isArray(out.data));
      assert.strictEqual(out.data.length, 0);
    });

    it("sarmalanmis yaniti normalize eder", function() {
      var wrapped = {
        data: {
          data: [
            { path: "kurumsal", name: { tr: "Kurumsal" }, active: true }
          ]
        }
      };
      var out = helpers.mxAdminParsePagesetting(wrapped);
      assert.strictEqual(out.data.length, 1);
      assert.strictEqual(out.data[0].path, "kurumsal");
    });

    it("data string ise bos diziye cevirir", function() {
      var out = helpers.mxAdminParsePagesetting({ data: "invalid" });
      assert.deepStrictEqual(out.data, []);
    });
  });

  describe("mxAdminCountPages", function() {
    it("bos girdi 0", function() {
      assert.strictEqual(helpers.mxAdminCountPages(null), 0);
      assert.strictEqual(helpers.mxAdminCountPages([]), 0);
    });

    it("kategori dokumanlarindan toplam sayfa sayar", function() {
      var docs = [
        { data: [{ id: "p1" }, { id: "p2" }] },
        { data: [{ id: "p3" }] },
        { data: [] }
      ];
      assert.strictEqual(helpers.mxAdminCountPages(docs), 3);
    });

    it("mxAdminCountPagesInDoc gecersiz data 0", function() {
      assert.strictEqual(helpers.mxAdminCountPagesInDoc({}), 0);
      assert.strictEqual(helpers.mxAdminCountPagesInDoc({ data: "x" }), 0);
    });
  });

  describe("mxAdminApiConfigured / mxAdminApiUrl", function() {
    it("placeholder yapilandirilmamis sayilir", function() {
      assert.strictEqual(helpers.mxAdminApiConfigured("{{adminApiUrl}}"), false);
      assert.strictEqual(helpers.mxAdminApiConfigured(""), false);
    });

    it("cozulmus URL yapilandirilmis sayilir", function() {
      assert.strictEqual(helpers.mxAdminApiConfigured("https://api.ornek.com"), true);
    });

    it("apiUrl bos taban veya birlestirme", function() {
      assert.strictEqual(helpers.mxAdminApiUrl("{{adminApiUrl}}", "/api/admin/auth/me"), "");
      assert.strictEqual(
        helpers.mxAdminApiUrl("https://api.ornek.com/", "/api/admin/data/setting"),
        "https://api.ornek.com/api/admin/data/setting"
      );
    });
  });

  describe("mxAdminPickLocalized", function() {
    it("string/number dogrudan doner", function() {
      assert.strictEqual(helpers.mxAdminPickLocalized("Metin", "tr"), "Metin");
      assert.strictEqual(helpers.mxAdminPickLocalized(42, "en"), "42");
    });

    it("lang onceligi tr/en fallback", function() {
      assert.strictEqual(helpers.mxAdminPickLocalized({ tr: "TR", en: "EN" }, "en"), "EN");
      assert.strictEqual(helpers.mxAdminPickLocalized({ tr: "TR", en: "EN" }, "de"), "TR");
    });
  });

  describe("mxAdminEscapeHtml", function() {
    it("ozel karakterleri escape eder", function() {
      assert.strictEqual(
        helpers.mxAdminEscapeHtml('<script>"a"&</script>'),
        "&lt;script&gt;&quot;a&quot;&amp;&lt;/script&gt;"
      );
    });
  });

  describe("mxAdminFilterPages", function() {
    var sample = [
      { id: "a1", path: "hakkimizda", name: { tr: "Hakkımızda" } },
      { id: "b2", path: "iletisim", name: { tr: "İletişim" } }
    ];

    it("bos arama tum listeyi doner", function() {
      assert.strictEqual(helpers.mxAdminFilterPages(sample, "", "tr").length, 2);
    });

    it("path veya isimle filtreler", function() {
      var out = helpers.mxAdminFilterPages(sample, "ilet", "tr");
      assert.strictEqual(out.length, 1);
      assert.strictEqual(out[0].path, "iletisim");
    });

    it("id ile filtreler", function() {
      var out = helpers.mxAdminFilterPages(sample, "a1", "tr");
      assert.strictEqual(out.length, 1);
      assert.strictEqual(out[0].id, "a1");
    });
  });

  describe("mxAdminFormatDevice", function() {
    it("bos UA em dash", function() {
      assert.strictEqual(helpers.mxAdminFormatDevice(""), "—");
      assert.strictEqual(helpers.mxAdminFormatDevice(null), "—");
    });

    it("curl ve Cursor Agent kisa etiket", function() {
      assert.strictEqual(helpers.mxAdminFormatDevice("curl/8.4.0"), "curl");
      assert.strictEqual(
        helpers.mxAdminFormatDevice("Mozilla/5.0 Cursor/1.0 Agent"),
        "Cursor Agent"
      );
    });

    it("Chrome Windows birlesik etiket", function() {
      var ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
      assert.strictEqual(helpers.mxAdminFormatDevice(ua), "Chrome · Windows");
    });

    it("bilinmeyen uzun UA ellipsis", function() {
      var long = "x".repeat(60);
      var out = helpers.mxAdminFormatDevice(long);
      assert.ok(out.length <= 48);
      assert.ok(out.indexOf("…") !== -1);
    });
  });
});
