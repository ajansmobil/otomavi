
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

  describe("mxAdminPublicSiteAssetUrl", function() {
    it("canli modda origin + page/ relPath doner (Worker proxy degil)", function() {
      var url = helpers.mxAdminPublicSiteAssetUrl("page/p1/kapak.webp", {
        origin: "https://otomavi.com",
        hostname: "otomavi.com"
      });
      assert.strictEqual(url, "https://otomavi.com/page/p1/kapak.webp");
      assert.ok(url.indexOf("page-media") === -1);
      assert.ok(url.indexOf("workers.dev") === -1);
    });

    it("canli modda img/ modul gorseli origin uzerinden", function() {
      var url = helpers.mxAdminPublicSiteAssetUrl("img/slider1/banner.webp", {
        origin: "https://otomavi.com",
        hostname: "otomavi.com"
      });
      assert.strictEqual(url, "https://otomavi.com/img/slider1/banner.webp");
    });

    it("localhost onizlemede page-media proxy kullanir", function() {
      var url = helpers.mxAdminPublicSiteAssetUrl("page/p1/kapak.webp", {
        hostname: "localhost",
        apiBase: "https://webmaker.yunusevgane.workers.dev"
      });
      assert.strictEqual(
        url,
        "https://webmaker.yunusevgane.workers.dev/api/admin/data/page-media/p1/kapak.webp"
      );
    });

    it("leading slash normalize edilir", function() {
      var url = helpers.mxAdminPublicSiteAssetUrl("/page/p1/a.webp", {
        origin: "https://otomavi.com",
        hostname: "otomavi.com"
      });
      assert.strictEqual(url, "https://otomavi.com/page/p1/a.webp");
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

  describe("mxAdminBuildSiteThemeVars (Paket 142)", function() {
    var mockDesing = {
      colors: {
        dark: [
          { name: "--bg--", value: "#0B1120" },
          { name: "--color1--", value: "#0F172A" },
          { name: "--color2--", value: "#1E293B" },
          { name: "--text--", value: "#E2E8F0" },
          { name: "--button--", value: "#1094DB" }
        ]
      }
    };

    it("dark palette button token primary olur", function() {
      var vars = helpers.mxAdminBuildSiteThemeVars(mockDesing);
      assert.strictEqual(vars["--mxadmin-primary"], "#1094DB");
      assert.strictEqual(vars["--mxadmin-bg"], "#0B1120");
      assert.strictEqual(vars["--mxadmin-text"], "#E2E8F0");
      assert.strictEqual(vars["--mxadmin-panel"], "#0F172A");
      assert.strictEqual(vars["--mxadmin-card"], "#1E293B");
    });

    it("primary soft rgba hesaplanir", function() {
      var vars = helpers.mxAdminBuildSiteThemeVars(mockDesing);
      assert.strictEqual(vars["--mxadmin-primary-soft"], "rgba(16, 148, 219, 0.15)");
    });

    it("gecersiz desing bos map", function() {
      assert.deepStrictEqual(helpers.mxAdminBuildSiteThemeVars(null), {});
      assert.deepStrictEqual(helpers.mxAdminBuildSiteThemeVars({}), {});
    });

    it("select chevron data-uri muted hex kullanir", function() {
      var uri = helpers.mxAdminBuildSelectChevronDataUri("a9b0b8");
      assert.ok(uri.indexOf("%23a9b0b8") !== -1, "stroke hex encoded");
      assert.ok(uri.indexOf("data:image/svg+xml") !== -1);
    });
  });

  describe("mxAdminValidatePageFormFields (Paket 153)", function() {
    it("bos path reddeder", function() {
      var out = helpers.mxAdminValidatePageFormFields({ path: "  " }, { tr: "Ad" });
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "pageValidationPathEmpty");
    });

    it("bos name reddeder", function() {
      var out = helpers.mxAdminValidatePageFormFields(
        { path: "hakkimizda" },
        { tr: " ", en: "" }
      );
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "pageValidationNameEmpty");
    });

    it("gecerli name+path kabul eder", function() {
      var out = helpers.mxAdminValidatePageFormFields(
        { path: "iletisim" },
        { tr: "İletişim" }
      );
      assert.strictEqual(out.ok, true);
    });
  });

  describe("mxAdminBuildPageRecordPayload (Paket 153)", function() {
    it("detail acik kategoride text page-record icine yazilir", function() {
      var payload = helpers.mxAdminBuildPageRecordPayload({
        pageRow: { id: "p1", path: "hakkimizda", name: { tr: "Hakkımızda" } },
        record: { slider: [] },
        textObj: { tr: "<p>Metin</p>" },
        keywordObj: { tr: "anahtar" },
        modulestatus: { detail: true }
      });
      assert.strictEqual(payload.id, "p1");
      assert.deepStrictEqual(payload.text, { tr: "<p>Metin</p>" });
      assert.strictEqual(payload.keyword.tr, "anahtar");
    });

    it("detail kapali kategoride text page-record disinda kalir", function() {
      var payload = helpers.mxAdminBuildPageRecordPayload({
        pageRow: { id: "p2", path: "blog", name: { tr: "Blog" } },
        record: {},
        textObj: { tr: "<p>Liste metni</p>" },
        keywordObj: { tr: "kw" },
        modulestatus: { detail: false }
      });
      assert.strictEqual(payload.text, undefined);
      assert.strictEqual(payload.keyword.tr, "kw");
    });

    it("desc semasi varsa desc nesnesi eklenir", function() {
      var payload = helpers.mxAdminBuildPageRecordPayload({
        pageRow: { id: "p3", path: "urun", name: { tr: "Urun" } },
        record: {},
        descObj: { fiyat: "100" },
        hasDescSchema: true,
        modulestatus: {}
      });
      assert.deepStrictEqual(payload.desc, { fiyat: "100" });
    });
  });

  describe("mxAdminSlugifyCategoryPath / validate (Paket 154)", function() {
    it("turkce karakterleri slugify eder", function() {
      assert.strictEqual(
        helpers.mxAdminSlugifyCategoryPath("Kurumsal Hakkımızda"),
        "kurumsal-hakkimizda"
      );
    });

    it("sanitize gecersiz karakterleri temizler", function() {
      assert.strictEqual(helpers.mxAdminSanitizeCategoryPath("kurumsal"), "kurumsal");
      assert.strictEqual(helpers.mxAdminSanitizeCategoryPath("a/b"), "ab");
      assert.strictEqual(helpers.mxAdminSanitizeCategoryPath(""), "");
    });

    it("bos name reddeder", function() {
      var out = helpers.mxAdminValidateCategoryAddInput("  ", "", { data: [] });
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "categoryNameRequired");
    });

    it("duplicate path reddeder", function() {
      var ps = { data: [{ path: "blog", name: "Blog" }] };
      var out = helpers.mxAdminValidateCategoryAddInput("Yeni", "blog", ps);
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "categoryPathDuplicate");
    });

    it("bos path addan slug uretir", function() {
      var out = helpers.mxAdminValidateCategoryAddInput("Urunler", "", { data: [] });
      assert.strictEqual(out.ok, true);
      assert.strictEqual(out.path, "urunler");
      assert.strictEqual(out.name, "Urunler");
    });

    it("gecersiz path sanitize sonrasi bos ise reddeder", function() {
      var out = helpers.mxAdminValidateCategoryAddInput("Ad", "!!!", { data: [] });
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "categoryPathInvalid");
    });

    it("mxAdminReindexCategories index alanlarini gunceller", function() {
      var rows = [{ path: "a" }, { path: "b" }];
      helpers.mxAdminReindexCategories(rows);
      assert.strictEqual(rows[0].index, 0);
      assert.strictEqual(rows[1].index, 1);
    });
  });

  describe("mxAdminApplyModuleNameFromInput (Paket 172)", function() {
    it("i18n name aktif dilde guncellenir, diger dil korunur", function() {
      var out = helpers.mxAdminApplyModuleNameFromInput(
        { tr: "Slider", en: "Slider EN" },
        { tr: "Slider", en: "Slider EN" },
        "tr",
        "Ana Slider"
      );
      assert.deepStrictEqual(out.recordName, {
        tr: "Ana Slider",
        en: "Slider EN"
      });
      assert.deepStrictEqual(out.modName, {
        tr: "Ana Slider",
        en: "Slider EN"
      });
    });

    it("string name i18n nesnesine migrate edilir", function() {
      var out = helpers.mxAdminApplyModuleNameFromInput(
        "Eski Ad",
        "Eski Ad",
        "en",
        "New Title"
      );
      assert.strictEqual(out.recordName.tr, "Eski Ad");
      assert.strictEqual(out.recordName.en, "New Title");
      assert.strictEqual(out.modName.en, "New Title");
    });

    it("bos name yeni i18n nesnesi olusturur", function() {
      var out = helpers.mxAdminApplyModuleNameFromInput("", "", "tr", "Yeni");
      assert.deepStrictEqual(out.recordName, { tr: "Yeni" });
      assert.deepStrictEqual(out.modName, { tr: "Yeni" });
    });
  });

  describe("workerSchemaValidate (Paket 161)", function() {
    var workerSchema = null;

    before(async function() {
      workerSchema = await import(
        "../../backend/cloudflare/src/schemaValidate.js"
      );
    });

    it("pagesetting kok pages anahtarini 400 semasi ile reddeder", function() {
      var errMsg = workerSchema.workerValidateByCollection("pagesetting", {
        pages: []
      });
      assert.ok(errMsg && errMsg.indexOf("[VALIDATION]") === 0);
      assert.ok(errMsg.indexOf("pages") !== -1);
    });

    it("gecerli pagesetting kabul edilir", function() {
      var errMsg = workerSchema.workerValidateByCollection("pagesetting", {
        data: [{ path: "kurumsal", name: { tr: "Kurumsal" } }]
      });
      assert.strictEqual(errMsg, null);
    });

    it("setting yasak alan (permissions) reddedilir", function() {
      var body = {
        langs: { tr: true },
        description: { tr: "Aciklama" },
        keyword: { tr: "anahtar" },
        permissions: []
      };
      var errMsg = workerSchema.workerValidateByCollection("setting", body);
      assert.ok(errMsg && errMsg.indexOf("permissions") !== -1);
    });

    it("modules satirinda id/local/path zorunludur", function() {
      var errMsg = workerSchema.workerValidateByCollection("modules", {
        data: [{ img: "slider.webp" }]
      });
      assert.ok(errMsg && errMsg.indexOf("modules.data[0].id") !== -1);
    });

    it("desing yasak features alani reddedilir", function() {
      var errMsg = workerSchema.workerValidateByCollection("desing", {
        colors: { dark: [] },
        features: []
      });
      assert.ok(errMsg && errMsg.indexOf("features") !== -1);
    });

    it("page-record yasak api_endpoints reddedilir", function() {
      var errMsg = workerSchema.workerValidatePageRecord({
        id: "p1",
        api_endpoints: []
      });
      assert.ok(errMsg && errMsg.indexOf("api_endpoints") !== -1);
    });

    it("gecerli page-record kabul edilir", function() {
      var errMsg = workerSchema.workerValidatePageRecord({
        id: "p1",
        text: { tr: "<p>Metin</p>" }
      });
      assert.strictEqual(errMsg, null);
    });

    it("siparisler gecerli payload kabul edilir (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("siparisler", {
        data: [{ no: "ORD-1", durum: "beklemede" }]
      });
      assert.strictEqual(errMsg, null);
    });

    it("siparisler durum olmadan no ile kabul edilir (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("siparisler", {
        data: [{ no: "ORD-2", musteri: "Ali" }]
      });
      assert.strictEqual(errMsg, null);
    });

    it("siparisler bos data[] kabul edilir (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("siparisler", {
        data: []
      });
      assert.strictEqual(errMsg, null);
    });

    it("siparisler data yok / dizi degil reddedilir (Paket 200)", function() {
      var missing = workerSchema.workerValidateByCollection("siparisler", {
        items: []
      });
      assert.ok(missing && missing.indexOf("[VALIDATION]") === 0);
      assert.ok(missing.indexOf("data") !== -1);
      var notArr = workerSchema.workerValidateByCollection("siparisler", {
        data: {}
      });
      assert.ok(notArr && notArr.indexOf("[VALIDATION]") === 0);
      assert.ok(notArr.indexOf("data") !== -1);
      var asArr = workerSchema.workerValidateByCollection("siparisler", []);
      assert.ok(asArr && asArr.indexOf("[VALIDATION]") === 0);
    });

    it("siparisler bos no reddedilir (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("siparisler", {
        data: [{ no: "  ", durum: "beklemede" }]
      });
      assert.ok(errMsg && errMsg.indexOf("[VALIDATION]") === 0);
      assert.ok(errMsg.indexOf("no") !== -1);
    });

    it("siparisler gecersiz durum reddedilir (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("siparisler", {
        data: [{ no: "ORD-1", durum: "xyz" }]
      });
      assert.ok(errMsg && errMsg.indexOf("[VALIDATION]") === 0);
      assert.ok(errMsg.indexOf("durum") !== -1);
    });

    it("siparisler yasak kok alan reddedilir (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("siparisler", {
        data: [{ no: "ORD-1", durum: "iptal" }],
        permissions: []
      });
      assert.ok(errMsg && errMsg.indexOf("permissions") !== -1);
    });

    it("orders collection adi reddedilir — siparisler kullanin (Paket 200)", function() {
      var errMsg = workerSchema.workerValidateByCollection("orders", {
        data: [{ no: "ORD-1", durum: "beklemede" }]
      });
      assert.ok(errMsg && errMsg.indexOf("[VALIDATION]") === 0);
      assert.ok(errMsg.indexOf("orders kullanilmaz") !== -1);
      assert.ok(errMsg.indexOf("siparisler") !== -1);
    });

    it("Worker public siparisler route kayitli (Paket 205 smoke)", function() {
      var fs = require("fs");
      var path = require("path");
      var workerSrc = fs.readFileSync(
        path.join(__dirname, "../../backend/cloudflare/src/index.js"),
        "utf8"
      );
      assert.ok(
        workerSrc.indexOf("/api/public/siparisler") !== -1,
        "public siparisler path"
      );
      assert.ok(
        workerSrc.indexOf("handlePublicPostSiparisler") !== -1,
        "public handler"
      );
      assert.ok(
        workerSrc.indexOf("resolvePublicSiparisSite") !== -1,
        "Origin site gate"
      );
    });
  });

  describe("mxAdminBuildChangePasswordRequestBody (Paket 172/175)", function() {
    it("mustReset modunda yalniz newPassword gonderilir", function() {
      var body = helpers.mxAdminBuildChangePasswordRequestBody({
        mustReset: true,
        newPassword: "YeniSifre123"
      });
      assert.deepStrictEqual(body, { newPassword: "YeniSifre123" });
      assert.strictEqual(body.currentPassword, undefined);
    });

    it("normal oturumda currentPassword + newPassword", function() {
      var body = helpers.mxAdminBuildChangePasswordRequestBody({
        mustReset: false,
        currentPassword: "Eski123",
        newPassword: "Yeni456"
      });
      assert.deepStrictEqual(body, {
        currentPassword: "Eski123",
        newPassword: "Yeni456"
      });
    });

    it("mxAdminValidateMustResetPasswordInput kisa sifreyi reddeder", function() {
      var out = helpers.mxAdminValidateMustResetPasswordInput("abc", "abc");
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "changePasswordTooShort");
    });

    it("mxAdminValidateMustResetPasswordInput uyumsuz tekrari reddeder", function() {
      var out = helpers.mxAdminValidateMustResetPasswordInput("abcdef", "abcdeg");
      assert.strictEqual(out.ok, false);
      assert.strictEqual(out.key, "changePasswordMismatch");
    });

    it("mxAdminValidateMustResetPasswordInput gecerli cifti kabul eder", function() {
      var out = helpers.mxAdminValidateMustResetPasswordInput("abcdef", "abcdef");
      assert.strictEqual(out.ok, true);
    });
  });

  describe("mxAdmin page clone payload (Paket 173/175)", function() {
    it("mxAdminClonePageName i18n adlara dil bazli kopya eki ekler", function() {
      var out = helpers.mxAdminClonePageName({ tr: "Hakkımızda", en: "About" });
      assert.strictEqual(out.tr, "Hakkımızda (kopya)");
      assert.strictEqual(out.en, "About (copy)");
    });

    it("mxAdminClonePageName duz string ad icin TR suffix kullanir", function() {
      assert.strictEqual(helpers.mxAdminClonePageName("Blog"), "Blog (kopya)");
    });

    it("mxAdminGenerateUniqueClonePath cakismada -kopya2 uretir", function() {
      var pages = [{ path: "hakkimizda-kopya" }];
      assert.strictEqual(
        helpers.mxAdminGenerateUniqueClonePath("hakkimizda", pages),
        "hakkimizda-kopya2"
      );
    });

    it("mxAdminBuildMergedCloneRecord kaynak alanlari korur ve kimlik gunceller", function() {
      var merged = helpers.mxAdminBuildMergedCloneRecord(
        { id: "p1", path: "blog", text: { tr: "<p>A</p>" }, slider: [] },
        "p2",
        "blog-kopya",
        { tr: "Blog (kopya)" }
      );
      assert.strictEqual(merged.id, "p2");
      assert.strictEqual(merged.path, "blog-kopya");
      assert.deepStrictEqual(merged.name, { tr: "Blog (kopya)" });
      assert.deepStrictEqual(merged.text, { tr: "<p>A</p>" });
      assert.ok(Array.isArray(merged.slider));
    });

    it("mxAdminBuildPageAddCloneBody status ve category tasir", function() {
      var body = helpers.mxAdminBuildPageAddCloneBody({
        status: "play",
        category: "kurumsal"
      });
      assert.deepStrictEqual(body, { status: "play", category: "kurumsal" });
    });

    it("mxAdminBuildPageAddCloneBody varsayilan status pause", function() {
      assert.deepStrictEqual(helpers.mxAdminBuildPageAddCloneBody({}), { status: "pause" });
    });
  });
});
