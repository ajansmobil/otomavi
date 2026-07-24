
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var helpers = require("./helpers");

var ADMIN_ROOT = helpers.ADMIN_ROOT;

var REQUIRED_SCREEN_IDS = [
  "mxadminScreenLogin",
  "mxadminShell",
  "mxadminScreenDashboard",
  "mxadminScreenCategories",
  "mxadminScreenPages",
  "mxadminScreenModules",
  "mxadminScreenSettings",
  "mxadminScreenDesign"
];

var REQUIRED_NAV_SCREENS = ["dashboard", "modules", "settings", "design"];

var DASHBOARD_IDS = [
  "mxadminCardDomainValue",
  "mxadminCardUsernameValue",
  "mxadminCardCategoriesValue",
  "mxadminCardPagesValue",
  "mxadminHistoryTable"
];

describe("webmodules/admin dosya yapisi", function() {
  it("index.html, admin.css, admin.js mevcut", function() {
    ["index.html", "admin.css", "admin.js"].forEach(function(name) {
      assert.ok(fs.existsSync(path.join(ADMIN_ROOT, name)), name + " olmali");
    });
  });

  it("admin.css bos degil", function() {
    var css = helpers.readAdminFile("admin.css");
    assert.ok(css.replace(/\s/g, "").length > 100, "admin.css yeterli icerik");
  });

  it("Paket 116: scrollbar ve overscroll standardi", function() {
    var css = helpers.readAdminFile("admin.css");
    assert.ok(css.indexOf("overscroll-behavior") !== -1, "overscroll kontrolu");
    assert.ok(css.indexOf("mxadmin-scroll-y") !== -1, "gizli scroll yardimcisi");
    assert.ok(css.indexOf(".mxadmin-sidebar-nav") !== -1 && css.indexOf("overflow: hidden") !== -1, "sidebar nav scrollbar kaldirildi");
  });

  it("Paket 117: css.css global sizinti korumasi", function() {
    var css = helpers.readAdminFile("admin.css");
    assert.ok(css.indexOf(".mxadmin-app div") !== -1 && css.indexOf("float: none") !== -1, "div float reset");
    assert.ok(css.indexOf(".mxadmin-page-move-btn") !== -1, "Paket 120: sayfa sira butonlari");
    assert.ok(css.indexOf(".mxadmin-pages-workspace.is-detail-open .mxadmin-pages-list-panel") !== -1, "Paket 121: stack navigasyon");
    assert.ok(css.indexOf(".mxadmin-html-editor") !== -1, "Paket 122: HTML editor CSS");
    assert.ok(css.indexOf("#mxadminLoginForm .mxadmin-btn-primary") !== -1, "login buton genisligi");
  });
});

describe("webmodules/admin index.html ekran iskeleti", function() {
  var html;

  before(function() {
    html = helpers.readAdminFile("index.html");
  });

  REQUIRED_SCREEN_IDS.forEach(function(id) {
    it("id=" + id + " mevcut", function() {
      assert.ok(html.indexOf('id="' + id + '"') !== -1, id + " eksik");
    });
  });

  REQUIRED_NAV_SCREENS.forEach(function(screen) {
    it('nav data-mxadmin-screen="' + screen + '"', function() {
      assert.ok(
        html.indexOf('data-mxadmin-screen="' + screen + '"') !== -1,
        "nav " + screen + " eksik"
      );
    });
  });

  DASHBOARD_IDS.forEach(function(id) {
    it("dashboard id=" + id, function() {
      assert.ok(html.indexOf('id="' + id + '"') !== -1, id + " eksik");
    });
  });

  it("mxadmin prefix siniflari kullanilir", function() {
    assert.ok(html.indexOf("mxadmin-app") !== -1);
    assert.ok(html.indexOf("mxadmin-nav-btn") !== -1);
    assert.ok(html.indexOf("mxadmin-sidebar") !== -1);
  });

  it("Paket 105: login bg, user chip, quick actions, mobil drawer", function() {
    assert.ok(html.indexOf('class="mxadmin-login-bg"') !== -1, "mxadmin-login-bg eksik");
    assert.ok(html.indexOf('id="mxadminPasswordToggle"') !== -1, "mxadminPasswordToggle eksik");
    assert.ok(html.indexOf('mxadmin-password-field') !== -1, "mxadmin-password-field eksik");
    assert.ok(html.indexOf('id="mxadminUserChip"') !== -1, "mxadminUserChip eksik");
    assert.ok(html.indexOf('id="mxadminUserChipDomain"') !== -1, "mxadminUserChipDomain eksik");
    assert.ok(html.indexOf('id="mxadminUserChipName"') !== -1, "mxadminUserChipName eksik");
    assert.ok(html.indexOf('id="mxadminQuickActions"') !== -1, "mxadminQuickActions eksik");
    assert.ok(html.indexOf('id="mxadminQuickPages"') !== -1, "mxadminQuickPages eksik");
    assert.ok(html.indexOf('id="mxadminSidebarToggle"') !== -1, "mxadminSidebarToggle eksik");
    assert.ok(html.indexOf('id="mxadminSidebarOverlay"') !== -1, "mxadminSidebarOverlay eksik");
  });

  it("admin.css ve admin.js mutlak /admin/ yolu", function() {
    assert.ok(html.indexOf('href="/admin/admin.css"') !== -1);
    assert.ok(html.indexOf('src="/admin/admin.js"') !== -1);
    var cssPos = html.indexOf('href="/src/css.css"');
    var adminCssPos = html.indexOf('href="/admin/admin.css"');
    assert.ok(cssPos !== -1 && adminCssPos > cssPos, "css.css admin.css'ten once yuklenmeli (Paket 117)");
  });

  it("kategoriler formu ve sayfa editoru", function() {
    assert.ok(html.indexOf('id="mxadminCategoriesForm"') !== -1);
    assert.ok(html.indexOf('id="mxadminCategoriesBody"') !== -1);
    assert.ok(html.indexOf('id="mxadminPageForm"') !== -1);
    assert.ok(html.indexOf('id="mxadminPageDescPanel"') !== -1, "mxadminPageDescPanel eksik");
    assert.ok(html.indexOf('id="mxadminPageDescFields"') !== -1, "mxadminPageDescFields eksik");
    assert.ok(html.indexOf('id="mxadminPageMediaPanel"') !== -1, "Paket 119: mxadminPageMediaPanel eksik");
    assert.ok(html.indexOf('id="mxadminPageMediaGrid"') !== -1, "Paket 119: mxadminPageMediaGrid eksik");
    assert.ok(html.indexOf('id="mxadminPagesList"') !== -1);
    assert.ok(html.indexOf('id="mxadminPagesFilters"') !== -1, "Paket 125: mxadminPagesFilters eksik");
  });

  it("ayarlar ve tasarim formlari", function() {
    assert.ok(html.indexOf('id="mxadminSettingsForm"') !== -1);
    assert.ok(html.indexOf('id="mxadminSettingLogoPreview"') !== -1);
    assert.ok(html.indexOf('id="mxadminDesignForm"') !== -1);
    assert.ok(html.indexOf('id="mxadminDesignLite"') !== -1);
    assert.ok(html.indexOf('id="mxadminDesignDark"') !== -1);
  });

  it("Paket 108: moduller master/detail editor", function() {
    assert.ok(html.indexOf('id="mxadminScreenModules"') !== -1);
    assert.ok(html.indexOf('id="mxadminModulesGrid"') === -1, "mxadminModulesGrid kaldirilmali");
    assert.ok(html.indexOf('id="mxadminModulesTable"') === -1, "mxadminModulesTable kaldirilmali");
    assert.ok(html.indexOf('id="mxadminModulesWorkspace"') !== -1, "mxadminModulesWorkspace eksik");
    assert.ok(html.indexOf('id="mxadminModulesList"') !== -1, "mxadminModulesList eksik");
    assert.ok(html.indexOf('id="mxadminModuleForm"') !== -1, "mxadminModuleForm eksik");
    assert.ok(html.indexOf('id="mxadminModuleMediaGrid"') !== -1, "mxadminModuleMediaGrid eksik");
    assert.ok(html.indexOf('id="mxadminModulesSearch"') !== -1, "mxadminModulesSearch eksik");
    assert.ok(html.indexOf('id="mxadminModulesMeta"') !== -1, "mxadminModulesMeta eksik");
    assert.ok(html.indexOf('data-mxadmin-screen="modules"') !== -1);
  });

  it("yan sidebar pagesetting kategori listesi (webmaker gibi)", function() {
    assert.ok(html.indexOf('id="mxadminSidebarCategories"') !== -1, "mxadminSidebarCategories eksik");
    assert.ok(html.indexOf('id="mxadminCategoriesEditBtn"') !== -1, "mxadminCategoriesEditBtn eksik");
    assert.ok(html.indexOf('id="mxadminPagesCategoryTitle"') !== -1, "mxadminPagesCategoryTitle eksik");
    assert.ok(html.indexOf('id="mxadminCategoryTabs"') === -1, "mxadminCategoryTabs kaldirilmali");
    assert.ok(html.indexOf('data-mxadmin-screen="categories"') === -1, "nav categories kaldirilmali");
    assert.ok(html.indexOf('data-mxadmin-screen="pages"') === -1, "nav pages kaldirilmali");
  });

  it("Paket 106: liste meta id'leri ve kaydet span i18n", function() {
    assert.ok(html.indexOf('id="mxadminCategoriesMeta"') !== -1, "mxadminCategoriesMeta eksik");
    assert.ok(html.indexOf('id="mxadminPagesListHead"') !== -1, "mxadminPagesListHead eksik");
    assert.ok(html.indexOf('id="mxadminPagesListCount"') !== -1, "mxadminPagesListCount eksik");
    assert.ok(html.indexOf('class="mxadmin-table mxadmin-table-categories"') !== -1, "kategori tablo sinifi eksik");
    assert.ok(html.indexOf('<span data-mxadmin-i18n="save">') !== -1, "kaydet span i18n eksik");
  });

  it("Paket 107: master/detail sayfa workspace", function() {
    assert.ok(html.indexOf('id="mxadminPagesWorkspace"') !== -1, "mxadminPagesWorkspace eksik");
    assert.ok(html.indexOf('id="mxadminPagesListPanel"') !== -1, "mxadminPagesListPanel eksik");
    assert.ok(html.indexOf('id="mxadminPagesDetailPanel"') !== -1, "mxadminPagesDetailPanel eksik");
    assert.ok(html.indexOf('id="mxadminPageDetailEmpty"') !== -1, "mxadminPageDetailEmpty eksik");
    assert.ok(html.indexOf('id="mxadminPageDetailTitle"') !== -1, "mxadminPageDetailTitle eksik");
    assert.ok(html.indexOf('mxadmin-screen-pages') !== -1, "mxadmin-screen-pages sinifi eksik");
    assert.ok(html.indexOf('mxadmin-pages-layout') === -1, "eski mxadmin-pages-layout kaldirilmali");
  });

  it("Paket 109: tasarim renk list column HTML", function() {
    assert.ok(html.indexOf("mxadmin-color-list") !== -1, "mxadmin-color-list eksik");
    assert.ok(html.indexOf("mxadmin-color-grid") === -1, "mxadmin-color-grid kaldirilmali");
    assert.ok(html.indexOf('class="mxadmin-color-list" id="mxadminDesignLite"') !== -1, "DesignLite list sinifi eksik");
    assert.ok(html.indexOf('class="mxadmin-color-list" id="mxadminDesignDark"') !== -1, "DesignDark list sinifi eksik");
  });

  it("Paket 110: dashboard stats list ve kategori geri butonu", function() {
    assert.ok(html.indexOf('id="mxadminDashboardStats"') !== -1, "mxadminDashboardStats eksik");
    assert.ok(html.indexOf("mxadmin-stats-list") !== -1, "mxadmin-stats-list eksik");
    assert.ok(html.indexOf("mxadmin-stats-row") !== -1, "mxadmin-stats-row eksik");
    assert.ok(html.indexOf('id="mxadminCategoriesBackBtn"') !== -1, "mxadminCategoriesBackBtn eksik");
    assert.ok(html.indexOf('id="mxadminDashboardCards"') === -1, "mxadminDashboardCards kaldirilmali");
    assert.ok(html.indexOf('data-mxadmin-i18n="statsOverview"') !== -1, "statsOverview i18n eksik");
    assert.ok(html.indexOf('id="mxadminDesignLiteMeta"') !== -1, "mxadminDesignLiteMeta eksik");
    assert.ok(html.indexOf('id="mxadminDesignDarkMeta"') !== -1, "mxadminDesignDarkMeta eksik");
  });
});

describe("webmodules/admin admin.js placeholder ve API", function() {
  var js;

  before(function() {
    js = helpers.readAdminFile("admin.js");
  });

  it("{{adminApiUrl}} placeholder render oncesi korunur", function() {
    assert.ok(js.indexOf("'{{adminApiUrl}}'") !== -1 || js.indexOf('"{{adminApiUrl}}"') !== -1);
  });

  it("MX_ADMIN_API_BASE degiskeni tanimli", function() {
    assert.ok(js.indexOf("MX_ADMIN_API_BASE") !== -1);
  });

  it("mxAdminUnwrapApiData fonksiyonu mevcut", function() {
    assert.ok(js.indexOf("function mxAdminUnwrapApiData") !== -1);
  });

  it("mxAdminApiConfigured placeholder kontrolu", function() {
    assert.ok(js.indexOf("function mxAdminApiConfigured") !== -1);
    assert.ok(js.indexOf("indexOf('{{')") !== -1);
  });

  it("mxAdminLoadModules fonksiyonu mevcut", function() {
    assert.ok(js.indexOf("function mxAdminLoadModules") !== -1);
    assert.ok(js.indexOf("/api/admin/data/modules") !== -1);
  });

  it("yalnizca var kullanimi (let/const yasak)", function() {
    assert.ok(!/\blet\s/.test(js), "let kullanimi yasak");
    assert.ok(!/\bconst\s/.test(js), "const kullanimi yasak");
  });

  it("arrow function yasak", function() {
    assert.ok(!/=>/.test(js), "arrow function yasak");
  });

  it("window.onload baslangic (DOMContentLoaded yasak)", function() {
    assert.ok(js.indexOf("window.onload") !== -1);
    assert.ok(!/addEventListener\s*\(\s*['"]DOMContentLoaded['"]/.test(js));
    assert.ok(!/document\.onreadystatechange/.test(js));
  });

  it("Paket 105: user chip ve mobil sidebar JS", function() {
    assert.ok(js.indexOf("function mxAdminUpdateUserChip") !== -1);
    assert.ok(js.indexOf("function mxAdminToggleSidebarDrawer") !== -1);
    assert.ok(js.indexOf("function mxAdminCloseSidebarDrawer") !== -1);
    assert.ok(js.indexOf("mxadminQuickActions") !== -1);
  });

  it("Paket 106: cihaz format ve liste meta JS", function() {
    assert.ok(js.indexOf("function mxAdminFormatDevice") !== -1);
    assert.ok(js.indexOf("function mxAdminUpdateCategoriesMeta") !== -1);
    assert.ok(js.indexOf("function mxAdminUpdatePagesListMeta") !== -1);
    assert.ok(js.indexOf("mxadmin-table-path") !== -1);
    assert.ok(js.indexOf("mxadmin-col-device") !== -1);
    assert.ok(js.indexOf("querySelector('[data-mxadmin-i18n]')") !== -1, "i18n leaf node kontrolu");
  });

  it("Paket 107: master/detail sayfa JS", function() {
    assert.ok(js.indexOf("function mxAdminShowPageDetailEmpty") !== -1);
    assert.ok(js.indexOf("function mxAdminUpdatePageDetailHeader") !== -1);
    assert.ok(js.indexOf("mxadminPagesWorkspace") !== -1);
  });

  it("Paket 108: moduller master/detail JS", function() {
    assert.ok(js.indexOf("function mxAdminRenderModulesList") !== -1);
    assert.ok(js.indexOf("function mxAdminSelectModule") !== -1);
    assert.ok(js.indexOf("function mxAdminHandleModuleFormSubmit") !== -1);
    assert.ok(js.indexOf("/api/admin/data/module-record/") !== -1);
    assert.ok(js.indexOf("function mxAdminLoadModuleFiles") !== -1);
    assert.ok(js.indexOf("modulesSearchPlaceholder") !== -1);
    assert.ok(js.indexOf("metaModules") !== -1);
    assert.ok(js.indexOf("mxAdminRenderModulesGrid") === -1, "mxAdminRenderModulesGrid kaldirilmali");
    assert.ok(js.indexOf("mxadminModulesGrid") === -1, "mxadminModulesGrid kaldirilmali");
  });

  it("Paket 109: tasarim renk list column JS", function() {
    assert.ok(js.indexOf("function mxAdminRenderColorList") !== -1);
    assert.ok(js.indexOf("function mxAdminCollectColorList") !== -1);
    assert.ok(js.indexOf("mxadmin-layout-list") !== -1);
    assert.ok(js.indexOf("mxAdminRenderColorGrid") === -1, "mxAdminRenderColorGrid kaldirilmali");
    assert.ok(js.indexOf("mxAdminCollectColorGrid") === -1, "mxAdminCollectColorGrid kaldirilmali");
    assert.ok(js.indexOf("mxadmin-layout-chips") === -1, "mxadmin-layout-chips kaldirilmali");
  });

  it("Paket 114: tasarim yerlesim modul adi ve duzenleme linki", function() {
    assert.ok(js.indexOf("function mxAdminOpenModuleEditor") !== -1);
    assert.ok(js.indexOf("function mxAdminFindModuleById") !== -1);
    assert.ok(js.indexOf("mxadmin-layout-item-link") !== -1);
    assert.ok(js.indexOf("mxadmin-layout-item-name") !== -1);
    assert.ok(js.indexOf("layoutModuleHint") !== -1);
  });

  it("Paket 110: UX polish JS", function() {
    assert.ok(js.indexOf("function mxAdminHandleCategoriesBack") !== -1);
    assert.ok(js.indexOf("function mxAdminHandlePageStatusChange") !== -1);
    assert.ok(js.indexOf("function mxAdminUpdateDesignColorMeta") !== -1);
    assert.ok(js.indexOf("mxadminCategoriesBackBtn") !== -1);
    assert.ok(js.indexOf("mxAdminHandlePageStatusChange") !== -1);
    assert.ok(js.indexOf("setting.name") !== -1, "user chip setting.name kullanimi");
    assert.ok(js.indexOf("function mxAdminSettingScalarToInput") !== -1, "setting name i18n input yardimcisi");
    assert.ok(js.indexOf("mxAdminSettingScalarToInput(setting.name)") !== -1, "ayarlar site adi scalar cozumleme");
    assert.ok(js.indexOf("function mxAdminGetPageDescSchema") !== -1, "Paket 118: desc schema");
    assert.ok(js.indexOf("function mxAdminRenderPageDescFields") !== -1, "Paket 118: desc alan render");
    assert.ok(js.indexOf("data-mxadmin-page-desc-key") !== -1, "Paket 118: desc input data attr");
    assert.ok(js.indexOf("function mxAdminGetPageModuleStatus") !== -1, "Paket 119: page modulestatus");
    assert.ok(js.indexOf("function mxAdminIsPageImgActive") !== -1, "Paket 119: page img aktif kontrol");
    assert.ok(js.indexOf("function mxAdminLoadPageFiles") !== -1, "Paket 119: page dosya listesi");
    assert.ok(js.indexOf("function mxAdminRenderPageMediaPanel") !== -1, "Paket 119: page medya panel");
    assert.ok(js.indexOf("/api/admin/data/page-upload/") !== -1, "Paket 119: page upload ucu");
    assert.ok(js.indexOf("pageRow.img") !== -1, "Paket 119: kapak img alani");
    assert.ok(js.indexOf("function mxAdminMovePage") !== -1, "Paket 120: sayfa sira tasima");
    assert.ok(js.indexOf("/api/admin/data/page-reorder/") !== -1, "Paket 120: page-reorder ucu");
    assert.ok(js.indexOf("pagesMoveUp") !== -1, "Paket 120: sira i18n");
    assert.ok(js.indexOf("function mxAdminCreatePageHtmlEditor") !== -1, "Paket 122: HTML editor");
    assert.ok(js.indexOf("function mxAdminCollectPageTextFromForm") !== -1, "Paket 122: text toplama");
    assert.ok(js.indexOf("function mxAdminRenderPageListThumb") !== -1, "Paket 123: liste thumb");
    assert.ok(js.indexOf("mxadmin-pages-list-thumb") !== -1, "Paket 123: thumb sinifi");
    assert.ok(
        js.split("function mxAdminRenderPageListThumb")[1].indexOf("mxAdminIsPageImgActive()") !== -1,
        "Paket 124: liste thumb modulestatus.img ile"
    );
    assert.ok(js.indexOf("function mxAdminRenderPageFilters") !== -1, "Paket 125: sayfa filtre panel");
    assert.ok(js.indexOf("function mxAdminPageFiltersVisible") !== -1, "Paket 125: filtre gorunurluk");
    assert.ok(js.indexOf("MX_ADMIN_PAGE_CATEGORY_NONE") !== -1, "Paket 125: kategori filtresi");
    assert.ok(js.indexOf("pageHtmlTabPreview") !== -1, "Paket 122: onizleme sekmesi");
    assert.ok(js.indexOf("statsOverview") !== -1);
    assert.ok(js.indexOf("categoriesBack") !== -1);
  });
});

describe("webmodules/admin {{adminApiUrl}} htmlUtils uyumu", function() {
  it("htmlUtils resolveDesingValue ayni placeholder anahtarini kullanir", function() {
    var htmlUtilsPath = path.resolve(ADMIN_ROOT, "../../public/webmaker/services/webmaker/htmlUtils.js");
    assert.ok(fs.existsSync(htmlUtilsPath), "htmlUtils.js bulunamadi");
    var src = fs.readFileSync(htmlUtilsPath, "utf8");
    assert.ok(src.indexOf("'{{adminApiUrl}}'") !== -1 || src.indexOf('"{{adminApiUrl}}"') !== -1);
    assert.ok(src.indexOf("adminApiUrl") !== -1);
  });

  it("fsCopy copyAdminPanel ayni placeholder ile degistirir", function() {
    var fsCopyPath = path.resolve(ADMIN_ROOT, "../../public/webmaker/services/webmaker/fsCopy.js");
    assert.ok(fs.existsSync(fsCopyPath), "fsCopy.js bulunamadi");
    var src = fs.readFileSync(fsCopyPath, "utf8");
    assert.ok(src.indexOf("copyAdminPanel") !== -1);
    assert.ok(src.indexOf("{{adminApiUrl}}") !== -1);
  });
});
