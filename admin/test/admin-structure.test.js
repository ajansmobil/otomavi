
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

var ADMIN_ROOT = helpers.ADMIN_ROOT;

var REQUIRED_SCREEN_IDS = [
    'mxadminScreenLogin',
    'mxadminShell',
    'mxadminScreenDashboard',
    'mxadminScreenCategories',
    'mxadminScreenPages',
    'mxadminScreenModules',
    'mxadminScreenSettings',
    'mxadminScreenDesign',
    'mxadminScreenSiparisler',
    'mxadminScreenEticaretSettings',
];

var REQUIRED_NAV_SCREENS = ['dashboard', 'modules', 'settings', 'design'];

var DASHBOARD_IDS = [
    'mxadminCardDomainValue',
    'mxadminCardUsernameValue',
    'mxadminCardCategoriesValue',
    'mxadminCardPagesValue',
    'mxadminHistoryTable',
];

var PAGE_CRUD_IDS = ['mxadminPageAddBtn', 'mxadminPageDeleteBtn'];

describe('webmodules/admin dosya yapisi', function () {
    it('index.html, admin.css, admin.js mevcut', function () {
        ['index.html', 'admin.css', 'admin.js'].forEach(function (name) {
            assert.ok(
                fs.existsSync(path.join(ADMIN_ROOT, name)),
                name + ' olmali',
            );
        });
    });

    it('admin.css bos degil', function () {
        var css = helpers.readAdminFile('admin.css');
        assert.ok(
            css.replace(/\s/g, '').length > 100,
            'admin.css yeterli icerik',
        );
    });

    it('Paket 116: scrollbar ve overscroll standardi', function () {
        var css = helpers.readAdminFile('admin.css');
        assert.ok(
            css.indexOf('overscroll-behavior') !== -1,
            'overscroll kontrolu',
        );
        assert.ok(
            css.indexOf('mxadmin-scroll-y') !== -1,
            'gizli scroll yardimcisi',
        );
        assert.ok(
            css.indexOf('.mxadmin-sidebar-nav') !== -1 &&
                css.indexOf('overflow: hidden') !== -1,
            'sidebar nav scrollbar kaldirildi',
        );
    });

    it('Paket 133: mxadmin-select CSS standardi', function () {
        var css = helpers.readAdminFile('admin.css');
        var js = helpers.readAdminFile('admin.js');
        assert.ok(
            css.indexOf('.mxadmin-select') !== -1,
            'mxadmin-select sinifi tanimli',
        );
        assert.ok(
            css.indexOf('appearance: none') !== -1,
            'native select kaldirildi',
        );
        assert.ok(
            css.indexOf('background-image: url') !== -1 ||
                js.indexOf('mxAdminInjectSelectChevronStyle') !== -1,
            'chevron svg tanimli (css veya js enjeksiyonu)',
        );
        assert.ok(
            css.indexOf('.mxadmin-select-sm') !== -1,
            'kucuk select varyanti',
        );
    });

    it('Paket 176: checkbox css.css toggle sizintisi reset', function () {
        var css = helpers.readAdminFile('admin.css');
        assert.ok(
            css.indexOf('.mxadmin-app input[type=\'checkbox\']') !== -1,
            'admin checkbox reset tanimli',
        );
        assert.ok(
            css.indexOf('-webkit-appearance: checkbox') !== -1,
            'native checkbox gorunumu',
        );
        assert.ok(
            css.indexOf('input[type=\'checkbox\']::before') !== -1,
            'toggle pseudo iptal',
        );
    });

    it('Paket 176: bulk select mxadmin-select sinifi', function () {
        var html = helpers.readAdminFile('index.html');
        assert.ok(
            html.indexOf(
                'class="mxadmin-select mxadmin-select-sm mxadmin-pages-bulk-status"',
            ) !== -1,
            'bulk status mxadmin-select',
        );
        assert.ok(
            html.indexOf(
                'class="mxadmin-select mxadmin-select-sm mxadmin-pages-bulk-category"',
            ) !== -1,
            'bulk category mxadmin-select',
        );
        assert.ok(
            html.indexOf('id="mxadminSettingDefaultLang" class="mxadmin-select"') !==
                -1,
            'default lang mxadmin-select',
        );
    });

    it('Paket 117: css.css global sizinti korumasi', function () {
        var css = helpers.readAdminFile('admin.css');
        assert.ok(
            css.indexOf('.mxadmin-app div') !== -1 &&
                css.indexOf('float: none') !== -1,
            'div float reset',
        );
        assert.ok(
            css.indexOf('.mxadmin-page-move-btn') !== -1,
            'Paket 120: sayfa sira butonlari',
        );
        assert.ok(
            css.indexOf('.mxadmin-layout-move-btn') !== -1,
            'Paket 173: layout sira butonlari',
        );
        assert.ok(
            css.indexOf('.mxadmin-btn-danger') !== -1,
            'Paket 127: sil buton stili',
        );
        assert.ok(
            css.indexOf('.mxadmin-pages-list-panel-head-actions') !== -1,
            'Paket 127: liste baslik aksiyonlari',
        );
        assert.ok(
            css.indexOf(
                '.mxadmin-pages-workspace.is-detail-open .mxadmin-pages-list-panel',
            ) !== -1,
            'Paket 121: stack navigasyon',
        );
        assert.ok(
            css.indexOf('.mxadmin-html-editor') !== -1,
            'Paket 122: HTML editor CSS',
        );
        assert.ok(
            css.indexOf('#mxadminLoginForm .mxadmin-btn-primary') !== -1,
            'login buton genisligi',
        );
    });
});

describe('webmodules/admin index.html ekran iskeleti', function () {
    var html;

    before(function () {
        html = helpers.readAdminFile('index.html');
    });

    REQUIRED_SCREEN_IDS.forEach(function (id) {
        it('id=' + id + ' mevcut', function () {
            assert.ok(html.indexOf('id="' + id + '"') !== -1, id + ' eksik');
        });
    });

    REQUIRED_NAV_SCREENS.forEach(function (screen) {
        it('nav data-mxadmin-screen="' + screen + '"', function () {
            assert.ok(
                html.indexOf('data-mxadmin-screen="' + screen + '"') !== -1,
                'nav ' + screen + ' eksik',
            );
        });
    });

    DASHBOARD_IDS.forEach(function (id) {
        it('dashboard id=' + id, function () {
            assert.ok(html.indexOf('id="' + id + '"') !== -1, id + ' eksik');
        });
    });

    PAGE_CRUD_IDS.forEach(function (id) {
        it('Paket 128: sayfa CRUD id=' + id, function () {
            assert.ok(html.indexOf('id="' + id + '"') !== -1, id + ' eksik');
        });
    });

    it('mxadmin prefix siniflari kullanilir', function () {
        assert.ok(html.indexOf('mxadmin-app') !== -1);
        assert.ok(html.indexOf('mxadmin-nav-btn') !== -1);
        assert.ok(html.indexOf('mxadmin-sidebar') !== -1);
    });

    it('Paket 105: login bg, user chip, quick actions, mobil drawer', function () {
        assert.ok(
            html.indexOf('class="mxadmin-login-bg"') !== -1,
            'mxadmin-login-bg eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPasswordToggle"') !== -1,
            'mxadminPasswordToggle eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-password-field') !== -1,
            'mxadmin-password-field eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminUserChip"') !== -1,
            'mxadminUserChip eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminUserChipDomain"') !== -1,
            'mxadminUserChipDomain eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminUserChipName"') !== -1,
            'mxadminUserChipName eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminQuickActions"') !== -1,
            'mxadminQuickActions eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminQuickPages"') !== -1,
            'mxadminQuickPages eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminSidebarToggle"') !== -1,
            'mxadminSidebarToggle eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminSidebarOverlay"') !== -1,
            'mxadminSidebarOverlay eksik',
        );
    });

    it('Paket 133: statik select mxadmin-select sinifi', function () {
        assert.ok(
            html.indexOf('id="mxadminPageStatus" class="mxadmin-select"') !==
                -1,
            'mxadminPageStatus mxadmin-select eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminModuleActive" class="mxadmin-select"') !==
                -1,
            'mxadminModuleActive mxadmin-select eksik',
        );
    });

    it('admin.css ve admin.js mutlak /admin/ yolu', function () {
        assert.ok(html.indexOf('href="/admin/admin.css"') !== -1);
        assert.ok(/src="\/admin\/admin\.js(\?v=[^"]+)?"/.test(html));
        var cssPos = html.indexOf('href="/src/css.css"');
        var adminCssPos = html.indexOf('href="/admin/admin.css"');
        assert.ok(
            cssPos !== -1 && adminCssPos > cssPos,
            "css.css admin.css'ten once yuklenmeli (Paket 117)",
        );
    });

    it('kategoriler formu ve sayfa editoru', function () {
        assert.ok(html.indexOf('id="mxadminCategoriesForm"') !== -1);
        assert.ok(html.indexOf('id="mxadminCategoriesBody"') !== -1);
        assert.ok(html.indexOf('id="mxadminPageForm"') !== -1);
        assert.ok(
            html.indexOf('id="mxadminPageDescPanel"') !== -1,
            'mxadminPageDescPanel eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPageDescFields"') !== -1,
            'mxadminPageDescFields eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPageMediaPanel"') !== -1,
            'Paket 119: mxadminPageMediaPanel eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPageMediaGrid"') !== -1,
            'Paket 119: mxadminPageMediaGrid eksik',
        );
        assert.ok(html.indexOf('id="mxadminPagesList"') !== -1);
        assert.ok(
            html.indexOf('id="mxadminPagesFilters"') !== -1,
            'Paket 125: mxadminPagesFilters eksik',
        );
    });

    it('ayarlar ve tasarim formlari', function () {
        assert.ok(html.indexOf('id="mxadminSettingsForm"') !== -1);
        assert.ok(html.indexOf('id="mxadminSettingLogoPreview"') !== -1);
        assert.ok(
            html.indexOf('id="mxadminSettingIconPreview"') !== -1,
            'Paket 174: favicon onizleme',
        );
        assert.ok(
            html.indexOf('id="mxadminSettingLangList"') !== -1,
            'Paket 174: dil listesi',
        );
        assert.ok(
            html.indexOf('id="mxadminSettingDefaultLang"') !== -1,
            'Paket 174: birincil dil select',
        );
        assert.ok(html.indexOf('id="mxadminDesignForm"') !== -1);
        assert.ok(html.indexOf('id="mxadminDesignLite"') !== -1);
        assert.ok(html.indexOf('id="mxadminDesignDark"') !== -1);
    });

    it('Paket 108: moduller master/detail editor', function () {
        assert.ok(html.indexOf('id="mxadminScreenModules"') !== -1);
        assert.ok(
            html.indexOf('id="mxadminModulesGrid"') === -1,
            'mxadminModulesGrid kaldirilmali',
        );
        assert.ok(
            html.indexOf('id="mxadminModulesTable"') === -1,
            'mxadminModulesTable kaldirilmali',
        );
        assert.ok(
            html.indexOf('id="mxadminModulesWorkspace"') !== -1,
            'mxadminModulesWorkspace eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminModulesList"') !== -1,
            'mxadminModulesList eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminModuleForm"') !== -1,
            'mxadminModuleForm eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminModuleMediaGrid"') !== -1,
            'mxadminModuleMediaGrid eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminModulesSearch"') !== -1,
            'mxadminModulesSearch eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminModulesMeta"') !== -1,
            'mxadminModulesMeta eksik',
        );
        assert.ok(html.indexOf('data-mxadmin-screen="modules"') !== -1);
    });

    it('yan sidebar pagesetting kategori listesi (webmaker gibi)', function () {
        assert.ok(
            html.indexOf('id="mxadminSidebarCategories"') !== -1,
            'mxadminSidebarCategories eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminCategoriesEditBtn"') !== -1,
            'mxadminCategoriesEditBtn eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPagesCategoryTitle"') !== -1,
            'mxadminPagesCategoryTitle eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminCategoryTabs"') === -1,
            'mxadminCategoryTabs kaldirilmali',
        );
        assert.ok(
            html.indexOf('data-mxadmin-screen="categories"') === -1,
            'nav categories kaldirilmali',
        );
        assert.ok(
            html.indexOf('data-mxadmin-screen="pages"') === -1,
            'nav pages kaldirilmali',
        );
    });

    it("Paket 106: liste meta id'leri ve kaydet span i18n", function () {
        assert.ok(
            html.indexOf('id="mxadminCategoriesMeta"') !== -1,
            'mxadminCategoriesMeta eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPagesListHead"') !== -1,
            'mxadminPagesListHead eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPagesListCount"') !== -1,
            'mxadminPagesListCount eksik',
        );
        assert.ok(
            html.indexOf('class="mxadmin-table mxadmin-table-categories"') !==
                -1,
            'kategori tablo sinifi eksik',
        );
        assert.ok(
            html.indexOf('<span data-mxadmin-i18n="save">') !== -1,
            'kaydet span i18n eksik',
        );
    });

    it('Paket 107: master/detail sayfa workspace', function () {
        assert.ok(
            html.indexOf('id="mxadminPagesWorkspace"') !== -1,
            'mxadminPagesWorkspace eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPagesListPanel"') !== -1,
            'mxadminPagesListPanel eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPagesDetailPanel"') !== -1,
            'mxadminPagesDetailPanel eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPageDetailEmpty"') !== -1,
            'mxadminPageDetailEmpty eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPageDetailTitle"') !== -1,
            'mxadminPageDetailTitle eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-screen-pages') !== -1,
            'mxadmin-screen-pages sinifi eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-pages-layout') === -1,
            'eski mxadmin-pages-layout kaldirilmali',
        );
    });

    it('Paket 109: tasarim renk list column HTML', function () {
        assert.ok(
            html.indexOf('mxadmin-color-list') !== -1,
            'mxadmin-color-list eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-color-grid') === -1,
            'mxadmin-color-grid kaldirilmali',
        );
        assert.ok(
            html.indexOf(
                'class="mxadmin-color-list" id="mxadminDesignLite"',
            ) !== -1,
            'DesignLite list sinifi eksik',
        );
        assert.ok(
            html.indexOf(
                'class="mxadmin-color-list" id="mxadminDesignDark"',
            ) !== -1,
            'DesignDark list sinifi eksik',
        );
    });

    it('Paket 127: sayfa ekle / sil UI', function () {
        assert.ok(
            html.indexOf('id="mxadminPageAddBtn"') !== -1,
            'mxadminPageAddBtn eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminPageDeleteBtn"') !== -1,
            'mxadminPageDeleteBtn eksik',
        );
        assert.ok(
            html.indexOf('data-mxadmin-i18n="pageAdd"') !== -1,
            'pageAdd i18n eksik',
        );
        assert.ok(
            html.indexOf('data-mxadmin-i18n="pageDelete"') !== -1,
            'pageDelete i18n eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-btn-primary mxadmin-btn-sm') !== -1,
            'sayfa ekle buton sinifi eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-btn-danger') !== -1,
            'sil buton danger sinifi eksik',
        );
    });

    it('Paket 110: dashboard stats list ve kategori geri butonu', function () {
        assert.ok(
            html.indexOf('id="mxadminDashboardStats"') !== -1,
            'mxadminDashboardStats eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-stats-list') !== -1,
            'mxadmin-stats-list eksik',
        );
        assert.ok(
            html.indexOf('mxadmin-stats-row') !== -1,
            'mxadmin-stats-row eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminCategoriesBackBtn"') !== -1,
            'mxadminCategoriesBackBtn eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminDashboardCards"') === -1,
            'mxadminDashboardCards kaldirilmali',
        );
        assert.ok(
            html.indexOf('data-mxadmin-i18n="statsOverview"') !== -1,
            'statsOverview i18n eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminDesignLiteMeta"') !== -1,
            'mxadminDesignLiteMeta eksik',
        );
        assert.ok(
            html.indexOf('id="mxadminDesignDarkMeta"') !== -1,
            'mxadminDesignDarkMeta eksik',
        );
    });
});

describe('webmodules/admin admin.js placeholder ve API', function () {
    var js;

    before(function () {
        js = helpers.readAdminFile('admin.js');
    });

    it('{{adminApiUrl}} placeholder render oncesi korunur', function () {
        assert.ok(
            js.indexOf("'{{adminApiUrl}}'") !== -1 ||
                js.indexOf('"{{adminApiUrl}}"') !== -1,
        );
    });

    it('MX_ADMIN_API_BASE degiskeni tanimli', function () {
        assert.ok(js.indexOf('MX_ADMIN_API_BASE') !== -1);
    });

    it('mxAdminUnwrapApiData fonksiyonu mevcut', function () {
        assert.ok(js.indexOf('function mxAdminUnwrapApiData') !== -1);
    });

    it('mxAdminApiConfigured placeholder kontrolu', function () {
        assert.ok(js.indexOf('function mxAdminApiConfigured') !== -1);
        assert.ok(js.indexOf("indexOf('{{')") !== -1);
    });

    it('mxAdminLoadModules fonksiyonu mevcut', function () {
        assert.ok(js.indexOf('function mxAdminLoadModules') !== -1);
        assert.ok(js.indexOf('/api/admin/data/modules') !== -1);
    });

    it('yalnizca var kullanimi (let/const yasak)', function () {
        assert.ok(!/\blet\s/.test(js), 'let kullanimi yasak');
        assert.ok(!/\bconst\s/.test(js), 'const kullanimi yasak');
    });

    it('arrow function yasak', function () {
        assert.ok(!/=>/.test(js), 'arrow function yasak');
    });

    it('window.onload baslangic (DOMContentLoaded yasak)', function () {
        assert.ok(js.indexOf('window.onload') !== -1);
        assert.ok(!/addEventListener\s*\(\s*['"]DOMContentLoaded['"]/.test(js));
        assert.ok(!/document\.onreadystatechange/.test(js));
    });

    it('Paket 105: user chip ve mobil sidebar JS', function () {
        assert.ok(js.indexOf('function mxAdminUpdateUserChip') !== -1);
        assert.ok(js.indexOf('function mxAdminToggleSidebarDrawer') !== -1);
        assert.ok(js.indexOf('function mxAdminCloseSidebarDrawer') !== -1);
        assert.ok(js.indexOf('mxadminQuickActions') !== -1);
    });

    it('Paket 106: cihaz format ve liste meta JS', function () {
        assert.ok(js.indexOf('function mxAdminFormatDevice') !== -1);
        assert.ok(js.indexOf('function mxAdminUpdateCategoriesMeta') !== -1);
        assert.ok(js.indexOf('function mxAdminUpdatePagesListMeta') !== -1);
        assert.ok(js.indexOf('mxadmin-table-path') !== -1);
        assert.ok(js.indexOf('mxadmin-col-device') !== -1);
        assert.ok(
            js.indexOf("querySelector('[data-mxadmin-i18n]')") !== -1,
            'i18n leaf node kontrolu',
        );
    });

    it('Paket 107: master/detail sayfa JS', function () {
        assert.ok(js.indexOf('function mxAdminShowPageDetailEmpty') !== -1);
        assert.ok(js.indexOf('function mxAdminUpdatePageDetailHeader') !== -1);
        assert.ok(js.indexOf('mxadminPagesWorkspace') !== -1);
    });

    it('Paket 108: moduller master/detail JS', function () {
        assert.ok(js.indexOf('function mxAdminRenderModulesList') !== -1);
        assert.ok(js.indexOf('function mxAdminSelectModule') !== -1);
        assert.ok(js.indexOf('function mxAdminHandleModuleFormSubmit') !== -1);
        assert.ok(js.indexOf('/api/admin/data/module-record/') !== -1);
        assert.ok(js.indexOf('function mxAdminLoadModuleFiles') !== -1);
        assert.ok(js.indexOf('modulesSearchPlaceholder') !== -1);
        assert.ok(js.indexOf('metaModules') !== -1);
        assert.ok(
            js.indexOf('mxAdminRenderModulesGrid') === -1,
            'mxAdminRenderModulesGrid kaldirilmali',
        );
        assert.ok(
            js.indexOf('mxadminModulesGrid') === -1,
            'mxadminModulesGrid kaldirilmali',
        );
    });

    it('Paket 109: tasarim renk list column JS', function () {
        assert.ok(js.indexOf('function mxAdminRenderColorList') !== -1);
        assert.ok(js.indexOf('function mxAdminCollectColorList') !== -1);
        assert.ok(js.indexOf('mxadmin-layout-list') !== -1);
        assert.ok(
            js.indexOf('mxAdminRenderColorGrid') === -1,
            'mxAdminRenderColorGrid kaldirilmali',
        );
        assert.ok(
            js.indexOf('mxAdminCollectColorGrid') === -1,
            'mxAdminCollectColorGrid kaldirilmali',
        );
        assert.ok(
            js.indexOf('mxadmin-layout-chips') === -1,
            'mxadmin-layout-chips kaldirilmali',
        );
    });

    it('Paket 114: tasarim yerlesim modul adi ve duzenleme linki', function () {
        assert.ok(js.indexOf('function mxAdminOpenModuleEditor') !== -1);
        assert.ok(js.indexOf('function mxAdminFindModuleById') !== -1);
        assert.ok(js.indexOf('mxadmin-layout-item-link') !== -1);
        assert.ok(js.indexOf('mxadmin-layout-item-name') !== -1);
        assert.ok(js.indexOf('layoutModuleHint') !== -1);
    });

    it('Paket 110: UX polish JS', function () {
        assert.ok(js.indexOf('function mxAdminHandleCategoriesBack') !== -1);
        assert.ok(js.indexOf('function mxAdminHandlePageStatusChange') !== -1);
        assert.ok(js.indexOf('function mxAdminUpdateDesignColorMeta') !== -1);
        assert.ok(js.indexOf('mxadminCategoriesBackBtn') !== -1);
        assert.ok(js.indexOf('mxAdminHandlePageStatusChange') !== -1);
        assert.ok(
            js.indexOf('setting.name') !== -1,
            'user chip setting.name kullanimi',
        );
        assert.ok(
            js.indexOf('function mxAdminSettingScalarToInput') !== -1,
            'setting name i18n input yardimcisi',
        );
        assert.ok(
            js.indexOf('mxAdminSettingScalarToInput(setting.name)') !== -1,
            'ayarlar site adi scalar cozumleme',
        );
        assert.ok(
            js.indexOf('function mxAdminGetPageDescSchema') !== -1,
            'Paket 118: desc schema',
        );
        assert.ok(
            js.indexOf('function mxAdminRenderPageDescFields') !== -1,
            'Paket 118: desc alan render',
        );
        assert.ok(
            js.indexOf('data-mxadmin-page-desc-key') !== -1,
            'Paket 118: desc input data attr',
        );
        assert.ok(
            js.indexOf('function mxAdminGetPageModuleStatus') !== -1,
            'Paket 119: page modulestatus',
        );
        assert.ok(
            js.indexOf('function mxAdminIsPageImgActive') !== -1,
            'Paket 119: page img aktif kontrol',
        );
        assert.ok(
            js.indexOf('function mxAdminLoadPageFiles') !== -1,
            'Paket 119: page dosya listesi',
        );
        assert.ok(
            js.indexOf('function mxAdminRenderPageMediaPanel') !== -1,
            'Paket 119: page medya panel',
        );
        assert.ok(
            js.indexOf('/api/admin/data/page-upload/') !== -1,
            'Paket 119: page upload ucu',
        );
        assert.ok(
            js.indexOf('pageRow.img') !== -1,
            'Paket 119: kapak img alani',
        );
        assert.ok(
            js.indexOf('function mxAdminMovePage') !== -1,
            'Paket 120: sayfa sira tasima',
        );
        assert.ok(
            js.indexOf('/api/admin/data/page-reorder/') !== -1,
            'Paket 120: page-reorder ucu',
        );
        assert.ok(js.indexOf('pagesMoveUp') !== -1, 'Paket 120: sira i18n');
        assert.ok(
            js.indexOf('function mxAdminCreatePageHtmlEditor') !== -1,
            'Paket 122: HTML editor',
        );
        assert.ok(
            js.indexOf('function mxAdminCollectPageTextFromForm') !== -1,
            'Paket 122: text toplama',
        );
        assert.ok(
            js.indexOf('function mxAdminRenderPageListThumb') !== -1,
            'Paket 123: liste thumb',
        );
        assert.ok(
            js.indexOf('mxadmin-pages-list-thumb') !== -1,
            'Paket 123: thumb sinifi',
        );
        assert.ok(
            js
                .split('function mxAdminRenderPageListThumb')[1]
                .indexOf('mxAdminIsPageImgActive()') !== -1,
            'Paket 124: liste thumb modulestatus.img ile',
        );
        assert.ok(
            js.indexOf('function mxAdminRenderPageFilters') !== -1,
            'Paket 125: filtre panel',
        );
        assert.ok(
            js.indexOf('function mxAdminPageFiltersVisible') !== -1,
            'Paket 125: filtre gorunurluk',
        );
        assert.ok(
            js.indexOf('MX_ADMIN_PAGE_CATEGORY_NONE') !== -1,
            'Paket 125: kategori filtresi',
        );
        assert.ok(
            js.indexOf('function mxAdminAddPage') !== -1,
            'Paket 127: sayfa ekle',
        );
        assert.ok(
            js.indexOf('function mxAdminDeletePage') !== -1,
            'Paket 127: sayfa sil',
        );
        assert.ok(
            js.indexOf('function mxAdminClonePage') !== -1,
            'Paket 173: sayfa klon',
        );
        assert.ok(
            js.indexOf('content_copy') !== -1 &&
                js.indexOf('mxadmin-page-clone-btn') !== -1,
            'Paket 173: klon butonu',
        );
        assert.ok(
            js.indexOf('function mxAdminMoveLayoutModule') !== -1,
            'Paket 173: layout sira',
        );
        assert.ok(
            js.indexOf('data-mxadmin-layout-move') !== -1,
            'Paket 173: layout move attribute',
        );
        assert.ok(
            js.indexOf('/api/admin/data/page-add/') !== -1,
            'Paket 127: page-add ucu',
        );
        assert.ok(
            js.indexOf('/api/admin/data/page-delete/') !== -1,
            'Paket 127: page-delete ucu',
        );
        assert.ok(
            js.indexOf('pageAddSuccess') !== -1,
            'Paket 127: pageAddSuccess i18n',
        );
        assert.ok(
            js.indexOf('pageDeleteConfirmTitle') !== -1,
            'Paket 127: pageDeleteConfirmTitle i18n',
        );
        assert.ok(
            js.indexOf('Global_confirmDelete') !== -1,
            'Paket 127: Global_confirmDelete',
        );
        assert.ok(
            js.indexOf('pageHtmlTabPreview') !== -1,
            'Paket 122: onizleme sekmesi',
        );
        assert.ok(
            js.indexOf(
                'class="mxadmin-select mxadmin-select-sm mxadmin-page-category-select"',
            ) !== -1,
            'Paket 133: kategori filtresi mxadmin-select',
        );
        assert.ok(
            js.indexOf(
                'class="mxadmin-select mxadmin-select-sm mxadmin-page-desc-filter-select"',
            ) !== -1,
            'Paket 133: desc filtresi mxadmin-select',
        );
        assert.ok(
            js.indexOf('class="mxadmin-select mxadmin-module-field-select"') !==
                -1,
            'Paket 133: modul alan select mxadmin-select',
        );
        assert.ok(js.indexOf('statsOverview') !== -1);
        assert.ok(js.indexOf('categoriesBack') !== -1);
    });

    it('Paket 160: mobil layout ve i18n tamamlama', function () {
        var css = helpers.readAdminFile('admin.css');
        var html = helpers.readAdminFile('index.html');
        var block768 = css.split('@media (max-width: 768px)')[1];
        assert.ok(block768, '768px media query olmali');
        assert.ok(
            block768.indexOf('.mxadmin-icon-btn') !== -1 &&
                (block768.indexOf('44px') !== -1 ||
                    block768.indexOf('min-width: 44') !== -1),
            'mobilde mxadmin-icon-btn min 44px',
        );
        assert.ok(
            block768.indexOf('.mxadmin-table-wrap') !== -1 &&
                block768.indexOf('overflow-x') !== -1,
            'mobilde tablo wrap yatay scroll',
        );
        assert.ok(
            block768.indexOf('.mxadmin-pages-bulk-bar') !== -1 &&
                block768.indexOf('flex-wrap') !== -1,
            'mobilde bulk bar flex-wrap',
        );
        assert.ok(
            html.indexOf('0 sayfa seçili') === -1 &&
                html.indexOf('0 sayfa secili') === -1,
            'bulk bar sabit Turkce metin yok',
        );
        assert.ok(
            js.indexOf('confirmDeleteTitle') !== -1 &&
                js.indexOf('confirmDeleteEnterHint') !== -1,
            'confirm delete i18n anahtarlari',
        );
        assert.ok(
            js.indexOf("opts.title || mxAdminT('confirmDeleteTitle')") !== -1,
            'confirm fallback i18n',
        );
        assert.ok(
            js.indexOf('pagesBulkSelected') !== -1,
            'pagesBulkSelected i18n',
        );
    });
});

describe('webmodules/admin {{adminApiUrl}} htmlUtils uyumu', function () {
    it('htmlUtils resolveDesingValue ayni placeholder anahtarini kullanir', function () {
        var htmlUtilsPath = path.resolve(
            ADMIN_ROOT,
            '../../public/webmaker/services/webmaker/htmlUtils.js',
        );
        assert.ok(fs.existsSync(htmlUtilsPath), 'htmlUtils.js bulunamadi');
        var src = fs.readFileSync(htmlUtilsPath, 'utf8');
        assert.ok(
            src.indexOf("'{{adminApiUrl}}'") !== -1 ||
                src.indexOf('"{{adminApiUrl}}"') !== -1,
        );
        assert.ok(src.indexOf('adminApiUrl') !== -1);
    });

    it('fsCopy copyAdminPanel ayni placeholder ile degistirir', function () {
        var fsCopyPath = path.resolve(
            ADMIN_ROOT,
            '../../public/webmaker/services/webmaker/fsCopy.js',
        );
        assert.ok(fs.existsSync(fsCopyPath), 'fsCopy.js bulunamadi');
        var src = fs.readFileSync(fsCopyPath, 'utf8');
        assert.ok(src.indexOf('copyAdminPanel') !== -1);
        assert.ok(src.indexOf('{{adminApiUrl}}') !== -1);
    });

    it('Paket 163: kaynak index.html {{adminAssetVersion}} placeholder tasir', function () {
        var html = helpers.readAdminFile('index.html');
        assert.ok(
            html.indexOf('{{adminAssetVersion}}') !== -1,
            'render oncesi sablon cache-bust placeholder icermeli',
        );
        assert.ok(
            html.indexOf('/admin/admin.js?v={{adminAssetVersion}}') !== -1,
            'script src cache-bust kalibi',
        );
    });

    it('Paket 163: fsCopy copyAdminPanel {{adminAssetVersion}} SHA1 cozer', function () {
        var fsCopyPath = path.resolve(
            ADMIN_ROOT,
            '../../public/webmaker/services/webmaker/fsCopy.js',
        );
        var src = fs.readFileSync(fsCopyPath, 'utf8');
        assert.ok(src.indexOf('{{adminAssetVersion}}') !== -1);
        assert.ok(src.indexOf("createHash('sha1')") !== -1 || src.indexOf('createHash("sha1")') !== -1);
        assert.ok(src.indexOf('.slice(0, 12)') !== -1);
        assert.ok(
            src.indexOf('refreshAdminPanelAssetVersion') !== -1,
            'strip sonrasi surum yenileme export edilmeli',
        );
    });

    it('Paket 174: ayarlar langs + favicon upload', function () {
        var js = helpers.readAdminFile('admin.js');
        assert.ok(
            js.indexOf('mxAdminWeblanglist') !== -1,
            'dil katalogu',
        );
        assert.ok(
            js.indexOf('function mxAdminRenderSettingsLangList') !== -1,
            'langs render',
        );
        assert.ok(
            js.indexOf('function mxAdminCollectSettingsLangsFromForm') !== -1,
            'langs toplama',
        );
        assert.ok(
            js.indexOf('setting.defaultLang') !== -1,
            'defaultLang kayit',
        );
        assert.ok(
            js.indexOf('/api/admin/data/icon-upload') !== -1,
            'icon-upload ucu',
        );
        assert.ok(
            js.indexOf('iconUploadConfirm') !== -1,
            'W3 favicon overwrite onay metni',
        );
        assert.ok(
            js.indexOf('function mxAdminHandleSettingIconUploadInput') !== -1,
            'favicon yukleme handler',
        );
    });

    it('Paket 199/206/207b: core manifest + module registry', function () {
        var manifestPath = path.join(ADMIN_ROOT, 'manifest.json');
        assert.ok(fs.existsSync(manifestPath), 'admin/manifest.json olmali');
        var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        assert.strictEqual(manifest.id, 'core');
        assert.strictEqual(manifest.always, true);
        assert.ok(Array.isArray(manifest.screens));
        assert.ok(manifest.screens.indexOf('dashboard') !== -1);

        var js = helpers.readAdminFile('admin.js');
        assert.ok(js.indexOf("MX_ADMIN_MODULES_RAW = '{{adminModules}}'") !== -1);
        assert.ok(js.indexOf('function mxAdminParseModulesFromRaw') !== -1);
        assert.ok(js.indexOf('function mxAdminParseModules') !== -1);
        assert.ok(js.indexOf('function mxAdminHasModule') !== -1);
        assert.ok(js.indexOf('function mxAdminBuildModuleNav') !== -1);
        assert.ok(js.indexOf('function mxAdminModuleRegister') !== -1);
        assert.ok(js.indexOf('function mxAdminInitRegisteredModules') !== -1);
        assert.ok(js.indexOf('function mxAdminParsePacks') !== -1, 'packs thin alias');
        assert.ok(js.indexOf('function mxAdminBuildPackNav') !== -1, 'BuildPackNav thin alias');
        assert.ok(
            js.indexOf("if (!mxAdminHasModule('eticaret'))") === -1,
            'BuildModuleNav eticaret hardcode kalkmali',
        );
        assert.ok(
            js.indexOf('mxAdminEticaretPackInit') === -1,
            'core Init eticaret hardcode cagri kalkmali',
        );
        assert.ok(
            js.indexOf('mxAdminEticaretPackShowScreen') === -1,
            'core ShowScreen eticaret hardcode kalkmali',
        );
        assert.ok(
            js.indexOf("siparisler: 'mxadminScreenSiparisler'") === -1,
            'core screen map eticaret hardcode kalkmali',
        );

        var html = helpers.readAdminFile('index.html');
        assert.ok(html.indexOf('id="mxadminModuleNavHost"') !== -1);
        assert.ok(html.indexOf('id="mxadminScreenSiparisler"') !== -1);
        assert.ok(html.indexOf('id="mxadminScreenEticaretSettings"') !== -1);
        assert.ok(html.indexOf('{{adminModuleAssetsHead}}') !== -1);
        assert.ok(html.indexOf('{{adminModuleAssetsBody}}') !== -1);

        var modRoot = path.join(ADMIN_ROOT, 'modules', 'eticaret');
        assert.ok(
            fs.existsSync(path.join(modRoot, 'manifest.json')),
            'admin/modules/eticaret/manifest.json',
        );
        var modManifest = JSON.parse(
            fs.readFileSync(path.join(modRoot, 'manifest.json'), 'utf8'),
        );
        assert.strictEqual(modManifest.id, 'eticaret');
        assert.strictEqual(modManifest.when, 'setting.eticaret');
        assert.ok(modManifest.assets && modManifest.assets.js);
        assert.ok(
            fs.existsSync(path.join(modRoot, 'eticaret-admin.js')),
            'eticaret-admin.js',
        );
        assert.ok(
            fs.existsSync(path.join(modRoot, 'eticaret-admin.css')),
            'eticaret-admin.css',
        );
        var modJs = fs.readFileSync(
            path.join(modRoot, 'eticaret-admin.js'),
            'utf8',
        );
        assert.ok(modJs.indexOf('function mxAdminEticaretPackInit') !== -1);
        assert.ok(modJs.indexOf('function mxAdminEticaretPackShowScreen') !== -1);
        assert.ok(modJs.indexOf('function mxAdminEticaretBuildNav') !== -1);
        assert.ok(modJs.indexOf('mxAdminModuleRegister') !== -1);
        assert.ok(
            modJs.indexOf(
                "setAttribute('data-mxadmin-screen', 'eticaret-settings')",
            ) !== -1,
            'eticaret-settings nav dugmesi modulde',
        );
        var sipRoot = path.join(ADMIN_ROOT, 'modules', 'siparisler');
        assert.ok(fs.existsSync(path.join(sipRoot, 'manifest.json')), 'siparisler manifest');
        var sipJs = fs.readFileSync(path.join(sipRoot, 'siparisler-admin.js'), 'utf8');
        assert.ok(
            sipJs.indexOf("setAttribute('data-mxadmin-screen', 'siparisler')") !== -1,
            'siparisler nav dugmesi siparisler modulde',
        );
        assert.ok(modJs.indexOf('=>') === -1, 'modul js arrow yasak');
        assert.ok(
            !/\bDOMContentLoaded\b/.test(modJs),
            'modul js document load event yasak',
        );

        var cariRoot = path.join(ADMIN_ROOT, 'modules', 'cari');
        assert.ok(
            fs.existsSync(path.join(cariRoot, 'manifest.json')),
            'admin/modules/cari/manifest.json',
        );
        var cariManifest = JSON.parse(
            fs.readFileSync(path.join(cariRoot, 'manifest.json'), 'utf8'),
        );
        assert.strictEqual(cariManifest.id, 'cari');
        assert.strictEqual(cariManifest.when, 'setting.cari');
        assert.ok(
            fs.existsSync(path.join(cariRoot, 'cari-admin.js')),
            'cari-admin.js',
        );
        assert.ok(
            fs.existsSync(path.join(cariRoot, 'cari-admin.css')),
            'cari-admin.css',
        );
        var cariJs = fs.readFileSync(
            path.join(cariRoot, 'cari-admin.js'),
            'utf8',
        );
        assert.ok(cariJs.indexOf('mxAdminModuleRegister') !== -1);
        assert.ok(cariJs.indexOf("id: 'cari'") !== -1);
        assert.ok(html.indexOf('id="mxadminScreenCari"') !== -1);
    });

    it('Paket 199/206: modules parse — unresolved → [core]; eticaret listesi', function () {
        var js = helpers.readAdminFile('admin.js');
        var start = js.indexOf('function mxAdminParseModulesFromRaw');
        assert.ok(start !== -1);
        var end = js.indexOf('function mxAdminParsePacksFromRaw', start);
        assert.ok(end !== -1);
        var fnSrc = js.slice(start, end);
        
        var parseFn = new Function(
            fnSrc + '; return mxAdminParseModulesFromRaw;',
        )();
        
        assert.deepStrictEqual(parseFn('{{adminModules}}'), ['core']);
        assert.deepStrictEqual(parseFn(''), ['core']);
        assert.deepStrictEqual(parseFn('not-json'), ['core']);
        assert.deepStrictEqual(parseFn('["core"]'), ['core']);
        assert.deepStrictEqual(parseFn('["core","eticaret"]'), [
            'core',
            'eticaret',
        ]);
        assert.deepStrictEqual(parseFn('["eticaret"]'), ['core', 'eticaret']);
    });

    it('Paket 207b: BuildModuleNav — kayitli buildNav; eticaret yoksa host bos', function () {
        var js = helpers.readAdminFile('admin.js');
        var start = js.indexOf('function mxAdminBuildModuleNav');
        assert.ok(start !== -1);
        var end = js.indexOf('function mxAdminBuildPackNav', start);
        assert.ok(end !== -1);
        var fnSrc = js.slice(start, end);
        var host = { innerHTML: 'STALE', appended: null };
        host.appendChild = function (node) {
            host.appended = node;
        };
        var state = { modules: ['core'] };
        var registry = {};
        var bindCalled = false;
        
        var buildFn = new Function(
            'mxAdminEl',
            'mxAdminState',
            'mxAdminModuleRegistry',
            'mxAdminBindModuleNavButtons',
            fnSrc + '; return mxAdminBuildModuleNav;',
        )(
            function () {
                return host;
            },
            state,
            registry,
            function () {
                bindCalled = true;
            },
        );
        
        buildFn();
        assert.strictEqual(host.innerHTML, '', 'host temizlenmeli');
        assert.strictEqual(
            host.appended,
            null,
            'kayit yokken section eklenmemeli',
        );
        assert.ok(bindCalled, 'bind cagrilmali');

        var fakeSection = { id: 'fake-eticaret-nav' };
        registry.eticaret = {
            id: 'eticaret',
            buildNav: function (h) {
                h.appendChild(fakeSection);
            },
        };
        state.modules = ['core', 'eticaret'];
        host.innerHTML = '';
        host.appended = null;
        buildFn();
        assert.strictEqual(
            host.appended,
            fakeSection,
            'eticaret kayitliyken buildNav cagrilmali',
        );
    });

    it('Paket 201/206: eticaret modul gercek UI (placeholder yok)', function () {
        var modRoot = path.join(ADMIN_ROOT, 'modules', 'eticaret');
        var packJs = fs.readFileSync(
            path.join(modRoot, 'eticaret-admin.js'),
            'utf8',
        );
        assert.ok(packJs.indexOf('function mxAdminEticaretPackInit') !== -1);
        assert.ok(packJs.indexOf('function mxAdminEticaretPackShowScreen') !== -1);
        assert.ok(packJs.indexOf('function mxAdminEticaretRefreshUi') !== -1);
        assert.ok(
            packJs.indexOf('function mxAdminEticaretAyarKaydet') !== -1,
            'eticaret ayar kaydet',
        );
        var sipJsPath = path.join(ADMIN_ROOT, 'modules', 'siparisler', 'siparisler-admin.js');
        var sipPackJs = fs.readFileSync(sipJsPath, 'utf8');
        assert.ok(
            sipPackJs.indexOf('function mxAdminSiparislerSiparisDetayKaydet') !== -1 ||
                sipPackJs.indexOf('function mxAdminSiparisDetayKaydet') !== -1,
            'siparis durum kaydet siparisler modulde',
        );
        assert.ok(
            sipPackJs.indexOf('/api/admin/data/siparisler') !== -1,
            'siparisler collection API',
        );
        assert.ok(
            packJs.indexOf("PUT', '/api/admin/data/setting'") !== -1 ||
                packJs.indexOf('/api/admin/data/setting') !== -1,
            'setting PUT merge yolu',
        );
        assert.ok(
            packJs.indexOf('siparislerPlaceholder') === -1,
            'placeholder i18n kalmamali',
        );
        assert.ok(
            packJs.indexOf('eticaretSettingsPlaceholder') === -1,
            'ayar placeholder i18n kalmamali',
        );
        assert.ok(packJs.indexOf('=>') === -1, 'modul js arrow yasak');
        assert.ok(
            !/\bDOMContentLoaded\b/.test(packJs),
            'modul js document load event yasak',
        );
        assert.ok(!/\blet\s+/.test(packJs), 'modul js let yasak');
        assert.ok(!/\bconst\s+/.test(packJs), 'modul js const yasak');

        var html = helpers.readAdminFile('index.html');
        assert.ok(html.indexOf('id="mxadminScreenSiparisler"') !== -1);
        assert.ok(html.indexOf('id="mxadminScreenEticaretSettings"') !== -1);

        assert.ok(
            packJs.indexOf('MXADMIN_ETICARET_I18N') !== -1 &&
                packJs.indexOf('orderDisabledHint') !== -1 &&
                packJs.indexOf('settingsGatewayHint') !== -1,
            'i18n tr+en genisletilmis',
        );
        assert.ok(
            packJs.indexOf('beklemede') !== -1 &&
                packJs.indexOf('tamamlandi') !== -1 &&
                packJs.indexOf('iptal') !== -1,
            'durum enum',
        );

        assert.deepStrictEqual(helpers.MXADMIN_ETICARET_SIPARIS_DURUM, [
            'beklemede',
            'onaylandi',
            'hazirlaniyor',
            'kargoda',
            'tamamlandi',
            'iptal',
        ]);
        assert.strictEqual(helpers.mxAdminEticaretIsValidDurum('kargoda'), true);
        assert.strictEqual(helpers.mxAdminEticaretIsValidDurum('xyz'), false);
        var filtered = helpers.mxAdminEticaretFilterSiparisler(
            [
                { no: 'A1', musteri: 'Ali', durum: 'beklemede' },
                { no: 'B2', musteri: 'Veli', durum: 'kargoda' },
            ],
            { durum: 'kargoda', q: 'vel' },
        );
        assert.strictEqual(filtered.length, 1);
        assert.strictEqual(filtered[0].no, 'B2');
        var merged = helpers.mxAdminEticaretMergeSettingFields(
            { langs: { tr: true }, description: { tr: 'x' }, name: 'Site' },
            { currency: 'USD', taxRate: '18' },
        );
        assert.strictEqual(merged.currency, 'USD');
        assert.deepStrictEqual(merged.langs, { tr: true });
        assert.deepStrictEqual(merged.description, { tr: 'x' });
        assert.strictEqual(merged.name, 'Site');
    });

    it('Paket 262: alt modul parcalama — manifest + screen id', function () {
        var html = helpers.readAdminFile('index.html');
        var moduleIds = [
            'siparisler',
            'odeme',
            'kargo',
            'sepet',
            'uyeler',
            'uye-adres',
        ];
        var screenIds = [
            'mxadminScreenSiparisler',
            'mxadminScreenEticaretSettings',
            'mxadminScreenOdemeSettings',
            'mxadminScreenKargoSettings',
            'mxadminScreenSepetSettings',
            'mxadminScreenUyeler',
            'mxadminScreenUyeAdres',
        ];
        var s;
        for (s = 0; s < screenIds.length; s++) {
            assert.ok(
                html.indexOf('id="' + screenIds[s] + '"') !== -1,
                screenIds[s] + ' index.html',
            );
        }
        var m;
        for (m = 0; m < moduleIds.length; m++) {
            var modId = moduleIds[m];
            var modRoot = path.join(ADMIN_ROOT, 'modules', modId);
            assert.ok(
                fs.existsSync(path.join(modRoot, 'manifest.json')),
                modId + ' manifest',
            );
            var manifest = JSON.parse(
                fs.readFileSync(path.join(modRoot, 'manifest.json'), 'utf8'),
            );
            assert.strictEqual(manifest.id, modId);
            assert.ok(manifest.when.indexOf('setting.') === 0, modId + ' when');
            var jsName =
                modId === 'uye-adres'
                    ? 'uyeadres-admin.js'
                    : modId + '-admin.js';
            var modJs = fs.readFileSync(path.join(modRoot, jsName), 'utf8');
            assert.ok(
                modJs.indexOf('mxAdminModuleRegister') !== -1,
                modId + ' registry',
            );
            assert.ok(modJs.indexOf("id: 'eticaret'") === -1, modId + ' eticaret id yok');
            assert.ok(modJs.indexOf('=>') === -1, modId + ' arrow yasak');
        }
        var eticJs = fs.readFileSync(
            path.join(ADMIN_ROOT, 'modules', 'eticaret', 'eticaret-admin.js'),
            'utf8',
        );
        assert.ok(
            eticJs.indexOf('mxadminEticaretPayCreditCard') === -1,
            'eticaret odeme UI yok',
        );
        assert.ok(
            eticJs.indexOf('mxadminEticaretShippingFee') === -1,
            'eticaret kargo UI yok',
        );
        assert.ok(
            eticJs.indexOf('mxAdminEticaretAyarKaydet') !== -1,
            'eticaret ayar kaydet',
        );
        var odemeJs = fs.readFileSync(
            path.join(ADMIN_ROOT, 'modules', 'odeme', 'odeme-admin.js'),
            'utf8',
        );
        assert.ok(
            odemeJs.indexOf('mxadminOdemePayCreditCard') !== -1,
            'odeme modulu',
        );
        var kargoJs = fs.readFileSync(
            path.join(ADMIN_ROOT, 'modules', 'kargo', 'kargo-admin.js'),
            'utf8',
        );
        assert.ok(
            kargoJs.indexOf('mxadminKargoShippingFee') !== -1,
            'kargo modulu',
        );
    });
});
