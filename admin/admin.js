

var MX_ADMIN_API_BASE = 'https://webmaker.yunusevgane.workers.dev';


var MX_ADMIN_SITE_LOGO = 'logo.png';


var MXADMIN_PANEL_VERSION = '1.5.2';

(function mxAdminResolveLocalApiBase() {
    if (typeof window === 'undefined' || !window.location) {
        return;
    }
    var host = (window.location.hostname || '').toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1') {
        MX_ADMIN_API_BASE = window.location.origin;
    }
})();


var mxAdminExternalConfirmDelete =
    typeof Global_confirmDelete === 'function' ? Global_confirmDelete : null;


function mxAdminConfirmOverlayRemove() {
    var root = document.getElementById('mxadminConfirmRoot');
    if (root) {
        root.remove();
    }
}


function mxAdminConfirmDeleteEscape(str) {
    if (str == null) {
        return '';
    }
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}


function mxAdminConfirmDelete(message, opts) {
    if (
        mxAdminExternalConfirmDelete &&
        mxAdminExternalConfirmDelete !== mxAdminConfirmDelete
    ) {
        return mxAdminExternalConfirmDelete(message, opts);
    }
    return new Promise(function (resolve) {
        opts = opts || {};
        var title = opts.title || 'Emin misiniz?';
        var icon = opts.icon || 'delete_forever';
        var confirmText = opts.confirmText || 'Evet, sil';
        var cancelText = opts.cancelText || 'İptal';
        var hasExtra =
            typeof opts.extraText === 'string' && opts.extraText.length > 0;
        var extraValue = 'extraValue' in opts ? opts.extraValue : true;

        mxAdminConfirmOverlayRemove();

        var safeTitle = mxAdminConfirmDeleteEscape(title);
        var safeMsg = message ? mxAdminConfirmDeleteEscape(message) : '';
        var safeIcon = mxAdminConfirmDeleteEscape(icon);
        var safeConfirm = mxAdminConfirmDeleteEscape(confirmText);
        var safeCancel = mxAdminConfirmDeleteEscape(cancelText);
        var safeExtra = hasExtra
            ? mxAdminConfirmDeleteEscape(opts.extraText)
            : '';

        var html =
            '<div class="mxadmin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="mxadmin-confirm-title" onclick="event.stopPropagation()">' +
            '<span class="material-symbols-outlined mxadmin-confirm-icon" aria-hidden="true">' +
            safeIcon +
            '</span>' +
            '<h3 class="mxadmin-confirm-title" id="mxadmin-confirm-title">' +
            safeTitle +
            '</h3>' +
            (safeMsg
                ? '<p class="mxadmin-confirm-message">' + safeMsg + '</p>'
                : '') +
            '<div class="mxadmin-confirm-actions">' +
            '<div class="mxadmin-confirm-btn mxadmin-confirm-btn-cancel" role="button" tabindex="0">' +
            safeCancel +
            '</div>' +
            (hasExtra
                ? '<div class="mxadmin-confirm-btn mxadmin-confirm-btn-extra" role="button" tabindex="0">' +
                  safeExtra +
                  '</div>'
                : '') +
            '<div class="mxadmin-confirm-btn mxadmin-confirm-btn-danger mxadmin-confirm-enter-hint" role="button" tabindex="0" title="Enter ile onayla">' +
            safeConfirm +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="mxadmin-confirm-backdrop"></div>';

        var modal = document.createElement('div');
        modal.id = 'mxadminConfirmRoot';
        modal.className = 'mxadmin-confirm-root';
        modal.innerHTML = html;
        document.body.appendChild(modal);

        function finish(value) {
            mxAdminConfirmOverlayRemove();
            resolve(value);
        }

        var dangerBtn = modal.querySelector('.mxadmin-confirm-btn-danger');
        var cancelBtn = modal.querySelector('.mxadmin-confirm-btn-cancel');
        var extraBtn = modal.querySelector('.mxadmin-confirm-btn-extra');
        var backdrop = modal.querySelector('.mxadmin-confirm-backdrop');

        dangerBtn.addEventListener('click', function () {
            finish(true);
        });
        cancelBtn.addEventListener('click', function () {
            finish(false);
        });
        if (extraBtn) {
            extraBtn.addEventListener('click', function () {
                finish(extraValue);
            });
        }
        backdrop.addEventListener('click', function () {
            finish(false);
        });

        modal.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') {
                finish(false);
            }
            if (ev.key === 'Enter') {
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                finish(true);
            }
        });

        setTimeout(function () {
            if (dangerBtn && dangerBtn.focus) {
                dangerBtn.focus();
            }
        }, 50);
    });
}

var MX_ADMIN_I18N = {
    tr: {
        appTitle: 'Site Yönetimi',
        navDashboard: 'Dashboard',
        sidebarPages: 'Sayfalar',
        sidebarPagesEmpty: 'Kategori yok',
        navModules: 'Modüller',
        navSettings: 'Ayarlar',
        navDesign: 'Tasarım',
        loginTitle: 'Site Yönetimi',
        loginSub: 'Devam etmek için giriş yapın',
        labelUsername: 'Kullanıcı adı veya e-posta',
        labelPassword: 'Parola',
        loginSubmit: 'Giriş Yap',
        loginHint:
            'Bu panelden yeni kullanıcı oluşturulamaz — kullanıcı ekleme yalnızca site yöneticiniz tarafından yapılır.',
        loginErrorInvalid: 'Kullanıcı adı/e-posta veya parola hatalı.',
        loginErrorNetwork:
            'Yönetim sunucusuna bağlanılamadı. Lütfen daha sonra tekrar deneyin.',
        passwordShow: 'Parolayı göster',
        passwordHide: 'Parolayı gizle',
        navMenu: 'Menü',
        categoriesEdit: 'Kategori düzenle',
        logout: 'Çıkış',
        panelVersionTitle: 'Panel sürümü',
        configWarning:
            'Yönetim API adresi henüz yapılandırılmamış. Lütfen site yöneticinizle iletişime geçin.',
        loading: 'Yükleniyor…',
        save: 'Kaydet',
        cancel: 'İptal',
        saveSuccess: 'Kaydedildi.',
        saveError: 'Kaydedilemedi. Lütfen tekrar deneyin.',
        publishCardTitle: 'Site güncelleniyor',
        publishCardTitleLive: 'Site güncel',
        publishCardTitleError: 'Yayın hatası',
        publishCardTitleLocal: 'Yerel kayıt',
        publishStepSaved: 'Veri kaydedildi',
        publishStepTriggered: 'Yayın tetiklendi',
        publishStepBuilding: 'Site güncelleniyor',
        publishStepLive: 'Yayında',
        dashboardTitle: 'Dashboard',
        dashboardSub: 'Site özeti ve hızlı erişim',
        statsOverview: 'Site özeti',
        cardDomain: 'Alan adı',
        cardUsername: 'Kullanıcı',
        cardCategories: 'Kategori',
        cardPages: 'Sayfa',
        mustResetWarning:
            'Parolanızın sıfırlanması gerekiyor. Lütfen site yöneticinizle iletişime geçin.',
        loginHistoryTitle: 'Giriş geçmişiniz',
        loginHistoryEmpty: 'Kayıt bulunamadı.',
        loginHistoryError: 'Giriş geçmişi yüklenemedi.',
        colDate: 'Tarih',
        colIp: 'IP',
        colDevice: 'Cihaz',
        colResult: 'Sonuç',
        resultSuccess: 'Başarılı',
        resultFail: 'Başarısız',
        categoriesTitle: 'Kategoriler',
        categoriesSub: 'pagesetting.json — site bölümleri',
        categoriesBack: 'Sayfalara dön',
        categoriesListTitle: 'Kategori listesi',
        categoriesLoadError: 'Kategoriler yüklenemedi.',
        categoryActive: 'Aktif',
        categoryPassive: 'Pasif',
        pagesTitle: 'Sayfalar',
        pagesSub: 'Kategori bazlı içerik yönetimi',
        pagesListHead: 'Sayfa listesi',
        listRefresh: 'Listeyi yenile',
        pagesEmpty: 'Sayfa bulunamadı.',
        pagesEmptyFiltered: 'Filtreye uygun sayfa bulunamadı.',
        pagesLoadError: 'Sayfalar yüklenemedi.',
        pagesSearchPlaceholder: 'Ara…',
        pagesFilterAll: 'Tümü',
        pagesFilterEmpty: '(boş)',
        pagesFilterCategorized: 'Kategorili',
        pagesFilterUncategorized: 'Kategorisiz',
        pagesFilterMismatch: 'Toplam Uyumsuz',
        pagesFilterCategory: 'Kategori',
        pagesFilterUncategorizedOption: 'Kategorisiz',
        pageEditTitle: 'Sayfa düzenle',
        pageDetailEmptyTitle: 'Sayfa seçin',
        pageDetailEmptySub: 'Listeden düzenlemek istediğiniz sayfayı seçin.',
        pageDetailBack: 'Listeye dön',
        tabGeneral: 'Genel',
        tabContent: 'İçerik',
        fieldName: 'Ad',
        fieldDescription: 'Açıklama',
        fieldStatus: 'Durum',
        fieldPath: 'Path',
        fieldKeyword: 'Anahtar kelime',
        fieldText: 'İçerik metni',
        pageHtmlTabSource: 'HTML',
        pageHtmlTabPreview: 'Önizleme',
        pageHtmlBold: 'Kalın',
        pageHtmlItalic: 'İtalik',
        pageHtmlLink: 'Link',
        pageHtmlH2: 'Başlık 2',
        pageHtmlH3: 'Başlık 3',
        pageHtmlP: 'Paragraf',
        pageHtmlUl: 'Liste',
        pageDescTitle: 'Ürün özellikleri',
        pagesMoveUp: 'Yukarı taşı',
        pagesMoveDown: 'Aşağı taşı',
        pagesReorderSuccess: 'Sayfa sırası kaydedildi.',
        pagesReorderError: 'Sayfa sırası kaydedilemedi.',
        pagesReorderSearchBlock: 'Sıralamak için aramayı temizleyin.',
        pageAdd: 'Sayfa ekle',
        pageDelete: 'Sil',
        pageDeleteConfirmTitle: 'Sayfayı sil',
        pageDeleteConfirmBody: 'Bu sayfa kalıcı olarak silinecek.',
        pageAddSuccess: 'Sayfa eklendi.',
        pageDeleteSuccess: 'Sayfa silindi.',
        pageAddNoCategory: 'Kategori seçilmedi; sayfa eklenemez.',
        pageAddError: 'Sayfa eklenemedi.',
        pageDeleteError: 'Sayfa silinemedi.',
        statusPlay: 'Yayında',
        statusPause: 'Pasif',
        modulesTitle: 'Modüller',
        modulesSub: 'Site modüllerini düzenleyin',
        modulesListTitle: 'Modül listesi',
        modulesSearchPlaceholder: 'Ara…',
        modulesLoadError: 'Modüller yüklenemedi.',
        modulesEmpty: 'Modül bulunamadı.',
        modulesSaveError: 'Modül kaydedilemedi.',
        moduleDetailEmptyTitle: 'Modül seçin',
        moduleDetailEmptySub:
            'Soldaki listeden düzenlemek istediğiniz modülü seçin.',
        moduleDataAdd: 'Satır ekle',
        moduleDataRemove: 'Sil',
        moduleDataEmpty: 'Bu modülde düzenlenebilir veri satırı yok.',
        moduleDataRow: 'Satır',
        moduleMediaUpload: 'Dosya yükle',
        moduleMediaEmpty: 'Henüz dosya yok.',
        moduleMediaUploadSuccess: 'Dosya yüklendi.',
        moduleMediaUploadError: 'Dosya yüklenemedi.',
        moduleMediaDeleteSuccess: 'Dosya silindi.',
        pageMediaTitle: 'Sayfa görselleri',
        pageMediaCoverHint: 'Kapak görseli için küçük resme tıklayın.',
        pageMediaCoverBadge: 'Kapak',
        tabMedia: 'Dosyalar',
        fieldModuleId: 'Modül ID',
        fieldCategory: 'Kategori',
        fieldLocal: 'Konum',
        settingsTitle: 'Ayarlar',
        settingsSub: 'Genel bilgiler ve iletişim',
        settingsGeneral: 'Genel bilgiler',
        settingsContact: 'İletişim',
        settingsSeo: 'SEO',
        settingsLoadError: 'Ayarlar yüklenemedi.',
        fieldSiteName: 'Site adı',
        fieldDomain: 'Alan adı',
        fieldLogo: 'Logo',
        logoUpdate: 'Logo güncelle',
        logoUploadSuccess: 'Logo güncellendi.',
        logoUploadError: 'Logo yüklenemedi.',
        logoUploadInvalid:
            'Geçerli bir görsel dosyası seçin (png, jpg, webp, svg, gif).',
        logoEmpty: 'Logo yok',
        fieldPhone: 'Telefon',
        fieldMobile: 'Cep',
        fieldEmail: 'E-posta',
        fieldAddress: 'Adres',
        fieldPerson: 'Yetkili',
        fieldTitle: 'Ünvan',
        designTitle: 'Tasarım',
        designSub: "Renk token'ları ve yerleşim özeti",
        designLiteTheme: 'Açık tema',
        designDarkTheme: 'Koyu tema',
        designLoadError: 'Tasarım renkleri yüklenemedi.',
        layoutTitle: 'Anasayfa yerleşimi',
        layoutReadonly: 'Salt okunur',
        layoutHeader: 'Header',
        layoutBody: 'Body',
        layoutFooter: 'Footer',
        layoutEmpty: 'Modül yok',
        layoutModuleHint: 'Düzenlemek için modüle tıklayın',
        moduleNotFound: 'Modül bulunamadı.',
        metaRows: 'satır',
        metaPages: 'sayfa',
        metaModules: 'modül',
        metaTokens: 'token',
        notConfigured: 'Yönetim API adresi yapılandırılmamış.',
        networkError: 'Bağlantı kesildi — tekrar deneyin.',
        serverReadError: 'Canlı site okunamadı.',
        unauthorized: 'Oturum sona ermiş, lütfen tekrar giriş yapın.',
    },
    en: {
        appTitle: 'Site Admin',
        navDashboard: 'Dashboard',
        sidebarPages: 'Pages',
        sidebarPagesEmpty: 'No categories',
        navModules: 'Modules',
        navSettings: 'Settings',
        navDesign: 'Design',
        loginTitle: 'Site Admin',
        loginSub: 'Sign in to continue',
        labelUsername: 'Username or email',
        labelPassword: 'Password',
        loginSubmit: 'Sign In',
        loginHint:
            'New users cannot be created from this panel — user accounts are managed by your site administrator.',
        loginErrorInvalid: 'Invalid username/email or password.',
        loginErrorNetwork:
            'Could not reach the admin server. Please try again later.',
        passwordShow: 'Show password',
        passwordHide: 'Hide password',
        navMenu: 'Menu',
        categoriesEdit: 'Edit categories',
        logout: 'Sign out',
        panelVersionTitle: 'Panel version',
        configWarning:
            'The admin API address is not configured yet. Please contact your site administrator.',
        loading: 'Loading…',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Saved.',
        saveError: 'Could not save. Please try again.',
        publishCardTitle: 'Updating site',
        publishCardTitleLive: 'Site is live',
        publishCardTitleError: 'Publish error',
        publishCardTitleLocal: 'Local save',
        publishStepSaved: 'Data saved',
        publishStepTriggered: 'Publish triggered',
        publishStepBuilding: 'Updating site',
        publishStepLive: 'Live',
        dashboardTitle: 'Dashboard',
        dashboardSub: 'Site overview and quick access',
        statsOverview: 'Site overview',
        cardDomain: 'Domain',
        cardUsername: 'User',
        cardCategories: 'Categories',
        cardPages: 'Pages',
        mustResetWarning:
            'Your password must be reset. Please contact your site administrator.',
        loginHistoryTitle: 'Your login history',
        loginHistoryEmpty: 'No records found.',
        loginHistoryError: 'Could not load login history.',
        colDate: 'Date',
        colIp: 'IP',
        colDevice: 'Device',
        colResult: 'Result',
        resultSuccess: 'Success',
        resultFail: 'Failed',
        categoriesTitle: 'Categories',
        categoriesSub: 'pagesetting.json — site sections',
        categoriesBack: 'Back to pages',
        categoriesListTitle: 'Category list',
        categoriesLoadError: 'Could not load categories.',
        categoryActive: 'Active',
        categoryPassive: 'Inactive',
        pagesTitle: 'Pages',
        pagesSub: 'Category-based content management',
        pagesListHead: 'Page list',
        listRefresh: 'Refresh list',
        pagesEmpty: 'No pages found.',
        pagesEmptyFiltered: 'No pages match the filter.',
        pagesLoadError: 'Could not load pages.',
        pagesSearchPlaceholder: 'Search…',
        pagesFilterAll: 'All',
        pagesFilterEmpty: '(empty)',
        pagesFilterCategorized: 'Categorized',
        pagesFilterUncategorized: 'Uncategorized',
        pagesFilterMismatch: 'Total mismatched',
        pagesFilterCategory: 'Category',
        pagesFilterUncategorizedOption: 'Uncategorized',
        pageEditTitle: 'Edit page',
        pageDetailEmptyTitle: 'Select a page',
        pageDetailEmptySub: 'Choose a page from the list to edit.',
        pageDetailBack: 'Back to list',
        tabGeneral: 'General',
        tabContent: 'Content',
        fieldName: 'Name',
        fieldDescription: 'Description',
        fieldStatus: 'Status',
        fieldPath: 'Path',
        fieldKeyword: 'Keyword',
        fieldText: 'Body text',
        pageHtmlTabSource: 'HTML',
        pageHtmlTabPreview: 'Preview',
        pageHtmlBold: 'Bold',
        pageHtmlItalic: 'Italic',
        pageHtmlLink: 'Link',
        pageHtmlH2: 'Heading 2',
        pageHtmlH3: 'Heading 3',
        pageHtmlP: 'Paragraph',
        pageHtmlUl: 'List',
        pageDescTitle: 'Product attributes',
        pagesMoveUp: 'Move up',
        pagesMoveDown: 'Move down',
        pagesReorderSuccess: 'Page order saved.',
        pagesReorderError: 'Could not save page order.',
        pagesReorderSearchBlock: 'Clear search to reorder pages.',
        pageAdd: 'Add page',
        pageDelete: 'Delete',
        pageDeleteConfirmTitle: 'Delete page',
        pageDeleteConfirmBody: 'This page will be permanently deleted.',
        pageAddSuccess: 'Page added.',
        pageDeleteSuccess: 'Page deleted.',
        pageAddNoCategory: 'No category selected; cannot add a page.',
        pageAddError: 'Could not add page.',
        pageDeleteError: 'Could not delete page.',
        statusPlay: 'Live',
        statusPause: 'Hidden',
        modulesTitle: 'Modules',
        modulesSub: 'Edit site modules',
        modulesListTitle: 'Module list',
        modulesSearchPlaceholder: 'Search…',
        modulesLoadError: 'Could not load modules.',
        modulesEmpty: 'No modules found.',
        modulesSaveError: 'Could not save module.',
        moduleDetailEmptyTitle: 'Select a module',
        moduleDetailEmptySub:
            'Choose a module from the list on the left to edit it.',
        moduleDataAdd: 'Add row',
        moduleDataRemove: 'Remove',
        moduleDataEmpty: 'No editable data rows for this module.',
        moduleDataRow: 'Row',
        moduleMediaUpload: 'Upload file',
        moduleMediaEmpty: 'No files yet.',
        moduleMediaUploadSuccess: 'File uploaded.',
        moduleMediaUploadError: 'Could not upload file.',
        moduleMediaDeleteSuccess: 'File deleted.',
        pageMediaTitle: 'Page images',
        pageMediaCoverHint: 'Click a thumbnail to set the cover image.',
        pageMediaCoverBadge: 'Cover',
        tabMedia: 'Files',
        fieldModuleId: 'Module ID',
        fieldCategory: 'Category',
        fieldLocal: 'Placement',
        settingsTitle: 'Settings',
        settingsSub: 'General info and contact',
        settingsGeneral: 'General info',
        settingsContact: 'Contact',
        settingsSeo: 'SEO',
        settingsLoadError: 'Could not load settings.',
        fieldSiteName: 'Site name',
        fieldDomain: 'Domain',
        fieldLogo: 'Logo',
        logoUpdate: 'Update logo',
        logoUploadSuccess: 'Logo updated.',
        logoUploadError: 'Could not upload logo.',
        logoUploadInvalid:
            'Choose a valid image file (png, jpg, webp, svg, gif).',
        logoEmpty: 'No logo',
        fieldPhone: 'Phone',
        fieldMobile: 'Mobile',
        fieldEmail: 'Email',
        fieldAddress: 'Address',
        fieldPerson: 'Contact person',
        fieldTitle: 'Title',
        designTitle: 'Design',
        designSub: 'Color tokens and layout summary',
        designLiteTheme: 'Light theme',
        designDarkTheme: 'Dark theme',
        designLoadError: 'Could not load design colors.',
        layoutTitle: 'Home layout',
        layoutReadonly: 'Read only',
        layoutHeader: 'Header',
        layoutBody: 'Body',
        layoutFooter: 'Footer',
        layoutEmpty: 'No modules',
        layoutModuleHint: 'Click a module to edit',
        moduleNotFound: 'Module not found.',
        metaRows: 'rows',
        metaPages: 'pages',
        metaModules: 'modules',
        metaTokens: 'tokens',
        notConfigured: 'Admin API address is not configured.',
        networkError: 'Connection lost — please try again.',
        serverReadError: 'Could not read the live site.',
        unauthorized: 'Your session has expired, please sign in again.',
    },
};

var mxAdminState = {
    lang: 'tr',
    screen: 'dashboard',
    me: null,
    settingData: null,
    pagesettingData: null,
    activeCategoryPath: null,
    categoryDoc: null,
    categoryPages: [],
    activePageRow: null,
    pageRecord: null,
    pagesSearch: '',
    modulesSearch: '',
    desingData: null,
    modulesList: null,
    modulesDoc: null,
    activeModuleRow: null,
    activeModuleIndex: -1,
    moduleRecord: null,
    moduleFiles: [],
    moduleSupportsMedia: false,
    moduleDataTemplate: null,
    activeModuleTab: 'general',
    pendingModuleId: '',
    activePageTab: 'general',
    pageFiles: [],
    pageCategoryFilter: 'all',
    pageDescFilters: {},
    pageDescById: {},
    pageDescCacheLoading: false,
    loaded: {
        dashboard: false,
        categories: false,
        pages: false,
        modules: false,
        settings: false,
        design: false,
    },
};


var MX_ADMIN_PAGE_CATEGORY_NONE = '__none__';



function mxAdminEl(id) {
    return document.getElementById(id);
}

function mxAdminT(key) {
    var dict = MX_ADMIN_I18N[mxAdminState.lang] || MX_ADMIN_I18N.tr;
    return dict[key] !== undefined ? dict[key] : key;
}

function mxAdminApplyI18n() {
    var nodes = document.querySelectorAll('[data-mxadmin-i18n]');
    var i;
    for (i = 0; i < nodes.length; i++) {
        
        if (nodes[i].querySelector('[data-mxadmin-i18n]')) {
            continue;
        }
        var key = nodes[i].getAttribute('data-mxadmin-i18n');
        nodes[i].textContent = mxAdminT(key);
    }
    var phNodes = document.querySelectorAll('[data-mxadmin-i18n-placeholder]');
    for (i = 0; i < phNodes.length; i++) {
        var phKey = phNodes[i].getAttribute('data-mxadmin-i18n-placeholder');
        phNodes[i].setAttribute('placeholder', mxAdminT(phKey));
    }
    var titleNodes = document.querySelectorAll('[data-mxadmin-i18n-title]');
    for (i = 0; i < titleNodes.length; i++) {
        titleNodes[i].setAttribute(
            'title',
            mxAdminT(titleNodes[i].getAttribute('data-mxadmin-i18n-title')),
        );
    }
    var ariaNodes = document.querySelectorAll('[data-mxadmin-i18n-aria]');
    for (i = 0; i < ariaNodes.length; i++) {
        ariaNodes[i].setAttribute(
            'aria-label',
            mxAdminT(ariaNodes[i].getAttribute('data-mxadmin-i18n-aria')),
        );
    }
    document.documentElement.setAttribute('lang', mxAdminState.lang);
    var toggleBtn = mxAdminEl('mxadminLangToggle');
    if (toggleBtn) {
        toggleBtn.textContent = mxAdminState.lang === 'tr' ? 'EN' : 'TR';
    }
    document.title = mxAdminT('appTitle');
    var emptyHistory = mxAdminEl('mxadminHistoryEmpty');
    if (emptyHistory) {
        emptyHistory.textContent = mxAdminT('loginHistoryEmpty');
    }
    var emptyPages = mxAdminEl('mxadminPagesEmpty');
    if (emptyPages) {
        emptyPages.textContent = mxAdminT('pagesEmpty');
    }
    var emptyModules = mxAdminEl('mxadminModulesEmpty');
    if (emptyModules) {
        emptyModules.textContent = mxAdminT('modulesEmpty');
    }
    var mustReset = mxAdminEl('mxadminMustResetWarning');
    if (mustReset && !mustReset.classList.contains('hidden')) {
        mustReset.textContent = mxAdminT('mustResetWarning');
    }
    mxAdminSyncPasswordToggleA11y();
}

function mxAdminSetLang(lang) {
    mxAdminState.lang = lang === 'en' ? 'en' : 'tr';
    mxAdminApplyI18n();
    if (mxAdminState.screen === 'pages' && mxAdminState.categoryPages.length) {
        mxAdminRenderPageFilters();
        mxAdminRenderPagesList();
        mxAdminUpdatePagesScreenHead(mxAdminState.activeCategoryPath);
        if (mxAdminState.activePageRow) {
            mxAdminUpdatePageDetailHeader(mxAdminState.activePageRow);
        }
    }
    var pageDetailBack = mxAdminEl('mxadminPageDetailBack');
    if (pageDetailBack) {
        pageDetailBack.setAttribute('title', mxAdminT('pageDetailBack'));
    }
    var categoriesBackBtn = mxAdminEl('mxadminCategoriesBackBtn');
    if (categoriesBackBtn) {
        categoriesBackBtn.setAttribute('title', mxAdminT('categoriesBack'));
    }
    if (mxAdminState.screen === 'modules' && mxAdminState.modulesList) {
        mxAdminRenderModulesList();
        if (mxAdminState.activeModuleRow) {
            mxAdminRenderModuleEditor();
        }
    }
    if (mxAdminState.screen === 'design' && mxAdminState.desingData) {
        mxAdminRenderDesignForm(mxAdminState.desingData);
    }
    if (mxAdminState.screen === 'categories' && mxAdminState.pagesettingData) {
        var catRows = mxAdminState.pagesettingData.data || [];
        mxAdminUpdateCategoriesMeta(catRows.length);
    }
    mxAdminRenderSidebarCategories();
    mxAdminUpdateUserChip();
}

function mxAdminShowAlert(elId, message) {
    var el = mxAdminEl(elId);
    if (!el) {
        return;
    }
    if (!message) {
        el.classList.add('hidden');
        el.textContent = '';
        return;
    }
    el.textContent = message;
    el.classList.remove('hidden');
}

function mxAdminToast(message, isError) {
    var toast = mxAdminEl('mxadminToast');
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.remove('hidden');
    if (isError) {
        toast.classList.add('mxadmin-toast-error');
    } else {
        toast.classList.remove('mxadmin-toast-error');
    }
    setTimeout(function () {
        toast.classList.add('hidden');
    }, 3200);
}

function mxAdminEscapeHtml(value) {
    var str = value == null ? '' : String(value);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


function mxAdminFormatDevice(ua) {
    if (!ua) {
        return '—';
    }
    var s = String(ua);
    var lower = s.toLowerCase();
    if (
        lower.indexOf('curl/') !== -1 ||
        lower.indexOf('curl ') === 0 ||
        lower === 'curl'
    ) {
        return 'curl';
    }
    if (lower.indexOf('cursor') !== -1) {
        return 'Cursor Agent';
    }
    if (lower.indexOf('postman') !== -1) {
        return 'Postman';
    }
    if (lower.indexOf('insomnia') !== -1) {
        return 'Insomnia';
    }
    var browser = '';
    if (lower.indexOf('edg/') !== -1 || lower.indexOf('edge/') !== -1) {
        browser = 'Edge';
    } else if (lower.indexOf('firefox/') !== -1) {
        browser = 'Firefox';
    } else if (
        lower.indexOf('chrome/') !== -1 ||
        lower.indexOf('crios/') !== -1
    ) {
        browser = 'Chrome';
    } else if (
        lower.indexOf('safari/') !== -1 &&
        lower.indexOf('chrome') === -1
    ) {
        browser = 'Safari';
    }
    var os = '';
    if (lower.indexOf('windows') !== -1) {
        os = 'Windows';
    } else if (
        lower.indexOf('mac os') !== -1 ||
        lower.indexOf('macintosh') !== -1
    ) {
        os = 'macOS';
    } else if (lower.indexOf('android') !== -1) {
        os = 'Android';
    } else if (lower.indexOf('iphone') !== -1 || lower.indexOf('ipad') !== -1) {
        os = 'iOS';
    } else if (lower.indexOf('linux') !== -1) {
        os = 'Linux';
    }
    if (browser && os) {
        return browser + ' · ' + os;
    }
    if (browser) {
        return browser;
    }
    if (os) {
        return os;
    }
    if (s.length > 48) {
        return s.substring(0, 45) + '…';
    }
    return s;
}

function mxAdminUpdateCategoriesMeta(count) {
    var meta = mxAdminEl('mxadminCategoriesMeta');
    if (meta) {
        meta.textContent = String(count || 0) + ' ' + mxAdminT('metaRows');
    }
}

function mxAdminGetPageDisplayName(pageRow, fallbackIndex) {
    var lang = mxAdminState.lang;
    var page = pageRow || {};
    var name = mxAdminPickLocalized(page.name, lang);
    if (name) {
        return name;
    }
    if (page.path) {
        return page.path;
    }
    if (fallbackIndex !== undefined && fallbackIndex !== null) {
        return '#' + fallbackIndex;
    }
    return '';
}

function mxAdminUpdatePagesListMeta(count) {
    var countEl = mxAdminEl('mxadminPagesListCount');
    if (countEl) {
        var info = String(count || 0) + ' ' + mxAdminT('metaPages');
        var activeName = mxAdminGetPageDisplayName(
            mxAdminState.activePageRow,
            null,
        );
        if (activeName) {
            info += ' · ' + activeName;
        }
        countEl.textContent = info;
    }
}

function mxAdminUpdateModulesMeta(count) {
    var meta = mxAdminEl('mxadminModulesMeta');
    if (meta) {
        meta.textContent = String(count || 0) + ' ' + mxAdminT('metaModules');
    }
}

function mxAdminUpdateDesignColorMeta(themeKey, count) {
    var metaId =
        themeKey === 'dark' ? 'mxadminDesignDarkMeta' : 'mxadminDesignLiteMeta';
    var meta = mxAdminEl(metaId);
    if (meta) {
        meta.textContent = String(count || 0) + ' ' + mxAdminT('metaTokens');
    }
}

function mxAdminSetPagesDetailOpen(isOpen) {
    var ws = mxAdminEl('mxadminPagesWorkspace');
    if (!ws) {
        return;
    }
    if (isOpen) {
        ws.classList.add('is-detail-open');
    } else {
        ws.classList.remove('is-detail-open');
    }
}

function mxAdminShowPageDetailEmpty() {
    var emptyEl = mxAdminEl('mxadminPageDetailEmpty');
    var loadEl = mxAdminEl('mxadminPageDetailLoading');
    var formEl = mxAdminEl('mxadminPageForm');
    if (emptyEl) {
        emptyEl.classList.remove('hidden');
    }
    if (loadEl) {
        loadEl.classList.add('hidden');
    }
    if (formEl) {
        formEl.classList.add('hidden');
    }
    mxAdminSetPagesDetailOpen(false);
    mxAdminRenderPageMediaPanel(null);
}

function mxAdminShowPageDetailLoading(show) {
    var emptyEl = mxAdminEl('mxadminPageDetailEmpty');
    var loadEl = mxAdminEl('mxadminPageDetailLoading');
    var formEl = mxAdminEl('mxadminPageForm');
    if (show) {
        if (emptyEl) {
            emptyEl.classList.add('hidden');
        }
        if (formEl) {
            formEl.classList.add('hidden');
        }
        if (loadEl) {
            loadEl.classList.remove('hidden');
        }
        mxAdminSetPagesDetailOpen(true);
    } else if (loadEl) {
        loadEl.classList.add('hidden');
    }
}

function mxAdminShowPageDetailForm() {
    var emptyEl = mxAdminEl('mxadminPageDetailEmpty');
    var loadEl = mxAdminEl('mxadminPageDetailLoading');
    var formEl = mxAdminEl('mxadminPageForm');
    if (emptyEl) {
        emptyEl.classList.add('hidden');
    }
    if (loadEl) {
        loadEl.classList.add('hidden');
    }
    if (formEl) {
        formEl.classList.remove('hidden');
    }
    mxAdminSetPagesDetailOpen(true);
}

function mxAdminUpdatePageDetailHeader(pageRow) {
    var titleEl = mxAdminEl('mxadminPageDetailTitle');
    var pathEl = mxAdminEl('mxadminPageDetailPath');
    var badgeLive = mxAdminEl('mxadminPageDetailBadgeLive');
    var badgePause = mxAdminEl('mxadminPageDetailBadgePause');
    if (!pageRow || !titleEl) {
        return;
    }
    var lang = mxAdminState.lang;
    var name = mxAdminPickLocalized(pageRow.name, lang);
    var displayName = name || pageRow.path || '—';
    titleEl.textContent = displayName;
    if (pathEl) {
        pathEl.textContent = '/' + (pageRow.path || '');
    }
    var isLive = pageRow.status !== 'pause';
    if (badgeLive) {
        badgeLive.textContent = mxAdminT('statusPlay');
        if (isLive) {
            badgeLive.classList.remove('hidden');
        } else {
            badgeLive.classList.add('hidden');
        }
    }
    if (badgePause) {
        badgePause.textContent = mxAdminT('statusPause');
        if (!isLive) {
            badgePause.classList.remove('hidden');
        } else {
            badgePause.classList.add('hidden');
        }
    }
}


function mxAdminUnwrapApiData(resp) {
    if (!resp) {
        return resp;
    }
    if (
        resp.data &&
        typeof resp.data === 'object' &&
        !Array.isArray(resp.data)
    ) {
        return resp.data;
    }
    return resp;
}

function mxAdminPickLocalized(obj, lang) {
    if (obj == null) {
        return '';
    }
    if (typeof obj === 'string' || typeof obj === 'number') {
        return String(obj);
    }
    if (typeof obj === 'object') {
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
    return '';
}


function mxAdminSettingScalarToInput(val, lang) {
    return mxAdminPickLocalized(val, lang || mxAdminState.lang || 'tr');
}

function mxAdminActiveLangs() {
    var setting = mxAdminState.settingData;
    if (setting && setting.langs && typeof setting.langs === 'object') {
        var langs = [];
        var key;
        for (key in setting.langs) {
            if (
                Object.prototype.hasOwnProperty.call(setting.langs, key) &&
                setting.langs[key]
            ) {
                langs.push(key);
            }
        }
        if (langs.length) {
            return langs;
        }
    }
    return ['tr', 'en'];
}

function mxAdminEnsureSettingForLangs(done) {
    if (mxAdminState.settingData) {
        done();
        return;
    }
    mxAdminApiRequest('GET', '/api/admin/data/setting')
        .then(function (resp) {
            mxAdminState.settingData = mxAdminUnwrapApiData(resp) || {};
            mxAdminApplySiteLogo(mxAdminState.settingData);
            done();
        })
        .catch(function () {
            done();
        });
}



function mxAdminApiConfigured() {
    return !!(MX_ADMIN_API_BASE && MX_ADMIN_API_BASE.indexOf('{{') !== 0);
}

function mxAdminApiUrl(pathSuffix) {
    if (!mxAdminApiConfigured()) {
        return '';
    }
    return MX_ADMIN_API_BASE.replace(/\/+$/, '') + pathSuffix;
}


function mxAdminCreateFetchAbortSignal(timeoutMs) {
    var ms = typeof timeoutMs === 'number' ? timeoutMs : 30000;
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        try {
            return AbortSignal.timeout(ms);
        } catch (signalErr) {
            
        }
    }
    if (typeof AbortController !== 'undefined') {
        var controller = new AbortController();
        setTimeout(function () {
            try {
                controller.abort();
            } catch (abortErr) {
                
            }
        }, ms);
        return controller.signal;
    }
    return undefined;
}

function mxAdminApiRequestOnce(method, pathSuffix, body) {
    return new Promise(function (resolve, reject) {
        if (!mxAdminApiConfigured()) {
            reject({ code: 'NOT_CONFIGURED' });
            return;
        }
        var url = mxAdminApiUrl(pathSuffix);
        var opts = {
            method: method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        };
        var fetchSignal = mxAdminCreateFetchAbortSignal(30000);
        if (fetchSignal) {
            opts.signal = fetchSignal;
        }
        var apiHost = '';
        var pageHost = (window.location.hostname || '').toLowerCase();
        try {
            apiHost = new URL(MX_ADMIN_API_BASE).hostname.toLowerCase();
        } catch (apiHostErr) {
            apiHost = '';
        }
        if (apiHost && pageHost && apiHost !== pageHost) {
            opts.headers['X-Matrix-Preview-Domain'] = pageHost;
        }
        if (body !== undefined) {
            opts.body = JSON.stringify(body);
        }
        var request;
        try {
            request = fetch(url, opts);
        } catch (syncErr) {
            reject({ code: 'NETWORK' });
            return;
        }
        request
            .then(function (res) {
                res.text()
                    .then(function (text) {
                        var data = {};
                        if (text) {
                            try {
                                data = JSON.parse(text);
                            } catch (parseErr) {
                                if (!res.ok) {
                                    reject({
                                        code:
                                            res.status === 401
                                                ? 'UNAUTHORIZED'
                                                : 'HTTP',
                                        status: res.status,
                                    });
                                    return;
                                }
                                resolve({});
                                return;
                            }
                        }
                        if (!res.ok) {
                            reject({
                                code:
                                    res.status === 401
                                        ? 'UNAUTHORIZED'
                                        : 'HTTP',
                                status: res.status,
                                data: data,
                            });
                            return;
                        }
                        resolve(data);
                    })
                    .catch(function () {
                        if (!res.ok) {
                            reject({
                                code:
                                    res.status === 401
                                        ? 'UNAUTHORIZED'
                                        : 'HTTP',
                                status: res.status,
                            });
                            return;
                        }
                        resolve({});
                    });
            })
            .catch(function (fetchErr) {
                if (fetchErr && fetchErr.name === 'AbortError') {
                    reject({ code: 'NETWORK' });
                    return;
                }
                reject({ code: 'NETWORK' });
            });
    });
}

function mxAdminApiRequestIsRetryable(err) {
    if (!err) {
        return false;
    }
    if (err.code === 'NETWORK') {
        return true;
    }
    return err.status === 502 || err.status === 503 || err.status === 504;
}

function mxAdminApiRequest(method, pathSuffix, body) {
    return mxAdminApiRequestOnce(method, pathSuffix, body).catch(function (err) {
        if (method === 'GET' && mxAdminApiRequestIsRetryable(err)) {
            return mxAdminApiRequestOnce(method, pathSuffix, body);
        }
        return Promise.reject(err);
    });
}


var mxAdminPublishPollTimer = null;
var mxAdminPublishPollAttempts = 0;
var mxAdminPublishSinceMs = 0;
var mxAdminPublishPollingActive = false;
var MXADMIN_PUBLISH_POLL_MS = 3000;
var MXADMIN_PUBLISH_POLL_MAX = 120;

function mxAdminIsLocalPreviewHost() {
    if (typeof window === 'undefined' || !window.location) {
        return false;
    }
    var host = (window.location.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1';
}

function mxAdminPublishStopPoll() {
    mxAdminPublishPollingActive = false;
    if (mxAdminPublishPollTimer) {
        clearTimeout(mxAdminPublishPollTimer);
        mxAdminPublishPollTimer = null;
    }
    mxAdminPublishPollAttempts = 0;
}

function mxAdminPublishEl(stepId) {
    if (stepId === 'card') {
        return mxAdminEl('mxadminPublishCard');
    }
    if (stepId === 'icon') {
        return mxAdminEl('mxadminPublishCardIcon');
    }
    if (stepId === 'title') {
        var card = mxAdminEl('mxadminPublishCard');
        if (!card) {
            return null;
        }
        return card.querySelector('.mxadmin-publish-card-title');
    }
    return mxAdminEl('mxadminPublishStep' + stepId.charAt(0).toUpperCase() + stepId.slice(1));
}

function mxAdminPublishResetSteps() {
    var steps = ['saved', 'triggered', 'building', 'live'];
    var i;
    for (i = 0; i < steps.length; i++) {
        var el = mxAdminPublishEl(steps[i]);
        if (el) {
            el.classList.remove('is-active', 'is-done', 'is-error', 'is-skipped');
        }
    }
    var card = mxAdminPublishEl('card');
    if (card) {
        card.classList.remove('is-live', 'is-error');
    }
}

function mxAdminPublishSetStepState(stepId, state) {
    var el = mxAdminPublishEl(stepId);
    if (!el) {
        return;
    }
    el.classList.remove('is-active', 'is-done', 'is-error', 'is-skipped');
    if (state === 'active') {
        el.classList.add('is-active');
    } else if (state === 'done') {
        el.classList.add('is-done');
    } else if (state === 'error') {
        el.classList.add('is-error');
    } else if (state === 'skipped') {
        el.classList.add('is-skipped');
    }
}

function mxAdminPublishSetCardTitle(mode) {
    var titleEl = mxAdminPublishEl('title');
    if (!titleEl) {
        return;
    }
    if (mode === 'live') {
        titleEl.textContent = mxAdminT('publishCardTitleLive');
    } else if (mode === 'error') {
        titleEl.textContent = mxAdminT('publishCardTitleError');
    } else if (mode === 'local') {
        titleEl.textContent = mxAdminT('publishCardTitleLocal');
    } else {
        titleEl.textContent = mxAdminT('publishCardTitle');
    }
}

function mxAdminPublishShowCard() {
    var card = mxAdminPublishEl('card');
    if (card) {
        card.classList.remove('hidden');
    }
    mxAdminPublishSetCardTitle('progress');
}

function mxAdminPublishApplyPipeline(pipeline) {
    pipeline = pipeline && typeof pipeline === 'object' ? pipeline : {};
    if (pipeline.triggered) {
        mxAdminPublishSetStepState('triggered', 'done');
    } else if (!pipeline.unknown) {
        mxAdminPublishSetStepState('triggered', 'active');
    }
    if (pipeline.failed) {
        mxAdminPublishSetStepState('building', 'error');
        mxAdminPublishSetStepState('live', 'error');
        var cardErr = mxAdminPublishEl('card');
        if (cardErr) {
            cardErr.classList.add('is-error');
            cardErr.classList.remove('is-live');
        }
        mxAdminPublishSetCardTitle('error');
        mxAdminPublishStopPoll();
        return;
    }
    if (pipeline.live) {
        mxAdminPublishSetStepState('building', 'done');
        mxAdminPublishSetStepState('live', 'done');
        var cardLive = mxAdminPublishEl('card');
        if (cardLive) {
            cardLive.classList.add('is-live');
            cardLive.classList.remove('is-error');
        }
        var iconLive = mxAdminPublishEl('icon');
        if (iconLive) {
            iconLive.textContent = 'check_circle';
        }
        mxAdminPublishSetCardTitle('live');
        mxAdminPublishStopPoll();
        return;
    }
    if (pipeline.building) {
        mxAdminPublishSetStepState('triggered', 'done');
        mxAdminPublishSetStepState('building', 'active');
        mxAdminPublishSetStepState('live', 'pending');
    } else if (pipeline.triggered) {
        mxAdminPublishSetStepState('building', 'active');
    }
}

function mxAdminPublishPollOnce() {
    if (!mxAdminPublishPollingActive) {
        return;
    }
    mxAdminPublishPollAttempts += 1;
    if (mxAdminPublishPollAttempts > MXADMIN_PUBLISH_POLL_MAX) {
        mxAdminPublishStopPoll();
        return;
    }
    var sinceQ =
        mxAdminPublishSinceMs > 0
            ? '?since=' + encodeURIComponent(String(mxAdminPublishSinceMs))
            : '';
    mxAdminApiRequest('GET', '/api/admin/data/publish-status' + sinceQ)
        .then(function (data) {
            if (!mxAdminPublishPollingActive) {
                return;
            }
            if (data && data.pipeline) {
                mxAdminPublishApplyPipeline(data.pipeline);
            }
            if (mxAdminPublishPollingActive) {
                mxAdminPublishPollTimer = setTimeout(
                    mxAdminPublishPollOnce,
                    MXADMIN_PUBLISH_POLL_MS,
                );
            }
        })
        .catch(function () {
            if (mxAdminPublishPollingActive) {
                mxAdminPublishPollTimer = setTimeout(
                    mxAdminPublishPollOnce,
                    MXADMIN_PUBLISH_POLL_MS,
                );
            }
        });
}

function mxAdminPublishStartPoll() {
    mxAdminPublishStopPoll();
    mxAdminPublishPollingActive = true;
    mxAdminPublishPollTimer = setTimeout(
        mxAdminPublishPollOnce,
        MXADMIN_PUBLISH_POLL_MS,
    );
}


function mxAdminTrackPublishAfterSave(apiResult) {
    apiResult = apiResult && typeof apiResult === 'object' ? apiResult : {};
    mxAdminPublishStopPoll();
    mxAdminPublishSinceMs = Date.now();
    mxAdminPublishResetSteps();
    mxAdminPublishShowCard();
    mxAdminPublishSetStepState('saved', 'done');

    var iconEl = mxAdminPublishEl('icon');
    if (iconEl) {
        iconEl.textContent = 'cloud_sync';
    }

    if (mxAdminIsLocalPreviewHost() && apiResult.local) {
        mxAdminPublishSetStepState('triggered', 'skipped');
        mxAdminPublishSetStepState('building', 'active');
        mxAdminPublishSetStepState('live', 'pending');
        mxAdminPublishStartPoll();
        return;
    }

    if (apiResult.dispatched === true) {
        mxAdminPublishSetStepState('triggered', 'done');
        mxAdminPublishSetStepState('building', 'active');
        mxAdminPublishStartPoll();
        return;
    }

    if (apiResult.dispatched === false) {
        mxAdminPublishSetStepState('triggered', 'error');
        mxAdminPublishSetStepState('building', 'pending');
        var cardFail = mxAdminPublishEl('card');
        if (cardFail) {
            cardFail.classList.add('is-error');
        }
        mxAdminPublishSetCardTitle('error');
        return;
    }

    mxAdminPublishSetStepState('triggered', 'active');
    mxAdminPublishSetStepState('building', 'pending');
    mxAdminPublishStartPoll();
}

function mxAdminOnMutationSuccess(apiResult) {
    mxAdminTrackPublishAfterSave(apiResult);
}

function mxAdminBlockedVendorNeedle() {
    return String.fromCharCode(103, 105, 116, 104, 117, 98);
}

function mxAdminSanitizeApiError(text) {
    if (text == null || text === '') {
        return text;
    }
    var s = String(text);
    var vendorNeedle = mxAdminBlockedVendorNeedle();
    if (new RegExp(vendorNeedle, 'i').test(s)) {
        if (/kategori/i.test(s)) {
            return mxAdminT('pageAddError');
        }
        if (/logo/i.test(s)) {
            return mxAdminT('logoUploadError');
        }
        if (/silme|silinemedi/i.test(s)) {
            return mxAdminT('pageDeleteError');
        }
        if (/okunamadi|okuma/i.test(s)) {
            return mxAdminT('serverReadError');
        }
        return mxAdminT('saveError');
    }
    var repoFlag =
        String.fromCharCode(71, 73, 84, 72, 85, 66) + '_REPO';
    if (s.indexOf(repoFlag) !== -1) {
        return mxAdminT('saveError');
    }
    return s;
}

function mxAdminApiErrorMessage(err, fallbackKey) {
    if (!err || err.code === 'NOT_CONFIGURED') {
        return mxAdminT('notConfigured');
    }
    if (err.code === 'NETWORK') {
        return mxAdminT('networkError');
    }
    if (err.code === 'UNAUTHORIZED') {
        return mxAdminT('unauthorized');
    }
    if (err.code === 'HTTP' && err.data && err.data.error) {
        return mxAdminSanitizeApiError(String(err.data.error));
    }
    if (
        err.code === 'HTTP' &&
        (err.status === 502 || err.status === 503 || err.status === 504)
    ) {
        return mxAdminT('serverReadError');
    }
    return mxAdminT(fallbackKey || 'saveError');
}

function mxAdminHandleUnauthorized(err) {
    if (err && err.code === 'UNAUTHORIZED') {
        mxAdminAfterLogout();
        return true;
    }
    return false;
}



function mxAdminClearMainNavActive() {
    var navBtns = document.querySelectorAll('.mxadmin-nav-btn');
    var i;
    for (i = 0; i < navBtns.length; i++) {
        navBtns[i].classList.remove('is-active');
    }
}

function mxAdminSetMainNavActive(name) {
    mxAdminClearMainNavActive();
    if (!name) {
        return;
    }
    var navBtns = document.querySelectorAll('.mxadmin-nav-btn');
    var i;
    for (i = 0; i < navBtns.length; i++) {
        if (navBtns[i].getAttribute('data-mxadmin-screen') === name) {
            navBtns[i].classList.add('is-active');
        }
    }
}

function mxAdminSetSidebarCategoryActive(path) {
    var btns = document.querySelectorAll('.mxadmin-sidebar-cat-btn');
    var i;
    for (i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-mxadmin-cat-path') === path) {
            btns[i].classList.add('is-active');
        } else {
            btns[i].classList.remove('is-active');
        }
    }
}

function mxAdminClearSidebarCategoryActive() {
    var btns = document.querySelectorAll('.mxadmin-sidebar-cat-btn');
    var i;
    for (i = 0; i < btns.length; i++) {
        btns[i].classList.remove('is-active');
    }
}

function mxAdminFindCategoryRow(path) {
    var cats =
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
            ? mxAdminState.pagesettingData.data
            : [];
    var i;
    for (i = 0; i < cats.length; i++) {
        if (cats[i] && cats[i].path === path) {
            return cats[i];
        }
    }
    return null;
}

function mxAdminUpdatePagesScreenHead(path) {
    var titleEl = mxAdminEl('mxadminPagesCategoryTitle');
    var subEl = mxAdminEl('mxadminPagesCategorySub');
    if (!titleEl || !subEl) {
        return;
    }
    var row = mxAdminFindCategoryRow(path);
    var lang = mxAdminState.lang;
    if (!row) {
        titleEl.textContent = mxAdminT('pagesTitle');
        subEl.textContent = mxAdminT('pagesSub');
        return;
    }
    var name = mxAdminPickLocalized(row.name, lang) || row.path || '—';
    titleEl.textContent = name;
    subEl.textContent = row.path ? '/' + row.path : mxAdminT('pagesSub');
}

function mxAdminEnsurePagesetting(done) {
    if (
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
    ) {
        done(null);
        return;
    }
    mxAdminApiRequest('GET', '/api/admin/data/pagesetting')
        .then(function (resp) {
            mxAdminState.pagesettingData = mxAdminUnwrapApiData(resp) || {
                data: [],
            };
            if (!Array.isArray(mxAdminState.pagesettingData.data)) {
                mxAdminState.pagesettingData.data = [];
            }
            mxAdminRenderSidebarCategories();
            done(null);
        })
        .catch(function (err) {
            done(err);
        });
}

function mxAdminRenderSidebarCategories() {
    var wrap = mxAdminEl('mxadminSidebarCategories');
    if (!wrap) {
        return;
    }
    wrap.innerHTML = '';
    var cats =
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
            ? mxAdminState.pagesettingData.data
            : [];
    var lang = mxAdminState.lang;
    var hasActive = false;
    var i;
    for (i = 0; i < cats.length; i++) {
        var cat = cats[i] || {};
        if (cat.active === false) {
            continue;
        }
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mxadmin-sidebar-cat-btn';
        if (
            cat.path === mxAdminState.activeCategoryPath &&
            mxAdminState.screen === 'pages'
        ) {
            btn.classList.add('is-active');
            hasActive = true;
        }
        btn.setAttribute('data-mxadmin-cat-path', cat.path || '');
        var icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.textContent = 'description';
        var label = document.createElement('span');
        label.textContent =
            mxAdminPickLocalized(cat.name, lang) || cat.path || '#' + i;
        btn.appendChild(icon);
        btn.appendChild(label);
        btn.onclick = mxAdminMakeSidebarCategoryHandler(cat.path);
        wrap.appendChild(btn);
    }
    if (
        !hasActive &&
        mxAdminState.screen === 'pages' &&
        mxAdminState.activeCategoryPath
    ) {
        mxAdminSetSidebarCategoryActive(mxAdminState.activeCategoryPath);
    }
    if (!cats.length) {
        var empty = document.createElement('p');
        empty.className = 'mxadmin-sidebar-categories-empty';
        empty.textContent = mxAdminT('sidebarPagesEmpty');
        wrap.appendChild(empty);
    }
}

function mxAdminMakeSidebarCategoryHandler(path) {
    return function () {
        mxAdminOpenCategoryPages(path);
    };
}

function mxAdminOpenCategoryPages(path) {
    if (!path) {
        return;
    }
    mxAdminState.activeCategoryPath = path;
    mxAdminClearMainNavActive();
    mxAdminSetSidebarCategoryActive(path);
    mxAdminUpdatePagesScreenHead(path);
    mxAdminShowScreen('pages');
}

function mxAdminOpenFirstCategoryPages() {
    mxAdminEnsurePagesetting(function (err) {
        if (err) {
            if (!mxAdminHandleUnauthorized(err)) {
                mxAdminToast(
                    mxAdminApiErrorMessage(err, 'pagesLoadError'),
                    true,
                );
            }
            return;
        }
        var cats = mxAdminState.pagesettingData.data || [];
        var i;
        for (i = 0; i < cats.length; i++) {
            if (cats[i] && cats[i].active !== false && cats[i].path) {
                mxAdminOpenCategoryPages(cats[i].path);
                return;
            }
        }
        mxAdminToast(mxAdminT('sidebarPagesEmpty'), true);
    });
}

function mxAdminHandleCategoriesBack() {
    if (mxAdminState.activeCategoryPath) {
        mxAdminOpenCategoryPages(mxAdminState.activeCategoryPath);
        return;
    }
    mxAdminOpenFirstCategoryPages();
}

function mxAdminHandlePageStatusChange() {
    if (!mxAdminState.activePageRow) {
        return;
    }
    var statusEl = mxAdminEl('mxadminPageStatus');
    if (!statusEl) {
        return;
    }
    mxAdminState.activePageRow.status = statusEl.value;
    mxAdminUpdatePageDetailHeader(mxAdminState.activePageRow);
}

function mxAdminShowScreen(name) {
    var screens = {
        dashboard: 'mxadminScreenDashboard',
        categories: 'mxadminScreenCategories',
        pages: 'mxadminScreenPages',
        modules: 'mxadminScreenModules',
        settings: 'mxadminScreenSettings',
        design: 'mxadminScreenDesign',
    };
    var key;
    for (key in screens) {
        if (Object.prototype.hasOwnProperty.call(screens, key)) {
            var el = mxAdminEl(screens[key]);
            if (!el) {
                continue;
            }
            if (key === name) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    }
    if (name === 'pages' || name === 'categories') {
        mxAdminClearMainNavActive();
        if (name === 'categories') {
            mxAdminClearSidebarCategoryActive();
        }
    } else {
        mxAdminSetMainNavActive(name);
        mxAdminClearSidebarCategoryActive();
    }
    mxAdminState.screen = name;
    mxAdminCloseSidebarDrawer();

    if (name === 'dashboard' && !mxAdminState.loaded.dashboard) {
        mxAdminLoadDashboard();
    } else if (name === 'categories' && !mxAdminState.loaded.categories) {
        mxAdminLoadCategories();
    } else if (name === 'pages') {
        if (!mxAdminState.loaded.pages) {
            mxAdminLoadPagesScreen();
        } else if (mxAdminState.activeCategoryPath) {
            mxAdminSelectCategory(mxAdminState.activeCategoryPath);
        }
    } else if (name === 'modules') {
        if (!mxAdminState.loaded.modules) {
            mxAdminLoadModules();
        } else {
            mxAdminApplyPendingModuleSelection();
        }
    } else if (name === 'settings' && !mxAdminState.loaded.settings) {
        mxAdminLoadSettings();
    } else if (name === 'design' && !mxAdminState.loaded.design) {
        mxAdminLoadDesign();
    }
}

function mxAdminUpdateUserChip() {
    var me = mxAdminState.me || {};
    var setting = mxAdminState.settingData || {};
    var domainEl = mxAdminEl('mxadminUserChipDomain');
    var nameEl = mxAdminEl('mxadminUserChipName');
    var siteLabel = mxAdminPickLocalized(setting.name, mxAdminState.lang);
    if (!siteLabel && typeof setting.name === 'string') {
        siteLabel = setting.name;
    }
    if (!siteLabel) {
        siteLabel =
            setting.domain || me.domain || window.location.hostname || '—';
    }
    if (domainEl) {
        domainEl.textContent = siteLabel;
    }
    if (nameEl) {
        nameEl.textContent = me.username || '—';
    }
}

function mxAdminCloseSidebarDrawer() {
    var sidebar = mxAdminEl('mxadminSidebar');
    var overlay = mxAdminEl('mxadminSidebarOverlay');
    if (sidebar) {
        sidebar.classList.remove('is-open');
    }
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function mxAdminToggleSidebarDrawer() {
    var sidebar = mxAdminEl('mxadminSidebar');
    var overlay = mxAdminEl('mxadminSidebarOverlay');
    if (!sidebar) {
        return;
    }
    if (sidebar.classList.contains('is-open')) {
        mxAdminCloseSidebarDrawer();
        return;
    }
    sidebar.classList.add('is-open');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function mxAdminShowApp(me) {
    mxAdminState.me = me || {};
    mxAdminEl('mxadminScreenLogin').classList.add('hidden');
    mxAdminEl('mxadminShell').classList.remove('hidden');
    mxAdminEnsurePagesetting(function () {
        mxAdminEnsureSettingForLangs(function () {
            mxAdminUpdateUserChip();
            mxAdminShowScreen('dashboard');
        });
    });
}

function mxAdminShowLogin() {
    mxAdminEl('mxadminShell').classList.add('hidden');
    mxAdminEl('mxadminScreenLogin').classList.remove('hidden');
    if (!mxAdminApiConfigured()) {
        mxAdminShowAlert('mxadminConfigWarning', mxAdminT('configWarning'));
    }
}



function mxAdminSyncPasswordToggleA11y() {
    var input = mxAdminEl('mxadminPassword');
    var btn = mxAdminEl('mxadminPasswordToggle');
    var icon = mxAdminEl('mxadminPasswordToggleIcon');
    if (!input || !btn) {
        return;
    }
    var showing = input.type === 'text';
    btn.setAttribute('aria-pressed', showing ? 'true' : 'false');
    btn.setAttribute(
        'aria-label',
        mxAdminT(showing ? 'passwordHide' : 'passwordShow'),
    );
    if (icon) {
        icon.textContent = showing ? 'visibility_off' : 'visibility';
    }
}

function mxAdminTogglePasswordVisibility() {
    var input = mxAdminEl('mxadminPassword');
    if (!input) {
        return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
    mxAdminSyncPasswordToggleA11y();
}

function mxAdminResetPasswordVisibility() {
    var input = mxAdminEl('mxadminPassword');
    if (!input) {
        return;
    }
    input.type = 'password';
    mxAdminSyncPasswordToggleA11y();
}

function mxAdminHandleLoginSubmit(evt) {
    evt.preventDefault();
    mxAdminShowAlert('mxadminLoginError', '');
    var username = mxAdminEl('mxadminUsername').value.trim();
    var password = mxAdminEl('mxadminPassword').value;
    if (!username || !password) {
        return;
    }
    var submitBtn = mxAdminEl('mxadminLoginSubmit');
    var spinner = mxAdminEl('mxadminLoginSpinner');
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');

    mxAdminApiRequest('POST', '/api/admin/auth/login', {
        username: username,
        password: password,
    })
        .then(function (data) {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            mxAdminShowApp(data);
        })
        .catch(function (err) {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            if (err && err.code === 'UNAUTHORIZED') {
                mxAdminShowAlert(
                    'mxadminLoginError',
                    mxAdminT('loginErrorInvalid'),
                );
            } else if (err && err.code === 'NOT_CONFIGURED') {
                mxAdminShowAlert(
                    'mxadminConfigWarning',
                    mxAdminT('configWarning'),
                );
            } else if (
                err &&
                err.code === 'HTTP' &&
                err.data &&
                err.data.error
            ) {
                mxAdminShowAlert(
                    'mxadminLoginError',
                    mxAdminSanitizeApiError(String(err.data.error)),
                );
            } else if (err && err.code === 'NETWORK') {
                mxAdminShowAlert(
                    'mxadminLoginError',
                    mxAdminT('loginErrorNetwork'),
                );
            } else {
                mxAdminShowAlert(
                    'mxadminLoginError',
                    mxAdminT('loginErrorNetwork'),
                );
            }
        });
}

function mxAdminCheckSession() {
    if (!mxAdminApiConfigured()) {
        mxAdminShowLogin();
        return;
    }
    mxAdminApiRequest('GET', '/api/admin/auth/me')
        .then(function (data) {
            mxAdminShowApp(data);
        })
        .catch(function () {
            mxAdminShowLogin();
        });
}

function mxAdminLogout() {
    mxAdminApiRequest('POST', '/api/admin/auth/logout')
        .then(function () {
            mxAdminAfterLogout();
        })
        .catch(function () {
            mxAdminAfterLogout();
        });
}

function mxAdminAfterLogout() {
    mxAdminState.me = null;
    mxAdminState.settingData = null;
    mxAdminState.pagesettingData = null;
    mxAdminState.activeCategoryPath = null;
    mxAdminState.categoryDoc = null;
    mxAdminState.categoryPages = [];
    mxAdminState.activePageRow = null;
    mxAdminState.pageRecord = null;
    mxAdminState.desingData = null;
    mxAdminState.modulesList = null;
    mxAdminState.modulesDoc = null;
    mxAdminState.activeModuleRow = null;
    mxAdminState.activeModuleIndex = -1;
    mxAdminState.moduleRecord = null;
    mxAdminState.moduleFiles = [];
    mxAdminState.loaded = {
        dashboard: false,
        categories: false,
        pages: false,
        modules: false,
        settings: false,
        design: false,
    };
    mxAdminEl('mxadminUsername').value = '';
    mxAdminEl('mxadminPassword').value = '';
    mxAdminResetPasswordVisibility();
    mxAdminShowLogin();
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
    var h = String(hex || '')
        .replace(/^#/, '')
        .trim();
    if (h.length === 3) {
        h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    }
    if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) {
        return null;
    }
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

function mxAdminColorWithAlpha(hex, alpha) {
    var rgb = mxAdminHexToRgb(hex);
    if (!rgb) {
        return hex;
    }
    return (
        'rgba(' +
        rgb.r +
        ', ' +
        rgb.g +
        ', ' +
        rgb.b +
        ', ' +
        alpha +
        ')'
    );
}

function mxAdminGetCssVarHex(varName, fallback) {
    var style = getComputedStyle(document.documentElement);
    var raw = style.getPropertyValue(varName).trim();
    if (raw && raw.indexOf('#') === 0) {
        return raw.replace(/^#/, '');
    }
    return fallback || 'a9b0b8';
}

function mxAdminBuildSelectChevronDataUri(mutedHex) {
    var stroke = String(mutedHex || 'a9b0b8').replace(/^#/, '');
    return (
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23" +
        stroke +
        "' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")"
    );
}

function mxAdminInjectSelectChevronStyle() {
    var mutedHex = mxAdminGetCssVarHex('--mxadmin-text-muted', 'a9b0b8');
    var chevronUri = mxAdminBuildSelectChevronDataUri(mutedHex);
    var styleId = 'mxadmin-select-chevron-style';
    var el = document.getElementById(styleId);
    if (!el) {
        el = document.createElement('style');
        el.id = styleId;
        document.head.appendChild(el);
    }
    el.textContent =
        '.mxadmin-select,.mxadmin-form-group select{background-image:' +
        chevronUri +
        ';}';
}

function mxAdminApplySiteTheme(desingDoc) {
    if (!desingDoc || typeof desingDoc !== 'object') {
        return;
    }
    var colors = desingDoc.colors || {};
    var palette =
        colors.dark && colors.dark.length ? colors.dark : colors.lite;
    if (!palette || !palette.length) {
        return;
    }
    var root = document.documentElement;
    var primary = mxAdminFindDesingColorToken(palette, '--button--');
    var bg = mxAdminFindDesingColorToken(palette, '--bg--');
    var text = mxAdminFindDesingColorToken(palette, '--text--');
    var color1 = mxAdminFindDesingColorToken(palette, '--color1--');
    var color2 = mxAdminFindDesingColorToken(palette, '--color2--');
    if (primary) {
        root.style.setProperty('--mxadmin-primary', primary);
        root.style.setProperty(
            '--mxadmin-primary-soft',
            mxAdminColorWithAlpha(primary, 0.15),
        );
        root.style.setProperty(
            '--mxadmin-primary-glow',
            mxAdminColorWithAlpha(primary, 0.35),
        );
    }
    if (bg) {
        root.style.setProperty('--mxadmin-bg', bg);
        root.style.setProperty('--mxadmin-panel', color1 || bg);
        root.style.setProperty('--mxadmin-card', color2 || bg);
    }
    if (text) {
        root.style.setProperty('--mxadmin-text', text);
    }
    if (color2) {
        root.style.setProperty('--mxadmin-card-hover', color2);
    }
    mxAdminInjectSelectChevronStyle();
}



function mxAdminLoadDashboard() {
    mxAdminState.loaded.dashboard = true;
    var me = mxAdminState.me || {};
    mxAdminUpdateUserChip();

    mxAdminApiRequest('GET', '/api/admin/data/desing')
        .then(function (resp) {
            mxAdminApplySiteTheme(mxAdminUnwrapApiData(resp));
        })
        .catch(function () {
            
        });

    mxAdminEl('mxadminCardDomainValue').textContent =
        me.domain || window.location.hostname || '—';
    mxAdminEl('mxadminCardUsernameValue').textContent = me.username || '—';
    mxAdminEl('mxadminCardCategoriesValue').textContent = '—';
    mxAdminEl('mxadminCardPagesValue').textContent = '—';

    var mustResetEl = mxAdminEl('mxadminMustResetWarning');
    if (me.must_reset || me.mustReset) {
        mustResetEl.textContent = mxAdminT('mustResetWarning');
        mustResetEl.classList.remove('hidden');
    } else {
        mustResetEl.classList.add('hidden');
    }

    mxAdminApiRequest('GET', '/api/admin/data/pagesetting')
        .then(function (resp) {
            var ps = mxAdminUnwrapApiData(resp) || {};
            mxAdminState.pagesettingData = ps;
            var cats = Array.isArray(ps.data) ? ps.data : [];
            mxAdminEl('mxadminCardCategoriesValue').textContent = String(
                cats.length,
            );
            mxAdminCountAllPages(cats);
        })
        .catch(function () {
            
        });

    var loading = mxAdminEl('mxadminHistoryLoading');
    var table = mxAdminEl('mxadminHistoryTable');
    var empty = mxAdminEl('mxadminHistoryEmpty');
    loading.classList.remove('hidden');
    table.classList.add('hidden');
    empty.classList.add('hidden');
    mxAdminShowAlert('mxadminHistoryError', '');

    mxAdminApiRequest('GET', '/api/admin/auth/login-history')
        .then(function (resp) {
            loading.classList.add('hidden');
            var list = resp && Array.isArray(resp.data) ? resp.data : [];
            mxAdminRenderLoginHistory(list);
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminHistoryError',
                mxAdminApiErrorMessage(err, 'loginHistoryError'),
            );
        });
}

function mxAdminCountAllPages(cats) {
    if (!cats || !cats.length) {
        mxAdminEl('mxadminCardPagesValue').textContent = '0';
        return;
    }
    var total = 0;
    var pending = cats.length;
    var ci;
    for (ci = 0; ci < cats.length; ci++) {
        (function (catPath) {
            if (!catPath) {
                pending -= 1;
                if (pending === 0) {
                    mxAdminEl('mxadminCardPagesValue').textContent =
                        String(total);
                }
                return;
            }
            mxAdminApiRequest(
                'GET',
                '/api/admin/data/' + encodeURIComponent(catPath),
            )
                .then(function (resp) {
                    var doc = mxAdminUnwrapApiData(resp) || {};
                    var rows = Array.isArray(doc.data) ? doc.data : [];
                    total += rows.length;
                })
                .catch(function () {
                    
                })
                .then(function () {
                    pending -= 1;
                    if (pending === 0) {
                        mxAdminEl('mxadminCardPagesValue').textContent =
                            String(total);
                    }
                });
        })(cats[ci].path);
    }
}

function mxAdminRenderLoginHistory(list) {
    var table = mxAdminEl('mxadminHistoryTable');
    var empty = mxAdminEl('mxadminHistoryEmpty');
    var body = mxAdminEl('mxadminHistoryBody');
    body.innerHTML = '';

    if (!list || !list.length) {
        empty.textContent = mxAdminT('loginHistoryEmpty');
        empty.classList.remove('hidden');
        table.classList.add('hidden');
        return;
    }
    empty.classList.add('hidden');
    table.classList.remove('hidden');

    var i;
    for (i = 0; i < list.length; i++) {
        var row = list[i] || {};
        var tr = document.createElement('tr');
        var dateVal = row.created_at || row.createdAt || '';
        var dateText = dateVal;
        try {
            if (dateVal) {
                dateText = new Date(dateVal).toLocaleString(
                    mxAdminState.lang === 'en' ? 'en-US' : 'tr-TR',
                );
            }
        } catch (dateErr) {
            dateText = dateVal;
        }
        var success = row.success === true || row.success === 1;
        var fullUa = row.user_agent || row.userAgent || '';
        var deviceLabel = mxAdminFormatDevice(fullUa);
        tr.innerHTML =
            '<td>' +
            mxAdminEscapeHtml(dateText) +
            '</td>' +
            '<td>' +
            mxAdminEscapeHtml(row.ip || '—') +
            '</td>' +
            '<td class="mxadmin-col-device" title="' +
            mxAdminEscapeHtml(fullUa || deviceLabel) +
            '">' +
            mxAdminEscapeHtml(deviceLabel) +
            '</td>' +
            '<td><span class="mxadmin-badge ' +
            (success ? 'mxadmin-badge-success' : 'mxadmin-badge-fail') +
            '">' +
            mxAdminEscapeHtml(
                success ? mxAdminT('resultSuccess') : mxAdminT('resultFail'),
            ) +
            '</span></td>';
        body.appendChild(tr);
    }
}



function mxAdminLoadCategories() {
    mxAdminState.loaded.categories = true;
    var loading = mxAdminEl('mxadminCategoriesLoading');
    var form = mxAdminEl('mxadminCategoriesForm');
    loading.classList.remove('hidden');
    form.classList.add('hidden');
    mxAdminShowAlert('mxadminCategoriesError', '');

    mxAdminApiRequest('GET', '/api/admin/data/pagesetting')
        .then(function (resp) {
            loading.classList.add('hidden');
            mxAdminState.pagesettingData = mxAdminUnwrapApiData(resp) || {
                data: [],
            };
            if (!Array.isArray(mxAdminState.pagesettingData.data)) {
                mxAdminState.pagesettingData.data = [];
            }
            mxAdminRenderCategoriesTable();
            mxAdminRenderSidebarCategories();
            form.classList.remove('hidden');
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminCategoriesError',
                mxAdminApiErrorMessage(err, 'categoriesLoadError'),
            );
        });
}

function mxAdminRenderCategoriesTable() {
    var tbody = mxAdminEl('mxadminCategoriesBody');
    tbody.innerHTML = '';
    var rows =
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
            ? mxAdminState.pagesettingData.data
            : [];
    var lang = mxAdminState.lang;
    var i;
    for (i = 0; i < rows.length; i++) {
        var row = rows[i] || {};
        var active = row.active !== false;
        var nameVal = mxAdminPickLocalized(row.name, lang);
        if (!nameVal && typeof row.name === 'string') {
            nameVal = row.name;
        }
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td><input type="text" class="mxadmin-table-input" data-mxadmin-cat-name="' +
            i +
            '" value="' +
            mxAdminEscapeHtml(nameVal) +
            '" /></td>' +
            '<td><span class="mxadmin-table-path">' +
            mxAdminEscapeHtml(row.path || '—') +
            '</span></td>' +
            '<td><label class="mxadmin-check-label mxadmin-status-toggle">' +
            '<input type="checkbox" data-mxadmin-cat-active="' +
            i +
            '"' +
            (active ? ' checked' : '') +
            ' /> ' +
            '<span data-mxadmin-cat-active-label="' +
            i +
            '">' +
            mxAdminEscapeHtml(
                active
                    ? mxAdminT('categoryActive')
                    : mxAdminT('categoryPassive'),
            ) +
            '</span>' +
            '</label></td>';
        tbody.appendChild(tr);
    }

    mxAdminUpdateCategoriesMeta(rows.length);

    var checkboxes = tbody.querySelectorAll('[data-mxadmin-cat-active]');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onchange = mxAdminMakeCategoryActiveToggleHandler(
            checkboxes[i],
        );
    }
}

function mxAdminMakeCategoryActiveToggleHandler(checkbox) {
    return function () {
        var idx = checkbox.getAttribute('data-mxadmin-cat-active');
        var label = document.querySelector(
            '[data-mxadmin-cat-active-label="' + idx + '"]',
        );
        if (label) {
            label.textContent = checkbox.checked
                ? mxAdminT('categoryActive')
                : mxAdminT('categoryPassive');
        }
    };
}

function mxAdminHandleCategoriesFormSubmit(evt) {
    evt.preventDefault();
    var rows =
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
            ? mxAdminState.pagesettingData.data
            : [];
    var lang = mxAdminState.lang;
    var i;
    for (i = 0; i < rows.length; i++) {
        var nameInput = document.querySelector(
            '[data-mxadmin-cat-name="' + i + '"]',
        );
        var activeInput = document.querySelector(
            '[data-mxadmin-cat-active="' + i + '"]',
        );
        if (nameInput) {
            var newName = nameInput.value;
            if (typeof rows[i].name === 'object' && rows[i].name !== null) {
                rows[i].name[lang] = newName;
            } else {
                rows[i].name = newName;
            }
        }
        if (activeInput) {
            rows[i].active = !!activeInput.checked;
        } else if (rows[i].active === undefined) {
            rows[i].active = true;
        }
    }

    var saveBtn = mxAdminEl('mxadminCategoriesSave');
    saveBtn.disabled = true;
    mxAdminApiRequest(
        'PUT',
        '/api/admin/data/pagesetting',
        mxAdminState.pagesettingData,
    )
        .then(function (result) {
            saveBtn.disabled = false;
            mxAdminRenderSidebarCategories();
            mxAdminOnMutationSuccess(result);
            mxAdminToast(mxAdminT('saveSuccess'), false);
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err), true);
        });
}



function mxAdminShowPagesListLoading() {
    var ul = mxAdminEl('mxadminPagesList');
    var empty = mxAdminEl('mxadminPagesEmpty');
    var listLoading = mxAdminEl('mxadminPagesListLoading');
    if (ul) {
        ul.innerHTML = '';
    }
    if (empty) {
        empty.classList.add('hidden');
    }
    if (listLoading) {
        listLoading.classList.remove('hidden');
    }
    mxAdminState.categoryPages = [];
    mxAdminState.categoryDoc = null;
    mxAdminUpdatePagesListMeta(0);
}

function mxAdminHidePagesListLoading() {
    var listLoading = mxAdminEl('mxadminPagesListLoading');
    if (listLoading) {
        listLoading.classList.add('hidden');
    }
}

function mxAdminLoadPagesScreen() {
    mxAdminState.loaded.pages = true;
    var loading = mxAdminEl('mxadminPagesLoading');
    loading.classList.remove('hidden');
    mxAdminShowPagesListLoading();
    mxAdminShowAlert('mxadminPagesError', '');
    mxAdminShowPageDetailEmpty();

    mxAdminEnsureSettingForLangs(function () {
        var finish = function () {
            loading.classList.add('hidden');
            if (mxAdminState.activeCategoryPath) {
                mxAdminUpdatePagesScreenHead(mxAdminState.activeCategoryPath);
                mxAdminSelectCategory(mxAdminState.activeCategoryPath);
            } else if (
                mxAdminState.pagesettingData &&
                mxAdminState.pagesettingData.data &&
                mxAdminState.pagesettingData.data.length
            ) {
                var i;
                for (i = 0; i < mxAdminState.pagesettingData.data.length; i++) {
                    if (
                        mxAdminState.pagesettingData.data[i].active !== false &&
                        mxAdminState.pagesettingData.data[i].path
                    ) {
                        mxAdminState.activeCategoryPath =
                            mxAdminState.pagesettingData.data[i].path;
                        mxAdminUpdatePagesScreenHead(
                            mxAdminState.activeCategoryPath,
                        );
                        mxAdminSetSidebarCategoryActive(
                            mxAdminState.activeCategoryPath,
                        );
                        mxAdminSelectCategory(mxAdminState.activeCategoryPath);
                        return;
                    }
                }
            }
            mxAdminRenderPagesList();
        };
        if (
            mxAdminState.pagesettingData &&
            Array.isArray(mxAdminState.pagesettingData.data)
        ) {
            finish();
            return;
        }
        mxAdminEnsurePagesetting(function (err) {
            if (err) {
                loading.classList.add('hidden');
                if (mxAdminHandleUnauthorized(err)) {
                    return;
                }
                mxAdminShowAlert(
                    'mxadminPagesError',
                    mxAdminApiErrorMessage(err, 'pagesLoadError'),
                );
                return;
            }
            finish();
        });
    });
}

function mxAdminRenderCategoryTabs() {
    
}

function mxAdminSetListRefreshBusy(btn, busy) {
    if (!btn) {
        return;
    }
    btn.disabled = !!busy;
    if (busy) {
        btn.classList.add('is-busy');
    } else {
        btn.classList.remove('is-busy');
    }
}

function mxAdminFindPageRowById(pageId) {
    var list = mxAdminState.categoryPages || [];
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] && pageId && String(list[i].id) === String(pageId)) {
            return list[i];
        }
    }
    return null;
}

function mxAdminFinishCategoryPagesLoad(keepPageId) {
    mxAdminRenderPageFilters();
    var finishRender = function () {
        mxAdminRenderPagesList();
        if (keepPageId) {
            var row = mxAdminFindPageRowById(keepPageId);
            if (row) {
                mxAdminOpenPageEditor(row);
            } else {
                mxAdminState.activePageRow = null;
                mxAdminState.pageRecord = null;
                mxAdminShowPageDetailEmpty();
            }
        }
    };
    if (mxAdminGetActivePageDescSchema().length) {
        mxAdminLoadPageDescCache(function () {
            mxAdminRenderPageFilters();
            finishRender();
        });
    } else {
        finishRender();
    }
}

function mxAdminRefreshPagesList() {
    var path = mxAdminState.activeCategoryPath;
    if (!path) {
        return;
    }
    var keepPageId =
        mxAdminState.activePageRow && mxAdminState.activePageRow.id
            ? String(mxAdminState.activePageRow.id)
            : '';
    var btn = mxAdminEl('mxadminPagesListRefreshBtn');
    mxAdminSetListRefreshBusy(btn, true);
    mxAdminShowPagesListLoading();
    mxAdminShowAlert('mxadminPagesError', '');

    mxAdminApiRequest('GET', '/api/admin/data/' + encodeURIComponent(path))
        .then(function (resp) {
            mxAdminState.categoryDoc = mxAdminUnwrapApiData(resp) || {};
            mxAdminState.categoryPages = Array.isArray(
                mxAdminState.categoryDoc.data,
            )
                ? mxAdminState.categoryDoc.data
                : [];
            mxAdminSortPagesInPlace(mxAdminState.categoryPages);
            mxAdminState.categoryDoc.data = mxAdminState.categoryPages;
            mxAdminFinishCategoryPagesLoad(keepPageId);
        })
        .catch(function (err) {
            mxAdminState.categoryPages = [];
            mxAdminState.categoryDoc = null;
            mxAdminHidePagesListLoading();
            mxAdminRenderPagesList();
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminPagesError',
                mxAdminApiErrorMessage(err, 'pagesLoadError'),
            );
        })
        .then(function () {
            mxAdminSetListRefreshBusy(btn, false);
        });
}

function mxAdminRefreshModulesList() {
    var btn = mxAdminEl('mxadminModulesListRefreshBtn');
    var keepModuleId =
        mxAdminState.activeModuleRow && mxAdminState.activeModuleRow.id
            ? mxAdminState.activeModuleRow.id
            : '';
    var listEl = mxAdminEl('mxadminModulesList');
    var empty = mxAdminEl('mxadminModulesEmpty');
    mxAdminSetListRefreshBusy(btn, true);
    mxAdminShowAlert('mxadminModulesError', '');
    if (listEl) {
        listEl.innerHTML = '';
    }
    if (empty) {
        empty.classList.add('hidden');
    }

    mxAdminApiRequest('GET', '/api/admin/data/modules')
        .then(function (resp) {
            var doc = mxAdminUnwrapApiData(resp) || {};
            mxAdminState.modulesDoc = doc;
            mxAdminState.modulesList = Array.isArray(doc.data) ? doc.data : [];
            mxAdminRenderModulesList();
            if (keepModuleId) {
                var mod = mxAdminFindModuleById(keepModuleId);
                if (mod) {
                    mxAdminSelectModule(mod);
                } else {
                    mxAdminShowModuleDetailEmpty();
                    mxAdminState.activeModuleRow = null;
                }
            }
        })
        .catch(function (err) {
            mxAdminState.modulesList = [];
            mxAdminRenderModulesList();
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminModulesError',
                mxAdminApiErrorMessage(err, 'modulesLoadError'),
            );
        })
        .then(function () {
            mxAdminSetListRefreshBusy(btn, false);
        });
}

function mxAdminSelectCategory(path) {
    if (!path) {
        return;
    }
    mxAdminResetPageFilters();
    mxAdminState.activeCategoryPath = path;
    mxAdminState.activePageRow = null;
    mxAdminState.pageRecord = null;
    mxAdminShowPageDetailEmpty();
    mxAdminUpdatePagesScreenHead(path);
    mxAdminSetSidebarCategoryActive(path);

    var loading = mxAdminEl('mxadminPagesLoading');
    loading.classList.remove('hidden');
    mxAdminShowAlert('mxadminPagesError', '');

    mxAdminShowPagesListLoading();

    mxAdminApiRequest('GET', '/api/admin/data/' + encodeURIComponent(path))
        .then(function (resp) {
            loading.classList.add('hidden');
            mxAdminState.categoryDoc = mxAdminUnwrapApiData(resp) || {};
            mxAdminState.categoryPages = Array.isArray(
                mxAdminState.categoryDoc.data,
            )
                ? mxAdminState.categoryDoc.data
                : [];
            mxAdminSortPagesInPlace(mxAdminState.categoryPages);
            mxAdminState.categoryDoc.data = mxAdminState.categoryPages;
            mxAdminFinishCategoryPagesLoad('');
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            mxAdminState.categoryPages = [];
            mxAdminState.categoryDoc = null;
            mxAdminHidePagesListLoading();
            mxAdminRenderPagesList();
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminPagesError',
                mxAdminApiErrorMessage(err, 'pagesLoadError'),
            );
        });
}

function mxAdminGetFilteredPages() {
    var list = mxAdminState.categoryPages || [];
    var q = (mxAdminState.pagesSearch || '').toLowerCase().trim();
    var lang = mxAdminState.lang;
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
        var page = list[i] || {};
        if (!mxAdminPageItemMatchesCategoryFilter(page)) {
            continue;
        }
        var filterItem = mxAdminMergePageRowForFilter(page);
        if (!mxAdminPageItemMatchesDescFilters(filterItem)) {
            continue;
        }
        if (q) {
            var name = mxAdminPickLocalized(page.name, lang).toLowerCase();
            var ppath = (page.path || '').toLowerCase();
            var pid = (page.id || '').toLowerCase();
            if (
                name.indexOf(q) === -1 &&
                ppath.indexOf(q) === -1 &&
                pid.indexOf(q) === -1
            ) {
                continue;
            }
        }
        out.push(page);
    }
    return out;
}

function mxAdminIsPagesSearchActive() {
    return !!(mxAdminState.pagesSearch || '').trim();
}

function mxAdminSortPagesInPlace(list) {
    if (!Array.isArray(list)) {
        return;
    }
    list.sort(function (a, b) {
        var ai = a && typeof a.index === 'number' ? a.index : 999999;
        var bi = b && typeof b.index === 'number' ? b.index : 999999;
        return ai - bi;
    });
}

function mxAdminCollectPageOrderedIds() {
    var list = mxAdminState.categoryPages || [];
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].id) {
            out.push(String(list[i].id));
        }
    }
    return out;
}

function mxAdminPersistPageOrder() {
    var catPath = mxAdminState.activeCategoryPath;
    if (!catPath) {
        return Promise.reject({ code: 'VALIDATION' });
    }
    var orderedIds = mxAdminCollectPageOrderedIds();
    if (!orderedIds.length) {
        return Promise.resolve(null);
    }
    return mxAdminApiRequest(
        'POST',
        '/api/admin/data/page-reorder/' + encodeURIComponent(catPath),
        {
            orderedIds: orderedIds,
        },
    );
}

function mxAdminMovePage(pageRow, delta) {
    if (mxAdminIsPagesSearchActive()) {
        mxAdminToast(mxAdminT('pagesReorderSearchBlock'), true);
        return;
    }
    if (!pageRow || !delta) {
        return;
    }
    var list =
        mxAdminState.categoryDoc && Array.isArray(mxAdminState.categoryDoc.data)
            ? mxAdminState.categoryDoc.data
            : mxAdminState.categoryPages;
    if (!list || !list.length) {
        return;
    }
    var idx = mxAdminFindPageRowIndex(pageRow);
    if (idx < 0) {
        return;
    }
    var newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= list.length) {
        return;
    }
    var item = list.splice(idx, 1)[0];
    list.splice(newIdx, 0, item);
    var i;
    for (i = 0; i < list.length; i++) {
        list[i].index = i;
    }
    mxAdminState.categoryPages = list;
    mxAdminState.categoryDoc.data = list;
    if (
        mxAdminState.activePageRow &&
        mxAdminState.activePageRow.id &&
        pageRow.id === mxAdminState.activePageRow.id
    ) {
        mxAdminState.activePageRow = list[newIdx];
    }
    mxAdminRenderPagesList();
    mxAdminPersistPageOrder()
        .then(function (result) {
            mxAdminOnMutationSuccess(result);
            mxAdminToast(mxAdminT('pagesReorderSuccess'), false);
        })
        .catch(function (err) {
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(
                mxAdminApiErrorMessage(err, 'pagesReorderError'),
                true,
            );
            if (mxAdminState.activeCategoryPath) {
                mxAdminSelectCategory(mxAdminState.activeCategoryPath);
            }
        });
}

function mxAdminMakePageMoveHandler(pageRow, delta) {
    return function (evt) {
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        }
        if (evt && evt.preventDefault) {
            evt.preventDefault();
        }
        mxAdminMovePage(pageRow, delta);
    };
}


function mxAdminBuildPageAddBody() {
    var body = { status: 'play' };
    var filterVal = mxAdminState.pageCategoryFilter || 'all';
    if (
        filterVal &&
        filterVal !== 'all' &&
        filterVal !== MX_ADMIN_PAGE_CATEGORY_NONE
    ) {
        body.category = filterVal;
    } else if (filterVal === MX_ADMIN_PAGE_CATEGORY_NONE) {
        body.category = '';
    }
    return body;
}


function mxAdminAddPage() {
    var catPath = mxAdminState.activeCategoryPath;
    if (!catPath) {
        mxAdminToast(mxAdminT('pageAddNoCategory'), true);
        return;
    }
    var addBtn = mxAdminEl('mxadminPageAddBtn');
    if (addBtn) {
        addBtn.disabled = true;
    }
    mxAdminApiRequest(
        'POST',
        '/api/admin/data/page-add/' + encodeURIComponent(catPath),
        mxAdminBuildPageAddBody(),
    )
        .then(function (resp) {
            var pageId = resp && resp.pageId ? String(resp.pageId) : '';
            var newPageFromResp = resp && resp.page ? resp.page : null;
            return mxAdminApiRequest(
                'GET',
                '/api/admin/data/' + encodeURIComponent(catPath),
            ).then(function (catResp) {
                mxAdminState.categoryDoc = mxAdminUnwrapApiData(catResp) || {};
                mxAdminState.categoryPages = Array.isArray(
                    mxAdminState.categoryDoc.data,
                )
                    ? mxAdminState.categoryDoc.data
                    : [];
                mxAdminSortPagesInPlace(mxAdminState.categoryPages);
                mxAdminState.categoryDoc.data = mxAdminState.categoryPages;
                mxAdminRenderPageFilters();
                mxAdminRenderPagesList();
                var newPage = null;
                var i;
                if (pageId) {
                    for (i = 0; i < mxAdminState.categoryPages.length; i++) {
                        if (
                            mxAdminState.categoryPages[i] &&
                            String(mxAdminState.categoryPages[i].id) === pageId
                        ) {
                            newPage = mxAdminState.categoryPages[i];
                            break;
                        }
                    }
                }
                if (!newPage && newPageFromResp) {
                    newPage = newPageFromResp;
                }
                if (newPage) {
                    mxAdminOpenPageEditor(newPage);
                }
                mxAdminOnMutationSuccess(resp);
                mxAdminToast(mxAdminT('pageAddSuccess'), false);
            });
        })
        .catch(function (err) {
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err, 'pageAddError'), true);
        })
        .then(function () {
            if (addBtn) {
                addBtn.disabled = false;
            }
        });
}


function mxAdminDeletePage() {
    var pageRow = mxAdminState.activePageRow;
    if (!pageRow || !pageRow.id) {
        return;
    }
    var catPath = mxAdminState.activeCategoryPath;
    if (!catPath) {
        return;
    }
    var lang = mxAdminState.lang;
    var name = mxAdminPickLocalized(pageRow.name, lang);
    var label = name || pageRow.path || pageRow.id;
    var confirmMsg = mxAdminT('pageDeleteConfirmBody') + '\n\n' + label;
    if (pageRow.id) {
        confirmMsg = confirmMsg + ' (ID: ' + pageRow.id + ')';
    }
    Global_confirmDelete(confirmMsg, {
        title: mxAdminT('pageDeleteConfirmTitle'),
    }).then(function (ok) {
        if (!ok) {
            return;
        }
        var deleteBtn = mxAdminEl('mxadminPageDeleteBtn');
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }
        mxAdminApiRequest(
            'DELETE',
            '/api/admin/data/page-delete/' +
                encodeURIComponent(catPath) +
                '/' +
                encodeURIComponent(String(pageRow.id)),
        )
            .then(function (result) {
                var idx = mxAdminFindPageRowIndex(pageRow);
                if (idx >= 0 && mxAdminState.categoryPages) {
                    mxAdminState.categoryPages.splice(idx, 1);
                    if (mxAdminState.categoryDoc) {
                        mxAdminState.categoryDoc.data =
                            mxAdminState.categoryPages;
                    }
                }
                mxAdminState.activePageRow = null;
                mxAdminState.pageRecord = null;
                mxAdminState.pageFiles = [];
                mxAdminShowPageDetailEmpty();
                mxAdminRenderPagesList();
                mxAdminOnMutationSuccess(result);
                mxAdminToast(mxAdminT('pageDeleteSuccess'), false);
            })
            .catch(function (err) {
                if (mxAdminHandleUnauthorized(err)) {
                    return;
                }
                mxAdminToast(
                    mxAdminApiErrorMessage(err, 'pageDeleteError'),
                    true,
                );
            })
            .then(function () {
                if (deleteBtn) {
                    deleteBtn.disabled = false;
                }
            });
    });
}

function mxAdminRenderPagesList() {
    mxAdminHidePagesListLoading();
    var ul = mxAdminEl('mxadminPagesList');
    ul.innerHTML = '';
    var list = mxAdminGetFilteredPages();
    var empty = mxAdminEl('mxadminPagesEmpty');

    if (!list.length) {
        if (mxAdminHasActivePageFilters() || mxAdminIsPagesSearchActive()) {
            empty.textContent = mxAdminT('pagesEmptyFiltered');
        } else {
            empty.textContent = mxAdminT('pagesEmpty');
        }
        empty.classList.remove('hidden');
        mxAdminUpdatePagesListMeta(0);
        return;
    }
    empty.classList.add('hidden');
    mxAdminUpdatePagesListMeta(list.length);

    var activeId =
        mxAdminState.activePageRow && mxAdminState.activePageRow.id
            ? String(mxAdminState.activePageRow.id)
            : '';
    var showOrder = !mxAdminIsPagesSearchActive();
    var fullLen = (mxAdminState.categoryPages || []).length;
    var i;
    for (i = 0; i < list.length; i++) {
        var page = list[i] || {};
        var li = document.createElement('li');
        var pageKey = page.id || String(i);
        li.setAttribute('data-mxadmin-page-id', pageKey);
        if (activeId && String(page.id) === activeId) {
            li.classList.add('is-active');
        }
        var displayName = mxAdminGetPageDisplayName(page, i);
        var isLive = page.status !== 'pause';
        var badgeClass = isLive
            ? 'mxadmin-badge-success'
            : 'mxadmin-badge-fail';
        var badgeText = isLive
            ? mxAdminT('statusPlay')
            : mxAdminT('statusPause');
        var fullIdx = showOrder ? mxAdminFindPageRowIndex(page) : -1;
        var orderHtml = '';
        if (showOrder && fullIdx >= 0) {
            orderHtml =
                '<div class="mxadmin-pages-list-order">' +
                '<button type="button" class="mxadmin-page-move-btn' +
                (fullIdx <= 0 ? ' is-off' : '') +
                '" data-mxadmin-page-move="-1" title="' +
                mxAdminEscapeHtml(mxAdminT('pagesMoveUp')) +
                '">' +
                '<span class="material-symbols-outlined">arrow_upward</span></button>' +
                '<button type="button" class="mxadmin-page-move-btn' +
                (fullIdx >= fullLen - 1 ? ' is-off' : '') +
                '" data-mxadmin-page-move="1" title="' +
                mxAdminEscapeHtml(mxAdminT('pagesMoveDown')) +
                '">' +
                '<span class="material-symbols-outlined">arrow_downward</span></button>' +
                '</div>';
        }
        li.innerHTML =
            '<div class="mxadmin-pages-list-item">' +
            orderHtml +
            mxAdminRenderPageListThumb(page) +
            '<div class="mxadmin-pages-list-text">' +
            '<div class="mxadmin-pages-list-title-row">' +
            '<span class="mxadmin-pages-list-title">' +
            mxAdminEscapeHtml(displayName) +
            '</span>' +
            '<span class="mxadmin-badge mxadmin-pages-list-badge ' +
            badgeClass +
            '">' +
            mxAdminEscapeHtml(badgeText) +
            '</span>' +
            '</div>' +
            '<div class="mxadmin-pages-list-meta">' +
            '<span class="mxadmin-page-path">/' +
            mxAdminEscapeHtml(page.path || '') +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        li.onclick = mxAdminMakePageOpenHandler(page);
        if (showOrder && fullIdx >= 0) {
            var upBtn = li.querySelector('[data-mxadmin-page-move="-1"]');
            var downBtn = li.querySelector('[data-mxadmin-page-move="1"]');
            if (upBtn && fullIdx > 0) {
                upBtn.onclick = mxAdminMakePageMoveHandler(page, -1);
            }
            if (downBtn && fullIdx < fullLen - 1) {
                downBtn.onclick = mxAdminMakePageMoveHandler(page, 1);
            }
        }
        ul.appendChild(li);
    }
}

function mxAdminMakePageOpenHandler(pageRow) {
    return function () {
        mxAdminOpenPageEditor(pageRow);
    };
}

function mxAdminFindPageRowIndex(pageRow) {
    var list = mxAdminState.categoryPages || [];
    var i;
    for (i = 0; i < list.length; i++) {
        if (pageRow.id && list[i].id === pageRow.id) {
            return i;
        }
        if (!pageRow.id && list[i] === pageRow) {
            return i;
        }
        if (pageRow.path && list[i].path === pageRow.path && !pageRow.id) {
            return i;
        }
    }
    return -1;
}


function mxAdminGetPageDescSchema() {
    var doc = mxAdminState.categoryDoc;
    if (doc && Array.isArray(doc.desc) && doc.desc.length) {
        return doc.desc;
    }
    var catPath = mxAdminState.activeCategoryPath;
    var cats =
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
            ? mxAdminState.pagesettingData.data
            : [];
    var i;
    for (i = 0; i < cats.length; i++) {
        if (
            cats[i] &&
            cats[i].path === catPath &&
            Array.isArray(cats[i].desc) &&
            cats[i].desc.length
        ) {
            return cats[i].desc;
        }
    }
    return [];
}

function mxAdminGetActivePageDescSchema() {
    var schema = mxAdminGetPageDescSchema();
    var out = [];
    var i;
    for (i = 0; i < schema.length; i++) {
        if (mxAdminIsPageDescDefActive(schema[i])) {
            out.push(schema[i]);
        }
    }
    return out;
}

function mxAdminResetPageFilters() {
    mxAdminState.pageCategoryFilter = 'all';
    mxAdminState.pageDescFilters = {};
    mxAdminState.pageDescById = {};
    mxAdminState.pageDescCacheLoading = false;
    var filterWrap = mxAdminEl('mxadminPagesFilters');
    if (filterWrap) {
        filterWrap.classList.add('hidden');
        filterWrap.innerHTML = '';
    }
}

function mxAdminHasPageCategoryFeature() {
    var list = mxAdminState.categoryPages || [];
    var i;
    for (i = 0; i < list.length; i++) {
        var cat =
            list[i] && list[i].category ? String(list[i].category).trim() : '';
        if (cat) {
            return true;
        }
    }
    return false;
}

function mxAdminPageFiltersVisible() {
    return (
        mxAdminHasPageCategoryFeature() ||
        mxAdminGetActivePageDescSchema().length > 0
    );
}

function mxAdminHasActivePageFilters() {
    if (
        mxAdminState.pageCategoryFilter &&
        mxAdminState.pageCategoryFilter !== 'all'
    ) {
        return true;
    }
    var filters = mxAdminState.pageDescFilters || {};
    var pathKey;
    for (pathKey in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, pathKey)) {
            var fv = filters[pathKey];
            if (fv && fv !== 'all') {
                return true;
            }
        }
    }
    return false;
}

function mxAdminSplitDescValue(raw) {
    if (raw === undefined || raw === null) {
        return [];
    }
    var text = String(raw).trim();
    if (!text) {
        return [];
    }
    var parts = text.split(/\s*\/\s*/);
    var out = [];
    var i;
    for (i = 0; i < parts.length; i++) {
        var piece = String(parts[i] || '').trim();
        if (piece) {
            out.push(piece);
        }
    }
    return out;
}

function mxAdminDescValueMatchesFilter(itemVal, filterVal) {
    if (filterVal === '__empty__') {
        return itemVal === '';
    }
    if (itemVal === filterVal) {
        return true;
    }
    var tokens = mxAdminSplitDescValue(itemVal);
    var ti;
    for (ti = 0; ti < tokens.length; ti++) {
        if (tokens[ti] === filterVal) {
            return true;
        }
    }
    return false;
}

function mxAdminMergePageRowForFilter(page) {
    if (!page || !page.id) {
        return page;
    }
    var cached = mxAdminState.pageDescById[String(page.id)];
    if (!cached || typeof cached !== 'object') {
        return page;
    }
    var merged = {};
    var key;
    for (key in page) {
        if (Object.prototype.hasOwnProperty.call(page, key)) {
            merged[key] = page[key];
        }
    }
    merged.desc = cached;
    return merged;
}

function mxAdminPageItemMatchesCategoryFilter(page) {
    if (!mxAdminHasPageCategoryFeature()) {
        return true;
    }
    var filterVal = mxAdminState.pageCategoryFilter || 'all';
    if (filterVal === 'all') {
        return true;
    }
    var itemCategory =
        page && page.category ? String(page.category).trim() : '';
    var itemKey = itemCategory ? itemCategory : MX_ADMIN_PAGE_CATEGORY_NONE;
    return filterVal === itemKey;
}

function mxAdminPageItemMatchesDescFilters(item) {
    var filters = mxAdminState.pageDescFilters || {};
    var pathKey;
    for (pathKey in filters) {
        if (!Object.prototype.hasOwnProperty.call(filters, pathKey)) {
            continue;
        }
        var filterVal = filters[pathKey];
        if (!filterVal || filterVal === 'all') {
            continue;
        }
        var itemVal = '';
        if (
            item &&
            item.desc &&
            item.desc[pathKey] !== undefined &&
            item.desc[pathKey] !== null
        ) {
            itemVal = String(item.desc[pathKey]).trim();
        }
        if (filterVal === '__empty__') {
            if (itemVal !== '') {
                return false;
            }
        } else if (!mxAdminDescValueMatchesFilter(itemVal, filterVal)) {
            return false;
        }
    }
    return true;
}

function mxAdminGetFilterDataList() {
    var list = mxAdminState.categoryPages || [];
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
        out.push(mxAdminMergePageRowForFilter(list[i]));
    }
    return out;
}

function mxAdminCollectDescFilterOptions(dataList, pathKey) {
    var uniqueMap = {};
    var options = [];
    var di;
    for (di = 0; di < dataList.length; di++) {
        var row = dataList[di];
        var raw = '';
        if (
            row &&
            row.desc &&
            row.desc[pathKey] !== undefined &&
            row.desc[pathKey] !== null
        ) {
            raw = String(row.desc[pathKey]).trim();
        }
        var candidates = [raw];
        var tokens = mxAdminSplitDescValue(raw);
        var ti;
        for (ti = 0; ti < tokens.length; ti++) {
            candidates.push(tokens[ti]);
        }
        var ci;
        for (ci = 0; ci < candidates.length; ci++) {
            var val = candidates[ci];
            if (!Object.prototype.hasOwnProperty.call(uniqueMap, val)) {
                uniqueMap[val] = true;
                options.push(val);
            }
        }
    }
    options.sort(function (a, b) {
        if (a === '' && b !== '') {
            return 1;
        }
        if (b === '' && a !== '') {
            return -1;
        }
        return a.localeCompare(b, mxAdminState.lang || 'tr', {
            sensitivity: 'base',
        });
    });
    return options;
}

function mxAdminLoadPageDescCache(done) {
    var schema = mxAdminGetActivePageDescSchema();
    if (!schema.length) {
        mxAdminState.pageDescById = {};
        if (done) {
            done();
        }
        return;
    }
    var list = mxAdminState.categoryPages || [];
    var ids = [];
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].id) {
            ids.push(String(list[i].id));
        }
    }
    if (!ids.length) {
        mxAdminState.pageDescById = {};
        if (done) {
            done();
        }
        return;
    }
    mxAdminState.pageDescCacheLoading = true;
    mxAdminState.pageDescById = {};
    var idx = 0;
    var chunkSize = 8;
    function loadChunk() {
        if (idx >= ids.length) {
            mxAdminState.pageDescCacheLoading = false;
            if (done) {
                done();
            }
            return;
        }
        var end = Math.min(idx + chunkSize, ids.length);
        var pending = end - idx;
        var j;
        for (j = idx; j < end; j++) {
            (function (pageId) {
                mxAdminApiRequest(
                    'GET',
                    '/api/admin/data/page-record/' + encodeURIComponent(pageId),
                )
                    .then(function (resp) {
                        var data = mxAdminUnwrapApiData(resp) || {};
                        if (data.desc && typeof data.desc === 'object') {
                            mxAdminState.pageDescById[pageId] = data.desc;
                        }
                    })
                    .catch(function () {})
                    .then(function () {
                        pending -= 1;
                        if (pending <= 0) {
                            idx = end;
                            loadChunk();
                        }
                    });
            })(ids[j]);
        }
    }
    loadChunk();
}

function mxAdminBuildPageCategoryFilterHtml() {
    var list = mxAdminState.categoryPages || [];
    var categoryCounts = {};
    var noneCount = 0;
    var i;
    for (i = 0; i < list.length; i++) {
        var rawCategory =
            list[i] && list[i].category ? String(list[i].category).trim() : '';
        if (rawCategory) {
            categoryCounts[rawCategory] =
                (categoryCounts[rawCategory] || 0) + 1;
        } else {
            noneCount += 1;
        }
    }
    var categories = Object.keys(categoryCounts).sort(function (a, b) {
        return a.localeCompare(b, mxAdminState.lang || 'tr', {
            sensitivity: 'base',
        });
    });
    var filterVal = mxAdminState.pageCategoryFilter || 'all';
    if (
        filterVal !== 'all' &&
        filterVal !== MX_ADMIN_PAGE_CATEGORY_NONE &&
        !Object.prototype.hasOwnProperty.call(categoryCounts, filterVal)
    ) {
        filterVal = 'all';
        mxAdminState.pageCategoryFilter = 'all';
    }
    if (filterVal === MX_ADMIN_PAGE_CATEGORY_NONE && noneCount === 0) {
        filterVal = 'all';
        mxAdminState.pageCategoryFilter = 'all';
    }
    var totalCount = list.length;
    var categorizedCount = 0;
    var cat;
    for (cat in categoryCounts) {
        if (Object.prototype.hasOwnProperty.call(categoryCounts, cat)) {
            categorizedCount += categoryCounts[cat];
        }
    }
    var html = '<div class="mxadmin-page-category-summary">';
    html += '<div class="mxadmin-page-category-summary-item">';
    html +=
        '<span class="mxadmin-page-category-summary-label">' +
        mxAdminEscapeHtml(mxAdminT('pagesFilterCategorized')) +
        ':</span>';
    html +=
        '<span class="mxadmin-page-category-summary-value">' +
        categorizedCount +
        '</span></div>';
    html += '<div class="mxadmin-page-category-summary-item">';
    html +=
        '<span class="mxadmin-page-category-summary-label">' +
        mxAdminEscapeHtml(mxAdminT('pagesFilterUncategorized')) +
        ':</span>';
    html +=
        '<span class="mxadmin-page-category-summary-value">' +
        noneCount +
        '</span></div>';
    html += '<div class="mxadmin-page-category-summary-item">';
    html +=
        '<span class="mxadmin-page-category-summary-label">' +
        mxAdminEscapeHtml(mxAdminT('pagesFilterMismatch')) +
        ':</span>';
    html += '<span class="mxadmin-page-category-summary-value">0</span></div>';
    html +=
        '<div class="mxadmin-page-category-summary-item mxadmin-page-category-summary-item-select">';
    html +=
        '<span class="mxadmin-page-category-summary-label">' +
        mxAdminEscapeHtml(mxAdminT('pagesFilterCategory')) +
        '</span>';
    html +=
        '<select id="mxadminPageCategorySelect" class="mxadmin-select mxadmin-select-sm mxadmin-page-category-select">';
    html +=
        '<option value="all"' +
        (filterVal === 'all' ? ' selected' : '') +
        '>' +
        mxAdminEscapeHtml(
            mxAdminT('pagesFilterAll') + ' (' + totalCount + ')',
        ) +
        '</option>';
    for (i = 0; i < categories.length; i++) {
        var category = categories[i];
        var count = categoryCounts[category] || 0;
        html +=
            '<option value="' +
            mxAdminEscapeHtml(category) +
            '"' +
            (filterVal === category ? ' selected' : '') +
            '>' +
            mxAdminEscapeHtml(category + ' (' + count + ')') +
            '</option>';
    }
    if (noneCount > 0) {
        html +=
            '<option value="' +
            MX_ADMIN_PAGE_CATEGORY_NONE +
            '"' +
            (filterVal === MX_ADMIN_PAGE_CATEGORY_NONE ? ' selected' : '') +
            '>' +
            mxAdminEscapeHtml(
                mxAdminT('pagesFilterUncategorizedOption') +
                    ' (' +
                    noneCount +
                    ')',
            ) +
            '</option>';
    }
    html += '</select></div></div>';
    return html;
}

function mxAdminBuildPageDescFiltersHtml() {
    var schema = mxAdminGetActivePageDescSchema();
    if (!schema.length) {
        return '';
    }
    var dataList = mxAdminGetFilterDataList();
    var validPaths = {};
    var html = '<div class="mxadmin-page-desc-filters">';
    var fi;
    for (fi = 0; fi < schema.length; fi++) {
        var descDef = schema[fi];
        var pathKey = descDef && descDef.path ? String(descDef.path) : '';
        if (!pathKey) {
            continue;
        }
        validPaths[pathKey] = true;
        var label = mxAdminGetPageDescDefLabel(descDef, mxAdminState.lang);
        var options = mxAdminCollectDescFilterOptions(dataList, pathKey);
        var currentFilter = mxAdminState.pageDescFilters[pathKey];
        if (
            currentFilter === undefined ||
            currentFilter === null ||
            currentFilter === ''
        ) {
            currentFilter = 'all';
        }
        if (currentFilter !== 'all' && currentFilter !== '__empty__') {
            var stillValid = false;
            var oi;
            for (oi = 0; oi < options.length; oi++) {
                if (options[oi] === currentFilter) {
                    stillValid = true;
                    break;
                }
            }
            if (!stillValid) {
                currentFilter = 'all';
                mxAdminState.pageDescFilters[pathKey] = 'all';
            }
        }
        html += '<div class="mxadmin-page-desc-filter-item">';
        html +=
            '<span class="mxadmin-page-desc-filter-label">' +
            mxAdminEscapeHtml(label) +
            '</span>';
        html +=
            '<select class="mxadmin-select mxadmin-select-sm mxadmin-page-desc-filter-select" data-mxadmin-desc-filter="' +
            mxAdminEscapeHtml(pathKey) +
            '">';
        html +=
            '<option value="all"' +
            (currentFilter === 'all' ? ' selected' : '') +
            '>' +
            mxAdminEscapeHtml(mxAdminT('pagesFilterAll')) +
            '</option>';
        var oj;
        for (oj = 0; oj < options.length; oj++) {
            var optVal = options[oj];
            var optAttr = optVal === '' ? '__empty__' : optVal;
            var optLabel =
                optVal === '' ? mxAdminT('pagesFilterEmpty') : optVal;
            html +=
                '<option value="' +
                mxAdminEscapeHtml(optAttr) +
                '"' +
                (currentFilter === optAttr ? ' selected' : '') +
                '>' +
                mxAdminEscapeHtml(optLabel) +
                '</option>';
        }
        html += '</select></div>';
    }
    html += '</div>';
    for (var staleKey in mxAdminState.pageDescFilters) {
        if (
            Object.prototype.hasOwnProperty.call(
                mxAdminState.pageDescFilters,
                staleKey,
            ) &&
            !validPaths[staleKey]
        ) {
            delete mxAdminState.pageDescFilters[staleKey];
        }
    }
    return html;
}

function mxAdminBindPageFilterEvents() {
    var catSel = mxAdminEl('mxadminPageCategorySelect');
    if (catSel) {
        catSel.onchange = function () {
            mxAdminSetPageCategoryFilter(catSel.value);
        };
    }
    var descSels = document.querySelectorAll('[data-mxadmin-desc-filter]');
    var i;
    for (i = 0; i < descSels.length; i++) {
        descSels[i].onchange = mxAdminMakePageDescFilterChangeHandler(
            descSels[i].getAttribute('data-mxadmin-desc-filter'),
        );
    }
}

function mxAdminMakePageDescFilterChangeHandler(pathKey) {
    return function () {
        var val = this && this.value ? this.value : 'all';
        mxAdminSetPageDescFilter(pathKey, val);
    };
}

function mxAdminSetPageCategoryFilter(value) {
    var nextVal = value || 'all';
    if (mxAdminState.pageCategoryFilter === nextVal) {
        return;
    }
    mxAdminState.pageCategoryFilter = nextVal;
    mxAdminRenderPagesList();
}

function mxAdminSetPageDescFilter(pathKey, value) {
    if (!pathKey) {
        return;
    }
    var nextVal = value || 'all';
    if (mxAdminState.pageDescFilters[pathKey] === nextVal) {
        return;
    }
    mxAdminState.pageDescFilters[pathKey] = nextVal;
    mxAdminRenderPagesList();
}

function mxAdminRenderPageFilters() {
    var wrap = mxAdminEl('mxadminPagesFilters');
    if (!wrap) {
        return;
    }
    if (!mxAdminPageFiltersVisible()) {
        wrap.classList.add('hidden');
        wrap.innerHTML = '';
        return;
    }
    wrap.classList.remove('hidden');
    var html = '<div class="mxadmin-pages-filters-inner">';
    if (mxAdminHasPageCategoryFeature()) {
        html += mxAdminBuildPageCategoryFilterHtml();
    }
    html += mxAdminBuildPageDescFiltersHtml();
    html += '</div>';
    wrap.innerHTML = html;
    mxAdminBindPageFilterEvents();
}

function mxAdminIsPageDescDefActive(descDef) {
    if (!descDef || !descDef.path) {
        return false;
    }
    if (descDef.active === false) {
        return false;
    }
    return true;
}

function mxAdminGetPageDescDefLabel(descDef, lang) {
    if (!descDef) {
        return '';
    }
    if (descDef.name) {
        return mxAdminPickLocalized(descDef.name, lang);
    }
    return descDef.path ? String(descDef.path) : '';
}

function mxAdminCollectPageDescSuggestions(pathKey) {
    var seen = {};
    var list = [];
    var rows = mxAdminState.categoryPages || [];
    var ri;
    for (ri = 0; ri < rows.length; ri++) {
        var row = rows[ri] || {};
        var raw = '';
        if (
            row.desc &&
            row.desc[pathKey] !== undefined &&
            row.desc[pathKey] !== null
        ) {
            raw = String(row.desc[pathKey]).trim();
        }
        if (raw && !seen[raw]) {
            seen[raw] = true;
            list.push(raw);
        }
    }
    list.sort(function (a, b) {
        return a.localeCompare(b, mxAdminState.lang || 'tr', {
            sensitivity: 'base',
        });
    });
    return list;
}

function mxAdminRenderPageDescFields(pageRow, record) {
    var panel = mxAdminEl('mxadminPageDescPanel');
    var fields = mxAdminEl('mxadminPageDescFields');
    var meta = mxAdminEl('mxadminPageDescMeta');
    if (!panel || !fields) {
        return;
    }

    var schema = mxAdminGetPageDescSchema();
    var activeSchema = [];
    var si;
    for (si = 0; si < schema.length; si++) {
        if (mxAdminIsPageDescDefActive(schema[si])) {
            activeSchema.push(schema[si]);
        }
    }

    if (!activeSchema.length) {
        panel.classList.add('hidden');
        fields.innerHTML = '';
        if (meta) {
            meta.textContent = '0';
        }
        return;
    }

    var descObj = {};
    if (record && record.desc && typeof record.desc === 'object') {
        descObj = record.desc;
    } else if (pageRow && pageRow.desc && typeof pageRow.desc === 'object') {
        descObj = pageRow.desc;
    }

    panel.classList.remove('hidden');
    fields.innerHTML = '';
    if (meta) {
        meta.textContent = String(activeSchema.length);
    }

    var lang = mxAdminState.lang;
    for (si = 0; si < activeSchema.length; si++) {
        var descDef = activeSchema[si];
        var pathKey = String(descDef.path);
        var label = mxAdminGetPageDescDefLabel(descDef, lang);
        var val =
            descObj[pathKey] !== undefined && descObj[pathKey] !== null
                ? String(descObj[pathKey])
                : '';
        var listId = 'mxadmin-page-desc-dl-' + pathKey;
        var inputId = 'mxadmin-page-desc-' + pathKey;

        var group = document.createElement('div');
        group.className = 'mxadmin-form-group';
        group.innerHTML =
            '<label for="' +
            mxAdminEscapeHtml(inputId) +
            '">' +
            mxAdminEscapeHtml(label) +
            '</label>' +
            '<input type="text" id="' +
            mxAdminEscapeHtml(inputId) +
            '" list="' +
            mxAdminEscapeHtml(listId) +
            '" ' +
            'data-mxadmin-page-desc-key="' +
            mxAdminEscapeHtml(pathKey) +
            '" value="' +
            mxAdminEscapeHtml(val) +
            '" />' +
            '<span class="mxadmin-page-desc-code">desc.' +
            mxAdminEscapeHtml(pathKey) +
            '</span>';

        var datalist = document.createElement('datalist');
        datalist.id = listId;
        var suggestions = mxAdminCollectPageDescSuggestions(pathKey);
        var sj;
        for (sj = 0; sj < suggestions.length; sj++) {
            var opt = document.createElement('option');
            opt.value = suggestions[sj];
            datalist.appendChild(opt);
        }

        group.appendChild(datalist);
        fields.appendChild(group);
    }
}

function mxAdminCollectPageDescFromForm() {
    var out = {};
    var inputs = document.querySelectorAll('[data-mxadmin-page-desc-key]');
    var i;
    for (i = 0; i < inputs.length; i++) {
        var key = inputs[i].getAttribute('data-mxadmin-page-desc-key');
        if (key) {
            out[key] = String(inputs[i].value || '').trim();
        }
    }
    return out;
}


function mxAdminGetPageModuleStatus() {
    var doc = mxAdminState.categoryDoc;
    if (doc && doc.modulestatus && typeof doc.modulestatus === 'object') {
        return doc.modulestatus;
    }
    var catPath = mxAdminState.activeCategoryPath;
    var cats =
        mxAdminState.pagesettingData &&
        Array.isArray(mxAdminState.pagesettingData.data)
            ? mxAdminState.pagesettingData.data
            : [];
    var i;
    for (i = 0; i < cats.length; i++) {
        if (
            cats[i] &&
            cats[i].path === catPath &&
            cats[i].modulestatus &&
            typeof cats[i].modulestatus === 'object'
        ) {
            return cats[i].modulestatus;
        }
    }
    return {};
}


function mxAdminIsPageDetailClosed() {
    var ms = mxAdminGetPageModuleStatus();
    return !!(ms && ms.detail === false);
}

var MXADMIN_PAGE_LIST_BASE_KEYS = [
    'name',
    'id',
    'index',
    'path',
    'category',
    'img',
    'bg',
    'bgimg',
    'status',
    'url',
    'icon',
    'desing',
    'pathnext',
    'description',
    'modulestatus',
];

function mxAdminListRowIncludesText(modulestatus) {
    return !!(modulestatus && modulestatus.detail === false);
}

function mxAdminGetPageListRowKeys(modulestatus) {
    var keys = MXADMIN_PAGE_LIST_BASE_KEYS.slice();
    if (mxAdminListRowIncludesText(modulestatus)) {
        keys.push('text');
    }
    return keys;
}

function mxAdminExtractPageListRow(fullPage, modulestatus) {
    var row = {};
    var keys = mxAdminGetPageListRowKeys(modulestatus);
    var i;
    for (i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (fullPage && fullPage[k] !== undefined) {
            row[k] = fullPage[k];
        }
    }
    return row;
}


function mxAdminPrunePageListRowInPlace(row, modulestatus) {
    if (!row || typeof row !== 'object') {
        return;
    }
    var allowed = mxAdminExtractPageListRow(row, modulestatus);
    var key;
    for (key in row) {
        if (
            Object.prototype.hasOwnProperty.call(row, key) &&
            allowed[key] === undefined
        ) {
            delete row[key];
        }
    }
    for (key in allowed) {
        if (Object.prototype.hasOwnProperty.call(allowed, key)) {
            row[key] = allowed[key];
        }
    }
}


function mxAdminApplyPageTextPlacement(pageRow, record, textObj, modulestatus) {
    var detailClosed = mxAdminListRowIncludesText(modulestatus);
    if (detailClosed) {
        pageRow.text = textObj;
        if (record && record.text !== undefined) {
            delete record.text;
        }
    } else {
        if (pageRow.text !== undefined) {
            delete pageRow.text;
        }
        if (record) {
            record.text = textObj;
        }
    }
}

function mxAdminIsPageImgActive() {
    var ms = mxAdminGetPageModuleStatus();
    return !!(ms && ms.img === true);
}

function mxAdminIsLocalPreview() {
    if (typeof window === 'undefined' || !window.location) {
        return false;
    }
    var host = (window.location.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1';
}


function mxAdminPublicSiteAssetUrl(relPath) {
    var path = String(relPath || '').replace(/^\/+/, '');
    if (mxAdminIsLocalPreview()) {
        var segments = path.split('/');
        if (segments[0] === 'page' && segments.length >= 3) {
            var pageId = segments[1];
            var pageFile = segments.slice(2).join('/');
            return mxAdminApiUrl(
                '/api/admin/data/page-media/' +
                    encodeURIComponent(pageId) +
                    '/' +
                    encodeURIComponent(pageFile),
            );
        }
        if (segments[0] === 'img' && segments.length >= 3) {
            var moduleId = segments[1];
            var moduleFile = segments.slice(2).join('/');
            return mxAdminApiUrl(
                '/api/admin/data/module-media/' +
                    encodeURIComponent(moduleId) +
                    '/' +
                    encodeURIComponent(moduleFile),
            );
        }
    }
    var origin =
        typeof window !== 'undefined' && window.location
            ? window.location.origin.replace(/\/+$/, '')
            : '';
    return origin ? origin + '/' + path : '/' + path;
}


function mxAdminSiteLogoFile(setting) {
    var fromSetting =
        setting && setting.logo ? String(setting.logo).trim() : '';
    if (fromSetting) {
        return fromSetting.replace(/^\/+/, '');
    }
    if (
        typeof MX_ADMIN_SITE_LOGO === 'string' &&
        MX_ADMIN_SITE_LOGO &&
        MX_ADMIN_SITE_LOGO.indexOf('{{') !== 0
    ) {
        return String(MX_ADMIN_SITE_LOGO).replace(/^\/+/, '').trim();
    }
    return '';
}


function mxAdminSiteLogoUrl(logoFile) {
    var file = String(logoFile || '').replace(/^\/+/, '').trim();
    if (!file) {
        return '';
    }
    return mxAdminPublicSiteAssetUrl('img/' + file);
}


function mxAdminApplySiteLogoPair(img, fallback, logoUrl, altText) {
    if (!img || !fallback) {
        return;
    }
    if (logoUrl) {
        img.src = logoUrl;
        img.alt = altText || '';
        img.classList.remove('hidden');
        fallback.classList.add('hidden');
        img.onerror = function () {
            img.classList.add('hidden');
            img.src = '';
            img.onerror = null;
            fallback.classList.remove('hidden');
        };
        return;
    }
    img.classList.add('hidden');
    img.src = '';
    img.onerror = null;
    fallback.classList.remove('hidden');
}

function mxAdminApplySiteLogo(setting) {
    var data = setting || mxAdminState.settingData || {};
    var logoFile = mxAdminSiteLogoFile(data);
    var logoUrl = mxAdminSiteLogoUrl(logoFile);
    var alt =
        mxAdminPickLocalized(data.name, mxAdminState.lang) ||
        (typeof data.name === 'string' ? data.name : '') ||
        mxAdminT('fieldLogo');
    mxAdminApplySiteLogoPair(
        mxAdminEl('mxadminLoginLogoImg'),
        mxAdminEl('mxadminLoginLogoFallback'),
        logoUrl,
        alt,
    );
    mxAdminApplySiteLogoPair(
        mxAdminEl('mxadminSidebarLogoImg'),
        mxAdminEl('mxadminSidebarLogoFallback'),
        logoUrl,
        alt,
    );
    mxAdminApplySiteLogoPair(
        mxAdminEl('mxadminUserChipLogoImg'),
        mxAdminEl('mxadminUserChipLogoFallback'),
        logoUrl,
        alt,
    );
}


function mxAdminPrefetchSiteLogo() {
    if (mxAdminSiteLogoFile(null)) {
        mxAdminApplySiteLogo(null);
        return;
    }
    if (!mxAdminApiConfigured()) {
        return;
    }
    mxAdminApiRequest('GET', '/api/admin/data/setting')
        .then(function (resp) {
            var data = mxAdminUnwrapApiData(resp) || {};
            if (!mxAdminState.settingData) {
                mxAdminState.settingData = data;
            }
            mxAdminApplySiteLogo(data);
        })
        .catch(function () {
            
        });
}

function mxAdminPageMediaUrl(pageId, filename) {
    return mxAdminPublicSiteAssetUrl(
        'page/' +
            encodeURIComponent(String(pageId)) +
            '/' +
            encodeURIComponent(String(filename)),
    );
}


function mxAdminRenderPageListThumb(page) {
    var iconName = page && page.icon ? String(page.icon).trim() : '';
    if (!iconName) {
        iconName = 'description';
    }
    if (!mxAdminIsPageImgActive()) {
        return (
            '<span class="material-symbols-outlined mxadmin-pages-list-icon">' +
            mxAdminEscapeHtml(iconName) +
            '</span>'
        );
    }
    var imgFile = page && page.img ? String(page.img).trim() : '';
    if (page && page.id && imgFile) {
        return (
            '<div class="mxadmin-pages-list-thumb-wrap">' +
            '<img class="mxadmin-pages-list-thumb" src="' +
            mxAdminEscapeHtml(mxAdminPageMediaUrl(page.id, imgFile)) +
            '" alt="" loading="lazy" onerror="this.style.display=\'none\';var n=this.nextElementSibling;if(n){n.classList.remove(\'hidden\');}" />' +
            '<span class="material-symbols-outlined mxadmin-pages-list-icon mxadmin-pages-list-thumb-fallback hidden">' +
            mxAdminEscapeHtml(iconName) +
            '</span>' +
            '</div>'
        );
    }
    return (
        '<span class="material-symbols-outlined mxadmin-pages-list-icon">' +
        mxAdminEscapeHtml(iconName) +
        '</span>'
    );
}

function mxAdminUploadPageFile(pageId, file) {
    if (mxAdminIsLocalPreview()) {
        var fd = new FormData();
        fd.append('file', file);
        return mxAdminApiUpload(
            '/api/admin/data/page-upload/' + encodeURIComponent(pageId),
            fd,
        );
    }
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            var result = String(reader.result || '');
            var base64 =
                result.indexOf(',') !== -1 ? result.split(',')[1] : result;
            mxAdminApiRequest(
                'POST',
                '/api/admin/data/page-upload/' + encodeURIComponent(pageId),
                {
                    filename: file.name,
                    contentBase64: base64,
                },
            )
                .then(resolve)
                .catch(reject);
        };
        reader.onerror = function () {
            reject({ code: 'NETWORK' });
        };
        reader.readAsDataURL(file);
    });
}

function mxAdminLoadPageFiles() {
    var pageRow = mxAdminState.activePageRow;
    if (!pageRow || !pageRow.id || !mxAdminIsPageImgActive()) {
        mxAdminState.pageFiles = [];
        mxAdminRenderPageMediaGrid();
        return;
    }
    mxAdminApiRequest(
        'GET',
        '/api/admin/data/page-files/' + encodeURIComponent(pageRow.id),
    )
        .then(function (resp) {
            mxAdminState.pageFiles =
                resp && Array.isArray(resp.files) ? resp.files : [];
            mxAdminRenderPageMediaGrid();
        })
        .catch(function () {
            mxAdminState.pageFiles = [];
            mxAdminRenderPageMediaGrid();
        });
}

function mxAdminRenderPageMediaPanel(pageRow) {
    var panel = mxAdminEl('mxadminPageMediaPanel');
    var hint = mxAdminEl('mxadminPageMediaCoverHint');
    if (!panel) {
        return;
    }
    if (!mxAdminIsPageImgActive() || !pageRow || !pageRow.id) {
        panel.classList.add('hidden');
        mxAdminState.pageFiles = [];
        mxAdminRenderPageMediaGrid();
        return;
    }
    panel.classList.remove('hidden');
    if (hint) {
        hint.classList.remove('hidden');
    }
    mxAdminLoadPageFiles();
}

function mxAdminRenderPageMediaGrid() {
    var grid = mxAdminEl('mxadminPageMediaGrid');
    var meta = mxAdminEl('mxadminPageMediaMeta');
    var pageRow = mxAdminState.activePageRow;
    if (!grid) {
        return;
    }
    grid.innerHTML = '';
    if (!mxAdminIsPageImgActive() || !pageRow || !pageRow.id) {
        if (meta) {
            meta.textContent = '0';
        }
        return;
    }
    var files = mxAdminState.pageFiles || [];
    var cover = pageRow.img ? String(pageRow.img) : '';
    if (meta) {
        meta.textContent = String(files.length);
    }
    var i;
    for (i = 0; i < files.length; i++) {
        var fname = files[i];
        var card = document.createElement('div');
        card.className = 'mxadmin-module-media-card';
        if (cover && cover === fname) {
            card.className += ' is-primary';
        }
        card.setAttribute('data-mxadmin-page-media-file', fname);
        card.innerHTML =
            '<img class="mxadmin-module-media-thumb" src="' +
            mxAdminEscapeHtml(mxAdminPageMediaUrl(pageRow.id, fname)) +
            '" alt="" loading="lazy" onerror="this.style.display=\'none\'" />' +
            '<button type="button" class="mxadmin-module-media-delete" data-mxadmin-page-media-delete="' +
            mxAdminEscapeHtml(fname) +
            '" title="' +
            mxAdminEscapeHtml(mxAdminT('moduleDataRemove')) +
            '">' +
            '<span class="material-symbols-outlined" style="font-size:16px;">delete</span></button>' +
            (cover && cover === fname
                ? '<span class="mxadmin-page-media-cover-badge">' +
                  mxAdminEscapeHtml(mxAdminT('pageMediaCoverBadge')) +
                  '</span>'
                : '') +
            '<div class="mxadmin-module-media-name">' +
            mxAdminEscapeHtml(fname) +
            '</div>';
        card.onclick = mxAdminMakePageMediaCoverHandler(fname);
        grid.appendChild(card);
    }
    var uploadCard = document.createElement('div');
    uploadCard.className = 'mxadmin-module-media-upload-card';
    uploadCard.innerHTML =
        '<span class="material-symbols-outlined">add_photo_alternate</span>' +
        '<span>' +
        mxAdminEscapeHtml(mxAdminT('moduleMediaUpload')) +
        '</span>';
    uploadCard.onclick = function (evt) {
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        }
        mxAdminEl('mxadminPageMediaInput').click();
    };
    grid.appendChild(uploadCard);

    var delBtns = grid.querySelectorAll('[data-mxadmin-page-media-delete]');
    var di;
    for (di = 0; di < delBtns.length; di++) {
        delBtns[di].onclick = mxAdminMakePageMediaDeleteHandler(
            delBtns[di].getAttribute('data-mxadmin-page-media-delete'),
        );
    }
}

function mxAdminMakePageMediaCoverHandler(filename) {
    return function (evt) {
        if (
            evt &&
            evt.target &&
            evt.target.closest &&
            evt.target.closest('[data-mxadmin-page-media-delete]')
        ) {
            return;
        }
        var pageRow = mxAdminState.activePageRow;
        if (!pageRow || !filename) {
            return;
        }
        pageRow.img = filename;
        mxAdminRenderPageMediaGrid();
        mxAdminRenderPagesList();
    };
}

function mxAdminMakePageMediaDeleteHandler(filename) {
    return function (evt) {
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        }
        var pageRow = mxAdminState.activePageRow;
        if (!pageRow || !pageRow.id || !filename) {
            return;
        }
        Global_confirmDelete(filename).then(function (ok) {
            if (!ok) {
                return;
            }
            mxAdminApiRequest(
                'DELETE',
                '/api/admin/data/page-file/' +
                    encodeURIComponent(pageRow.id) +
                    '/' +
                    encodeURIComponent(filename),
            )
                .then(function () {
                    if (
                        pageRow.img &&
                        String(pageRow.img) === String(filename)
                    ) {
                        pageRow.img = '';
                    }
                    mxAdminToast(mxAdminT('moduleMediaDeleteSuccess'), false);
                    mxAdminLoadPageFiles();
                    mxAdminRenderPagesList();
                })
                .catch(function (err) {
                    mxAdminToast(
                        mxAdminApiErrorMessage(err, 'moduleMediaUploadError'),
                        true,
                    );
                });
        });
    };
}

function mxAdminHandlePageMediaUploadInput(evt) {
    var pageRow = mxAdminState.activePageRow;
    var files = evt.target.files;
    if (!pageRow || !pageRow.id || !files || !files.length) {
        return;
    }
    var total = files.length;
    var done = 0;
    var okCount = 0;
    var fi;
    function onDone() {
        done += 1;
        if (done >= total) {
            evt.target.value = '';
            mxAdminLoadPageFiles();
            if (okCount > 0) {
                mxAdminToast(mxAdminT('moduleMediaUploadSuccess'), false);
            } else {
                mxAdminToast(mxAdminT('moduleMediaUploadError'), true);
            }
        }
    }
    for (fi = 0; fi < files.length; fi++) {
        mxAdminUploadPageFile(pageRow.id, files[fi])
            .then(function () {
                okCount += 1;
                onDone();
            })
            .catch(function () {
                onDone();
            });
    }
}

function mxAdminOpenPageEditor(pageRow) {
    mxAdminState.activePageRow = pageRow;
    mxAdminState.pageRecord = null;
    mxAdminState.activePageTab = 'general';
    mxAdminShowPageTab('general');

    var items = mxAdminEl('mxadminPagesList').children;
    var pageKey = pageRow.id || '';
    var i;
    for (i = 0; i < items.length; i++) {
        var liId = items[i].getAttribute('data-mxadmin-page-id');
        if (pageKey && liId === String(pageKey)) {
            items[i].classList.add('is-active');
        } else {
            items[i].classList.remove('is-active');
        }
    }

    mxAdminEl('mxadminPageStatus').value =
        pageRow.status === 'pause' ? 'pause' : 'play';
    mxAdminEl('mxadminPagePath').value = pageRow.path || '';
    mxAdminUpdatePageDetailHeader(pageRow);
    mxAdminShowPageDetailLoading(true);

    var finishRender = function () {
        mxAdminRenderPageFormFields(pageRow, mxAdminState.pageRecord);
        mxAdminShowPageDetailForm();
    };

    if (pageRow.id) {
        mxAdminApiRequest(
            'GET',
            '/api/admin/data/page-record/' + encodeURIComponent(pageRow.id),
        )
            .then(function (resp) {
                mxAdminState.pageRecord = mxAdminUnwrapApiData(resp) || {};
                finishRender();
            })
            .catch(function () {
                mxAdminState.pageRecord = {};
                finishRender();
            });
    } else {
        finishRender();
    }
}

function mxAdminHtmlEditorInsertWrap(textarea, before, after) {
    if (!textarea) {
        return;
    }
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var val = String(textarea.value || '');
    var selected = val.substring(start, end);
    var insert = before + selected + after;
    textarea.value = val.substring(0, start) + insert + val.substring(end);
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
}

function mxAdminHtmlEditorPreviewDoc(html) {
    return (
        '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:16px;line-height:1.65;color:#1c1917;background:#fafaf9;}h2,h3,h4{color:#0f766e;}ul{padding-left:1.25em;}a{color:#0d9488;}</style></head><body>' +
        (html || '') +
        '</body></html>'
    );
}

function mxAdminSyncPageHtmlEditorPreview(editorWrap) {
    if (!editorWrap) {
        return;
    }
    var source = editorWrap.querySelector('.mxadmin-html-editor-source');
    var preview = editorWrap.querySelector('.mxadmin-html-editor-preview');
    if (!source || !preview) {
        return;
    }
    preview.srcdoc = mxAdminHtmlEditorPreviewDoc(source.value);
}

function mxAdminSetPageHtmlEditorTab(editorWrap, tabName) {
    if (!editorWrap) {
        return;
    }
    var isPreview = tabName === 'preview';
    var tabSource = editorWrap.querySelector(
        '[data-mxadmin-html-tab="source"]',
    );
    var tabPreview = editorWrap.querySelector(
        '[data-mxadmin-html-tab="preview"]',
    );
    var panelSource = editorWrap.querySelector(
        '.mxadmin-html-editor-panel-source',
    );
    var panelPreview = editorWrap.querySelector(
        '.mxadmin-html-editor-panel-preview',
    );
    if (tabSource) {
        if (isPreview) {
            tabSource.classList.remove('is-active');
        } else {
            tabSource.classList.add('is-active');
        }
    }
    if (tabPreview) {
        if (isPreview) {
            tabPreview.classList.add('is-active');
        } else {
            tabPreview.classList.remove('is-active');
        }
    }
    if (panelSource) {
        if (isPreview) {
            panelSource.classList.add('hidden');
        } else {
            panelSource.classList.remove('hidden');
        }
    }
    if (panelPreview) {
        if (isPreview) {
            panelPreview.classList.remove('hidden');
            mxAdminSyncPageHtmlEditorPreview(editorWrap);
        } else {
            panelPreview.classList.add('hidden');
        }
    }
}

function mxAdminMakePageHtmlEditorTabHandler(editorWrap, tabName) {
    return function (evt) {
        if (evt && evt.preventDefault) {
            evt.preventDefault();
        }
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        }
        mxAdminSetPageHtmlEditorTab(editorWrap, tabName);
    };
}

function mxAdminMakePageHtmlEditorToolHandler(textarea, before, after) {
    return function (evt) {
        if (evt && evt.preventDefault) {
            evt.preventDefault();
        }
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        }
        mxAdminHtmlEditorInsertWrap(textarea, before, after);
    };
}

function mxAdminCreatePageHtmlEditor(lang, htmlValue) {
    var wrap = document.createElement('div');
    wrap.className = 'mxadmin-html-editor';

    var toolbar = document.createElement('div');
    toolbar.className = 'mxadmin-html-editor-toolbar';

    var tabs = document.createElement('div');
    tabs.className = 'mxadmin-html-editor-tabs';
    var tabSourceBtn = document.createElement('button');
    tabSourceBtn.type = 'button';
    tabSourceBtn.className = 'mxadmin-html-editor-tab is-active';
    tabSourceBtn.setAttribute('data-mxadmin-html-tab', 'source');
    tabSourceBtn.textContent = mxAdminT('pageHtmlTabSource');
    var tabPreviewBtn = document.createElement('button');
    tabPreviewBtn.type = 'button';
    tabPreviewBtn.className = 'mxadmin-html-editor-tab';
    tabPreviewBtn.setAttribute('data-mxadmin-html-tab', 'preview');
    tabPreviewBtn.textContent = mxAdminT('pageHtmlTabPreview');
    tabs.appendChild(tabSourceBtn);
    tabs.appendChild(tabPreviewBtn);

    var tools = document.createElement('div');
    tools.className = 'mxadmin-html-editor-tools';
    var toolDefs = [
        {
            key: 'pageHtmlBold',
            before: '<strong>',
            after: '</strong>',
            icon: 'format_bold',
        },
        {
            key: 'pageHtmlItalic',
            before: '<em>',
            after: '</em>',
            icon: 'format_italic',
        },
        {
            key: 'pageHtmlLink',
            before: '<a href="">',
            after: '</a>',
            icon: 'link',
        },
        { key: 'pageHtmlH2', before: '<h2>', after: '</h2>', icon: 'title' },
        {
            key: 'pageHtmlH3',
            before: '<h3>',
            after: '</h3>',
            icon: 'view_headline',
        },
        { key: 'pageHtmlP', before: '<p>', after: '</p>', icon: 'notes' },
        {
            key: 'pageHtmlUl',
            before: '<ul><li>',
            after: '</li></ul>',
            icon: 'format_list_bulleted',
        },
    ];
    var ti;
    for (ti = 0; ti < toolDefs.length; ti++) {
        var toolBtn = document.createElement('button');
        toolBtn.type = 'button';
        toolBtn.className = 'mxadmin-html-editor-tool';
        toolBtn.setAttribute('title', mxAdminT(toolDefs[ti].key));
        toolBtn.innerHTML =
            '<span class="material-symbols-outlined">' +
            toolDefs[ti].icon +
            '</span>';
        tools.appendChild(toolBtn);
    }

    toolbar.appendChild(tabs);
    toolbar.appendChild(tools);

    var panelSource = document.createElement('div');
    panelSource.className =
        'mxadmin-html-editor-panel mxadmin-html-editor-panel-source';
    var source = document.createElement('textarea');
    source.className = 'mxadmin-html-editor-source';
    source.setAttribute('data-mxadmin-page-text-lang', lang);
    source.spellcheck = false;
    source.value = htmlValue || '';
    panelSource.appendChild(source);

    var panelPreview = document.createElement('div');
    panelPreview.className =
        'mxadmin-html-editor-panel mxadmin-html-editor-panel-preview hidden';
    var preview = document.createElement('iframe');
    preview.className = 'mxadmin-html-editor-preview';
    preview.setAttribute('title', mxAdminT('pageHtmlTabPreview'));
    preview.setAttribute('sandbox', 'allow-same-origin');
    panelPreview.appendChild(preview);

    wrap.appendChild(toolbar);
    wrap.appendChild(panelSource);
    wrap.appendChild(panelPreview);

    tabSourceBtn.onclick = mxAdminMakePageHtmlEditorTabHandler(wrap, 'source');
    tabPreviewBtn.onclick = mxAdminMakePageHtmlEditorTabHandler(
        wrap,
        'preview',
    );

    var toolBtns = tools.querySelectorAll('.mxadmin-html-editor-tool');
    for (ti = 0; ti < toolBtns.length && ti < toolDefs.length; ti++) {
        toolBtns[ti].onclick = mxAdminMakePageHtmlEditorToolHandler(
            source,
            toolDefs[ti].before,
            toolDefs[ti].after,
        );
    }

    return wrap;
}

function mxAdminCollectPageTextFromForm() {
    var out = {};
    var inputs = document.querySelectorAll(
        '.mxadmin-html-editor-source[data-mxadmin-page-text-lang]',
    );
    var i;
    for (i = 0; i < inputs.length; i++) {
        var langKey = inputs[i].getAttribute('data-mxadmin-page-text-lang');
        if (langKey) {
            out[langKey] = String(inputs[i].value || '');
        }
    }
    return out;
}

function mxAdminRenderPageFormFields(pageRow, record) {
    record = record || {};
    var langs = mxAdminActiveLangs();
    var nameWrap = mxAdminEl('mxadminPageNameFields');
    var descWrap = mxAdminEl('mxadminPageDescriptionFields');
    var keywordWrap = mxAdminEl('mxadminPageKeywordFields');
    var textWrap = mxAdminEl('mxadminPageTextFields');
    nameWrap.innerHTML = '';
    descWrap.innerHTML = '';
    keywordWrap.innerHTML = '';
    textWrap.innerHTML = '';

    var li;
    for (li = 0; li < langs.length; li++) {
        var lang = langs[li];
        var nameVal =
            pageRow.name && typeof pageRow.name === 'object'
                ? pageRow.name[lang] || ''
                : li === 0
                  ? pageRow.name || ''
                  : '';
        var descVal =
            pageRow.description && typeof pageRow.description === 'object'
                ? pageRow.description[lang] || ''
                : li === 0
                  ? pageRow.description || ''
                  : '';
        var kwFromRow =
            pageRow.keyword && typeof pageRow.keyword === 'object'
                ? pageRow.keyword[lang] || ''
                : '';
        var kwFromRec =
            record.keyword && typeof record.keyword === 'object'
                ? record.keyword[lang] || ''
                : '';
        var keywordVal =
            kwFromRec ||
            kwFromRow ||
            (li === 0 && typeof pageRow.keyword === 'string'
                ? pageRow.keyword
                : '');
        var textFromRec =
            record.text && typeof record.text === 'object'
                ? record.text[lang] || ''
                : '';
        var textFromRow =
            pageRow.text && typeof pageRow.text === 'object'
                ? pageRow.text[lang] || ''
                : li === 0
                  ? pageRow.text || ''
                  : '';
        var detailClosed = mxAdminIsPageDetailClosed();
        var textVal = detailClosed
            ? textFromRow || textFromRec
            : textFromRec || textFromRow;

        var nameGroup = document.createElement('div');
        nameGroup.className = 'mxadmin-form-group';
        nameGroup.innerHTML =
            '<label>' +
            mxAdminEscapeHtml(mxAdminT('fieldName')) +
            ' (' +
            lang.toUpperCase() +
            ')</label>' +
            '<input type="text" data-mxadmin-page-name-lang="' +
            lang +
            '" value="' +
            mxAdminEscapeHtml(nameVal) +
            '" />';
        nameWrap.appendChild(nameGroup);

        var descGroup = document.createElement('div');
        descGroup.className = 'mxadmin-form-group';
        descGroup.innerHTML =
            '<label>' +
            mxAdminEscapeHtml(mxAdminT('fieldDescription')) +
            ' (' +
            lang.toUpperCase() +
            ')</label>' +
            '<textarea data-mxadmin-page-desc-lang="' +
            lang +
            '">' +
            mxAdminEscapeHtml(descVal) +
            '</textarea>';
        descWrap.appendChild(descGroup);

        var kwGroup = document.createElement('div');
        kwGroup.className = 'mxadmin-form-group';
        kwGroup.innerHTML =
            '<label>' +
            mxAdminEscapeHtml(mxAdminT('fieldKeyword')) +
            ' (' +
            lang.toUpperCase() +
            ')</label>' +
            '<input type="text" data-mxadmin-page-keyword-lang="' +
            lang +
            '" value="' +
            mxAdminEscapeHtml(keywordVal) +
            '" />';
        keywordWrap.appendChild(kwGroup);

        var textGroup = document.createElement('div');
        textGroup.className = 'mxadmin-form-group mxadmin-form-group-full';
        textGroup.innerHTML =
            '<label>' +
            mxAdminEscapeHtml(mxAdminT('fieldText')) +
            ' (' +
            lang.toUpperCase() +
            ')</label>';
        textGroup.appendChild(mxAdminCreatePageHtmlEditor(lang, textVal));
        textWrap.appendChild(textGroup);
    }

    mxAdminRenderPageDescFields(pageRow, record);
    mxAdminRenderPageMediaPanel(pageRow);
}

function mxAdminShowPageTab(tabName) {
    mxAdminState.activePageTab = tabName === 'content' ? 'content' : 'general';
    var tabs = document.querySelectorAll('.mxadmin-form-tab');
    var i;
    for (i = 0; i < tabs.length; i++) {
        if (
            tabs[i].getAttribute('data-mxadmin-tab') ===
            mxAdminState.activePageTab
        ) {
            tabs[i].classList.add('is-active');
        } else {
            tabs[i].classList.remove('is-active');
        }
    }
    if (mxAdminState.activePageTab === 'content') {
        mxAdminEl('mxadminPageTabGeneral').classList.add('hidden');
        mxAdminEl('mxadminPageTabContent').classList.remove('hidden');
    } else {
        mxAdminEl('mxadminPageTabGeneral').classList.remove('hidden');
        mxAdminEl('mxadminPageTabContent').classList.add('hidden');
    }
}

function mxAdminHandlePageFormSubmit(evt) {
    evt.preventDefault();
    var pageRow = mxAdminState.activePageRow;
    if (!pageRow) {
        return;
    }

    pageRow.status = mxAdminEl('mxadminPageStatus').value;
    if (typeof pageRow.name !== 'object' || pageRow.name === null) {
        pageRow.name = {};
    }
    if (
        typeof pageRow.description !== 'object' ||
        pageRow.description === null
    ) {
        pageRow.description = {};
    }

    var nameInputs = document.querySelectorAll('[data-mxadmin-page-name-lang]');
    var i;
    for (i = 0; i < nameInputs.length; i++) {
        pageRow.name[
            nameInputs[i].getAttribute('data-mxadmin-page-name-lang')
        ] = nameInputs[i].value;
    }
    var descInputs = document.querySelectorAll('[data-mxadmin-page-desc-lang]');
    for (i = 0; i < descInputs.length; i++) {
        pageRow.description[
            descInputs[i].getAttribute('data-mxadmin-page-desc-lang')
        ] = descInputs[i].value;
    }

    var keywordObj = {};
    var textObj = mxAdminCollectPageTextFromForm();
    var kwInputs = document.querySelectorAll(
        '[data-mxadmin-page-keyword-lang]',
    );
    for (i = 0; i < kwInputs.length; i++) {
        keywordObj[kwInputs[i].getAttribute('data-mxadmin-page-keyword-lang')] =
            kwInputs[i].value;
    }

    var descObj = mxAdminCollectPageDescFromForm();
    var hasDescSchema = mxAdminGetPageDescSchema().length > 0;
    var pageModulestatus = mxAdminGetPageModuleStatus();

    mxAdminApplyPageTextPlacement(
        pageRow,
        null,
        textObj,
        pageModulestatus,
    );
    mxAdminPrunePageListRowInPlace(pageRow, pageModulestatus);

    var idx = mxAdminFindPageRowIndex(pageRow);
    if (
        idx >= 0 &&
        mxAdminState.categoryDoc &&
        Array.isArray(mxAdminState.categoryDoc.data)
    ) {
        mxAdminState.categoryDoc.data[idx] = pageRow;
        mxAdminState.categoryPages = mxAdminState.categoryDoc.data;
    }

    var saveBtn = mxAdminEl('mxadminPageSave');
    saveBtn.disabled = true;
    var catPath = mxAdminState.activeCategoryPath;

    mxAdminApiRequest(
        'PUT',
        '/api/admin/data/' + encodeURIComponent(catPath),
        mxAdminState.categoryDoc,
    )
        .then(function (catResult) {
            if (!pageRow.id) {
                saveBtn.disabled = false;
                mxAdminOnMutationSuccess(catResult);
                mxAdminToast(mxAdminT('saveSuccess'), false);
                mxAdminRenderPagesList();
                return null;
            }
            var record =
                mxAdminState.pageRecord &&
                typeof mxAdminState.pageRecord === 'object'
                    ? mxAdminState.pageRecord
                    : {};
            record.id = pageRow.id;
            record.path = pageRow.path;
            if (typeof record.name !== 'object' || record.name === null) {
                record.name = pageRow.name;
            }
            if (typeof record.keyword !== 'object' || record.keyword === null) {
                record.keyword = {};
            }
            if (typeof record.text !== 'object' || record.text === null) {
                record.text = {};
            }
            if (hasDescSchema) {
                record.desc = descObj;
            }
            mxAdminApplyPageTextPlacement(
                pageRow,
                record,
                textObj,
                pageModulestatus,
            );
            var lk;
            for (lk in keywordObj) {
                if (Object.prototype.hasOwnProperty.call(keywordObj, lk)) {
                    record.keyword[lk] = keywordObj[lk];
                }
            }
            if (pageModulestatus && pageModulestatus.detail !== false) {
                for (lk in textObj) {
                    if (Object.prototype.hasOwnProperty.call(textObj, lk)) {
                        record.text[lk] = textObj[lk];
                    }
                }
            }
            return mxAdminApiRequest(
                'PUT',
                '/api/admin/data/page-record/' + encodeURIComponent(pageRow.id),
                record,
            );
        })
        .then(function (result) {
            if (result === null) {
                return;
            }
            saveBtn.disabled = false;
            mxAdminState.pageRecord =
                mxAdminUnwrapApiData(result) || mxAdminState.pageRecord;
            mxAdminUpdatePageDetailHeader(pageRow);
            mxAdminOnMutationSuccess(result);
            mxAdminToast(mxAdminT('saveSuccess'), false);
            mxAdminRenderPagesList();
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err), true);
        });
}

function mxAdminHandlePageCancel() {
    mxAdminShowPageDetailEmpty();
    mxAdminState.activePageRow = null;
    mxAdminState.pageRecord = null;
    mxAdminState.pageFiles = [];
    var items = mxAdminEl('mxadminPagesList').children;
    var i;
    for (i = 0; i < items.length; i++) {
        items[i].classList.remove('is-active');
    }
}

function mxAdminHandlePagesSearchInput(evt) {
    mxAdminState.pagesSearch = evt.target.value || '';
    mxAdminRenderPagesList();
}



var MX_ADMIN_MODULE_MEDIA_KEYS = [
    'img',
    'bg',
    'img2',
    'image',
    'logo',
    'photo',
];

function mxAdminSetModulesDetailOpen(isOpen) {
    var ws = mxAdminEl('mxadminModulesWorkspace');
    if (!ws) {
        return;
    }
    if (isOpen) {
        ws.classList.add('is-detail-open');
    } else {
        ws.classList.remove('is-detail-open');
    }
}

function mxAdminShowModuleDetailEmpty() {
    mxAdminSetModulesDetailOpen(false);
    mxAdminEl('mxadminModuleDetailEmpty').classList.remove('hidden');
    mxAdminEl('mxadminModuleDetailLoading').classList.add('hidden');
    mxAdminEl('mxadminModuleForm').classList.add('hidden');
}

function mxAdminShowModuleDetailLoading(show) {
    if (show) {
        mxAdminSetModulesDetailOpen(true);
        mxAdminEl('mxadminModuleDetailEmpty').classList.add('hidden');
        mxAdminEl('mxadminModuleDetailLoading').classList.remove('hidden');
        mxAdminEl('mxadminModuleForm').classList.add('hidden');
    } else {
        mxAdminEl('mxadminModuleDetailLoading').classList.add('hidden');
    }
}

function mxAdminShowModuleDetailForm() {
    mxAdminSetModulesDetailOpen(true);
    mxAdminEl('mxadminModuleDetailEmpty').classList.add('hidden');
    mxAdminEl('mxadminModuleDetailLoading').classList.add('hidden');
    mxAdminEl('mxadminModuleForm').classList.remove('hidden');
}

function mxAdminModuleHasMediaSupport(record) {
    if (!record || !Array.isArray(record.data)) {
        return false;
    }
    var i;
    var j;
    for (i = 0; i < record.data.length; i++) {
        var item = record.data[i];
        if (!item || typeof item !== 'object') {
            continue;
        }
        for (j = 0; j < MX_ADMIN_MODULE_MEDIA_KEYS.length; j++) {
            if (
                Object.prototype.hasOwnProperty.call(
                    item,
                    MX_ADMIN_MODULE_MEDIA_KEYS[j],
                )
            ) {
                return true;
            }
        }
    }
    return false;
}

function mxAdminModuleMediaUrl(moduleId, filename) {
    return mxAdminPublicSiteAssetUrl(
        'img/' +
            encodeURIComponent(String(moduleId)) +
            '/' +
            encodeURIComponent(String(filename)),
    );
}

function mxAdminApiUpload(pathSuffix, formData) {
    return new Promise(function (resolve, reject) {
        if (!mxAdminApiConfigured()) {
            reject({ code: 'NOT_CONFIGURED' });
            return;
        }
        var url = mxAdminApiUrl(pathSuffix);
        var request;
        try {
            request = fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
        } catch (syncErr) {
            reject({ code: 'NETWORK' });
            return;
        }
        request
            .then(function (res) {
                res.json()
                    .then(function (data) {
                        if (!res.ok) {
                            reject({
                                code: 'HTTP',
                                status: res.status,
                                data: data,
                            });
                            return;
                        }
                        resolve(data);
                    })
                    .catch(function () {
                        if (!res.ok) {
                            reject({ code: 'HTTP', status: res.status });
                            return;
                        }
                        resolve({});
                    });
            })
            .catch(function () {
                reject({ code: 'NETWORK' });
            });
    });
}

function mxAdminUploadModuleFile(moduleId, file) {
    if (mxAdminIsLocalPreview()) {
        var fd = new FormData();
        fd.append('file', file);
        return mxAdminApiUpload(
            '/api/admin/data/module-upload/' + encodeURIComponent(moduleId),
            fd,
        );
    }
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            var result = String(reader.result || '');
            var base64 =
                result.indexOf(',') !== -1 ? result.split(',')[1] : result;
            mxAdminApiRequest(
                'POST',
                '/api/admin/data/module-upload/' + encodeURIComponent(moduleId),
                {
                    filename: file.name,
                    contentBase64: base64,
                },
            )
                .then(resolve)
                .catch(reject);
        };
        reader.onerror = function () {
            reject({ code: 'NETWORK' });
        };
        reader.readAsDataURL(file);
    });
}

function mxAdminLoadModules() {
    mxAdminState.loaded.modules = true;
    var loading = mxAdminEl('mxadminModulesLoading');
    var workspace = mxAdminEl('mxadminModulesWorkspace');
    var empty = mxAdminEl('mxadminModulesEmpty');
    loading.classList.remove('hidden');
    workspace.classList.add('hidden');
    empty.classList.add('hidden');
    mxAdminShowAlert('mxadminModulesError', '');
    mxAdminShowModuleDetailEmpty();

    mxAdminApiRequest('GET', '/api/admin/data/modules')
        .then(function (resp) {
            loading.classList.add('hidden');
            var doc = mxAdminUnwrapApiData(resp) || {};
            mxAdminState.modulesDoc = doc;
            mxAdminState.modulesList = Array.isArray(doc.data) ? doc.data : [];
            workspace.classList.remove('hidden');
            mxAdminRenderModulesList();
            mxAdminApplyPendingModuleSelection();
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminModulesError',
                mxAdminApiErrorMessage(err, 'modulesLoadError'),
            );
        });
}

function mxAdminGetFilteredModules() {
    var list = mxAdminState.modulesList || [];
    var q = (mxAdminState.modulesSearch || '').toLowerCase().trim();
    if (!q) {
        return list;
    }
    var lang = mxAdminState.lang;
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
        var mod = list[i] || {};
        var name = mxAdminPickLocalized(mod.name, lang).toLowerCase();
        if (!name && typeof mod.name === 'string') {
            name = mod.name.toLowerCase();
        }
        var mid = (mod.id || '').toLowerCase();
        var category = (mod.category || '').toLowerCase();
        var local = (mod.local || '').toLowerCase();
        var pathVal = (mod.path || '').toLowerCase();
        if (
            name.indexOf(q) !== -1 ||
            mid.indexOf(q) !== -1 ||
            category.indexOf(q) !== -1 ||
            local.indexOf(q) !== -1 ||
            pathVal.indexOf(q) !== -1
        ) {
            out.push(mod);
        }
    }
    return out;
}

function mxAdminHandleModulesSearchInput(evt) {
    mxAdminState.modulesSearch = evt.target.value || '';
    mxAdminRenderModulesList();
}

function mxAdminMakeModuleSelectHandler(mod) {
    return function () {
        mxAdminSelectModule(mod);
    };
}

function mxAdminFindModuleIndex(mod) {
    var list = mxAdminState.modulesList || [];
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] && mod && list[i].id === mod.id) {
            return i;
        }
    }
    return -1;
}

function mxAdminRenderModulesList() {
    var listEl = mxAdminEl('mxadminModulesList');
    var empty = mxAdminEl('mxadminModulesEmpty');
    listEl.innerHTML = '';
    var list = mxAdminGetFilteredModules();

    if (!list.length) {
        empty.textContent = mxAdminT('modulesEmpty');
        empty.classList.remove('hidden');
        mxAdminUpdateModulesMeta(0);
        return;
    }
    empty.classList.add('hidden');
    mxAdminUpdateModulesMeta(list.length);

    var lang = mxAdminState.lang;
    var activeId = mxAdminState.activeModuleRow
        ? mxAdminState.activeModuleRow.id
        : '';
    var i;
    for (i = 0; i < list.length; i++) {
        var mod = list[i] || {};
        var nameVal = mxAdminPickLocalized(mod.name, lang);
        if (!nameVal && typeof mod.name === 'string') {
            nameVal = mod.name;
        }
        if (!nameVal) {
            nameVal = mod.path || '—';
        }
        var li = document.createElement('li');
        if (mod.id && mod.id === activeId) {
            li.className = 'is-active';
        }
        li.onclick = mxAdminMakeModuleSelectHandler(mod);
        li.innerHTML =
            '<div class="mxadmin-pages-list-item">' +
            '<div class="mxadmin-pages-list-text">' +
            '<div class="mxadmin-pages-list-title-row">' +
            '<span class="mxadmin-pages-list-title">' +
            mxAdminEscapeHtml(nameVal) +
            '</span>' +
            '</div>' +
            '<div class="mxadmin-pages-list-meta">' +
            '<code class="mxadmin-module-id-pill">' +
            mxAdminEscapeHtml(mod.id || '—') +
            '</code>' +
            '<span> · ' +
            mxAdminEscapeHtml(mod.local || '—') +
            ' / ' +
            mxAdminEscapeHtml(mod.path || '—') +
            '</span>' +
            '</div></div>' +
            '<span class="material-symbols-outlined mxadmin-pages-list-chevron">chevron_right</span>' +
            '</div>';
        listEl.appendChild(li);
    }
}

function mxAdminSelectModule(mod) {
    if (!mod || !mod.id) {
        return;
    }
    mxAdminState.activeModuleRow = mod;
    mxAdminState.activeModuleIndex = mxAdminFindModuleIndex(mod);
    mxAdminRenderModulesList();
    mxAdminShowModuleDetailLoading(true);

    var titleEl = mxAdminEl('mxadminModuleDetailTitle');
    var metaEl = mxAdminEl('mxadminModuleDetailMeta');
    var catEl = mxAdminEl('mxadminModuleDetailCategory');
    var lang = mxAdminState.lang;
    var nameVal = mxAdminPickLocalized(mod.name, lang);
    if (!nameVal && typeof mod.name === 'string') {
        nameVal = mod.name;
    }
    titleEl.textContent = nameVal || mod.path || '—';
    metaEl.textContent =
        (mod.local || '—') +
        ' / ' +
        (mod.path || '—') +
        ' · ' +
        (mod.id || '—');
    catEl.textContent = mod.category || '—';

    var activeWrap = mxAdminEl('mxadminModuleActiveWrap');
    if (mod.active !== undefined || mod.status !== undefined) {
        activeWrap.classList.remove('hidden');
        var isActive = mod.active !== false && mod.status !== 'pause';
        mxAdminEl('mxadminModuleActive').value = isActive ? 'play' : 'pause';
    } else {
        activeWrap.classList.add('hidden');
    }

    mxAdminEl('mxadminModuleName').value =
        typeof mod.name === 'string'
            ? mod.name
            : mxAdminPickLocalized(mod.name, lang);

    mxAdminApiRequest(
        'GET',
        '/api/admin/data/module-record/' + encodeURIComponent(mod.id),
    )
        .then(function (resp) {
            var record = mxAdminUnwrapApiData(resp) || {};
            if (!record.data && mod.data) {
                record.data = mod.data;
            }
            if (!record.desing && mod.desing) {
                record.desing = mod.desing;
            }
            if (!record.name && mod.name) {
                record.name = mod.name;
            }
            if (!record.category && mod.category) {
                record.category = mod.category;
            }
            mxAdminState.moduleRecord = record;
            mxAdminState.moduleSupportsMedia =
                mxAdminModuleHasMediaSupport(record);
            mxAdminRenderModuleEditor();
            mxAdminLoadModuleFiles();
            mxAdminShowModuleDetailForm();
            mxAdminShowModuleTab('general');
        })
        .catch(function () {
            mxAdminState.moduleRecord = {
                name: mod.name,
                data: mod.data || [],
                desing: mod.desing || {},
                category: mod.category,
                version: mod.version,
                icon: mod.icon,
            };
            mxAdminState.moduleSupportsMedia = mxAdminModuleHasMediaSupport(
                mxAdminState.moduleRecord,
            );
            mxAdminRenderModuleEditor();
            mxAdminLoadModuleFiles();
            mxAdminShowModuleDetailForm();
            mxAdminShowModuleTab('general');
        });
}

function mxAdminShowModuleTab(tabName) {
    var tab =
        tabName === 'content'
            ? 'content'
            : tabName === 'media'
              ? 'media'
              : 'general';
    if (tab === 'media' && !mxAdminState.moduleSupportsMedia) {
        tab = 'general';
    }
    mxAdminState.activeModuleTab = tab;
    var tabs = document.querySelectorAll('[data-mxadmin-module-tab]');
    var i;
    for (i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute('data-mxadmin-module-tab') === tab) {
            tabs[i].classList.add('is-active');
        } else {
            tabs[i].classList.remove('is-active');
        }
    }
    mxAdminEl('mxadminModuleTabGeneral').classList.toggle(
        'hidden',
        tab !== 'general',
    );
    mxAdminEl('mxadminModuleTabContent').classList.toggle(
        'hidden',
        tab !== 'content',
    );
    mxAdminEl('mxadminModuleTabMedia').classList.toggle(
        'hidden',
        tab !== 'media',
    );
    var mediaTabBtn = document.querySelector(
        '[data-mxadmin-module-tab="media"]',
    );
    if (mediaTabBtn) {
        if (mxAdminState.moduleSupportsMedia) {
            mediaTabBtn.classList.remove('hidden');
        } else {
            mediaTabBtn.classList.add('hidden');
        }
    }
}

function mxAdminIsHexColor(value) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(value || ''));
}

function mxAdminIsI18nObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    return (
        Object.prototype.hasOwnProperty.call(value, 'tr') ||
        Object.prototype.hasOwnProperty.call(value, 'en')
    );
}

function mxAdminRenderModuleDesingFields() {
    var wrap = mxAdminEl('mxadminModuleDesingFields');
    wrap.innerHTML = '';
    var record = mxAdminState.moduleRecord || {};
    var desing = record.desing || {};
    var keys = Object.keys(desing);
    if (!keys.length) {
        return;
    }
    var langs = mxAdminActiveLangs();
    var ki;
    for (ki = 0; ki < keys.length; ki++) {
        var key = keys[ki];
        var val = desing[key];
        if (mxAdminIsI18nObject(val)) {
            var li;
            for (li = 0; li < langs.length; li++) {
                var lang = langs[li];
                var group = document.createElement('div');
                group.className = 'mxadmin-form-group';
                group.innerHTML =
                    '<label>' +
                    mxAdminEscapeHtml(key) +
                    ' (' +
                    lang.toUpperCase() +
                    ')</label>' +
                    '<input type="text" data-mxadmin-module-desing-key="' +
                    mxAdminEscapeHtml(key) +
                    '" data-mxadmin-module-desing-lang="' +
                    lang +
                    '" value="' +
                    mxAdminEscapeHtml(val[lang] || '') +
                    '" />';
                wrap.appendChild(group);
            }
        } else if (mxAdminIsHexColor(val)) {
            var colorGroup = document.createElement('div');
            colorGroup.className = 'mxadmin-form-group';
            colorGroup.innerHTML =
                '<label>' +
                mxAdminEscapeHtml(key) +
                '</label>' +
                '<div class="mxadmin-color-row">' +
                '<input type="color" value="' +
                mxAdminEscapeHtml(val) +
                '" data-mxadmin-module-desing-color="' +
                mxAdminEscapeHtml(key) +
                '" />' +
                '<input type="text" class="mxadmin-color-hex" value="' +
                mxAdminEscapeHtml(val) +
                '" data-mxadmin-module-desing-key="' +
                mxAdminEscapeHtml(key) +
                '" />' +
                '</div>';
            wrap.appendChild(colorGroup);
        } else if (typeof val === 'number') {
            var numGroup = document.createElement('div');
            numGroup.className = 'mxadmin-form-group';
            numGroup.innerHTML =
                '<label>' +
                mxAdminEscapeHtml(key) +
                '</label>' +
                '<input type="number" data-mxadmin-module-desing-key="' +
                mxAdminEscapeHtml(key) +
                '" value="' +
                mxAdminEscapeHtml(String(val)) +
                '" />';
            wrap.appendChild(numGroup);
        } else if (typeof val === 'string' || typeof val === 'boolean') {
            var textGroup = document.createElement('div');
            textGroup.className = 'mxadmin-form-group';
            textGroup.innerHTML =
                '<label>' +
                mxAdminEscapeHtml(key) +
                '</label>' +
                '<input type="text" data-mxadmin-module-desing-key="' +
                mxAdminEscapeHtml(key) +
                '" value="' +
                mxAdminEscapeHtml(String(val)) +
                '" />';
            wrap.appendChild(textGroup);
        }
    }
}

function mxAdminCollectModuleDataTemplate(dataArr) {
    var template = {};
    var i;
    var j;
    for (i = 0; i < dataArr.length; i++) {
        var item = dataArr[i];
        if (!item || typeof item !== 'object') {
            continue;
        }
        var keys = Object.keys(item);
        for (j = 0; j < keys.length; j++) {
            var k = keys[j];
            if (typeof template[k] === 'undefined') {
                template[k] = '';
            }
        }
    }
    return template;
}

function mxAdminIsMediaFieldKey(key) {
    var i;
    for (i = 0; i < MX_ADMIN_MODULE_MEDIA_KEYS.length; i++) {
        if (MX_ADMIN_MODULE_MEDIA_KEYS[i] === key) {
            return true;
        }
    }
    return false;
}

function mxAdminBuildModuleFieldInput(key, value, rowIndex, files) {
    files = files || [];
    if (mxAdminIsMediaFieldKey(key)) {
        var opts = '<option value="">—</option>';
        var fi;
        for (fi = 0; fi < files.length; fi++) {
            var fname = files[fi];
            var selected = fname === value ? ' selected="selected"' : '';
            opts +=
                '<option value="' +
                mxAdminEscapeHtml(fname) +
                '"' +
                selected +
                '>' +
                mxAdminEscapeHtml(fname) +
                '</option>';
        }
        return (
            '<div class="mxadmin-form-group"><label>' +
            mxAdminEscapeHtml(key) +
            '</label>' +
            '<select class="mxadmin-select mxadmin-module-field-select" data-mxadmin-module-data-index="' +
            rowIndex +
            '" data-mxadmin-module-data-key="' +
            mxAdminEscapeHtml(key) +
            '">' +
            opts +
            '</select>' +
            '<input type="text" data-mxadmin-module-data-index="' +
            rowIndex +
            '" data-mxadmin-module-data-key="' +
            mxAdminEscapeHtml(key) +
            '-text" value="' +
            mxAdminEscapeHtml(value || '') +
            '" placeholder="' +
            mxAdminEscapeHtml(key) +
            '" /></div>'
        );
    }
    if (mxAdminIsI18nObject(value)) {
        var langs = mxAdminActiveLangs();
        var html = '';
        var li;
        for (li = 0; li < langs.length; li++) {
            var lang = langs[li];
            html +=
                '<div class="mxadmin-form-group"><label>' +
                mxAdminEscapeHtml(key) +
                ' (' +
                lang.toUpperCase() +
                ')</label>' +
                '<input type="text" data-mxadmin-module-data-index="' +
                rowIndex +
                '" data-mxadmin-module-data-key="' +
                mxAdminEscapeHtml(key) +
                '" data-mxadmin-module-data-lang="' +
                lang +
                '" value="' +
                mxAdminEscapeHtml(value[lang] || '') +
                '" /></div>';
        }
        return html;
    }
    if (typeof value === 'number') {
        return (
            '<div class="mxadmin-form-group"><label>' +
            mxAdminEscapeHtml(key) +
            '</label>' +
            '<input type="number" data-mxadmin-module-data-index="' +
            rowIndex +
            '" data-mxadmin-module-data-key="' +
            mxAdminEscapeHtml(key) +
            '" value="' +
            mxAdminEscapeHtml(String(value)) +
            '" /></div>'
        );
    }
    return (
        '<div class="mxadmin-form-group"><label>' +
        mxAdminEscapeHtml(key) +
        '</label>' +
        '<input type="text" data-mxadmin-module-data-index="' +
        rowIndex +
        '" data-mxadmin-module-data-key="' +
        mxAdminEscapeHtml(key) +
        '" value="' +
        mxAdminEscapeHtml(value == null ? '' : String(value)) +
        '" /></div>'
    );
}

function mxAdminRenderModuleDataFields() {
    var wrap = mxAdminEl('mxadminModuleDataFields');
    var emptyEl = mxAdminEl('mxadminModuleDataEmpty');
    var addBtn = mxAdminEl('mxadminModuleDataAdd');
    var metaEl = mxAdminEl('mxadminModuleDataMeta');
    wrap.innerHTML = '';
    var record = mxAdminState.moduleRecord || {};
    var dataArr = Array.isArray(record.data) ? record.data : null;

    if (!dataArr) {
        emptyEl.textContent = mxAdminT('moduleDataEmpty');
        emptyEl.classList.remove('hidden');
        addBtn.classList.add('hidden');
        metaEl.textContent = '0';
        return;
    }

    emptyEl.classList.add('hidden');
    addBtn.classList.remove('hidden');
    metaEl.textContent =
        String(dataArr.length) + ' ' + mxAdminT('moduleDataRow');
    mxAdminState.moduleDataTemplate = mxAdminCollectModuleDataTemplate(dataArr);

    var files = mxAdminState.moduleFiles || [];
    var i;
    for (i = 0; i < dataArr.length; i++) {
        var item = dataArr[i] || {};
        var keys = Object.keys(mxAdminState.moduleDataTemplate);
        var card = document.createElement('div');
        card.className = 'mxadmin-module-data-card';
        card.setAttribute('data-mxadmin-module-data-card', String(i));
        var bodyHtml = '';
        var ki;
        for (ki = 0; ki < keys.length; ki++) {
            bodyHtml += mxAdminBuildModuleFieldInput(
                keys[ki],
                item[keys[ki]],
                i,
                files,
            );
        }
        card.innerHTML =
            '<div class="mxadmin-module-data-card-head">' +
            '<span class="mxadmin-module-data-card-title">' +
            mxAdminEscapeHtml(mxAdminT('moduleDataRow')) +
            ' ' +
            String(i + 1) +
            '</span>' +
            '<button type="button" class="mxadmin-btn-ghost mxadmin-btn-sm" data-mxadmin-module-data-remove="' +
            i +
            '">' +
            mxAdminEscapeHtml(mxAdminT('moduleDataRemove')) +
            '</button>' +
            '</div><div class="mxadmin-module-data-card-body">' +
            bodyHtml +
            '</div>';
        wrap.appendChild(card);
    }

    var removeBtns = wrap.querySelectorAll('[data-mxadmin-module-data-remove]');
    var ri;
    for (ri = 0; ri < removeBtns.length; ri++) {
        removeBtns[ri].onclick = mxAdminMakeModuleDataRemoveHandler(
            parseInt(
                removeBtns[ri].getAttribute('data-mxadmin-module-data-remove'),
                10,
            ),
        );
    }
}

function mxAdminMakeModuleDataRemoveHandler(index) {
    return function () {
        Global_confirmDelete(mxAdminT('moduleDataRemove') + '?').then(
            function (ok) {
                if (!ok) {
                    return;
                }
                var record = mxAdminState.moduleRecord || {};
                if (!Array.isArray(record.data)) {
                    return;
                }
                record.data.splice(index, 1);
                mxAdminRenderModuleDataFields();
            },
        );
    };
}

function mxAdminHandleModuleDataAdd() {
    var record = mxAdminState.moduleRecord || {};
    if (!Array.isArray(record.data)) {
        record.data = [];
    }
    var template = mxAdminState.moduleDataTemplate || {};
    var keys = Object.keys(template);
    var row = {};
    var i;
    for (i = 0; i < keys.length; i++) {
        row[keys[i]] = '';
    }
    if (!keys.length) {
        row = { img: '' };
    }
    record.data.push(row);
    mxAdminRenderModuleDataFields();
}

function mxAdminRenderModuleEditor() {
    mxAdminRenderModuleDesingFields();
    mxAdminRenderModuleDataFields();
    mxAdminShowModuleTab(mxAdminState.activeModuleTab || 'general');
}

function mxAdminLoadModuleFiles() {
    var mod = mxAdminState.activeModuleRow;
    if (!mod || !mod.id || !mxAdminState.moduleSupportsMedia) {
        mxAdminState.moduleFiles = [];
        mxAdminRenderModuleMediaGrid();
        return;
    }
    mxAdminApiRequest(
        'GET',
        '/api/admin/data/module-files/' + encodeURIComponent(mod.id),
    )
        .then(function (resp) {
            mxAdminState.moduleFiles =
                resp && Array.isArray(resp.files) ? resp.files : [];
            mxAdminRenderModuleMediaGrid();
            mxAdminRenderModuleDataFields();
        })
        .catch(function () {
            mxAdminState.moduleFiles = [];
            mxAdminRenderModuleMediaGrid();
        });
}

function mxAdminRenderModuleMediaGrid() {
    var grid = mxAdminEl('mxadminModuleMediaGrid');
    var meta = mxAdminEl('mxadminModuleMediaMeta');
    var mod = mxAdminState.activeModuleRow;
    grid.innerHTML = '';
    if (!mod || !mod.id) {
        meta.textContent = '0';
        return;
    }
    var files = mxAdminState.moduleFiles || [];
    meta.textContent = String(files.length);
    var i;
    for (i = 0; i < files.length; i++) {
        var fname = files[i];
        var card = document.createElement('div');
        card.className = 'mxadmin-module-media-card';
        card.setAttribute('data-mxadmin-module-media-file', fname);
        card.innerHTML =
            '<img class="mxadmin-module-media-thumb" src="' +
            mxAdminEscapeHtml(mxAdminModuleMediaUrl(mod.id, fname)) +
            '" alt="" loading="lazy" onerror="this.style.display=\'none\'" />' +
            '<button type="button" class="mxadmin-module-media-delete" data-mxadmin-module-media-delete="' +
            mxAdminEscapeHtml(fname) +
            '" title="' +
            mxAdminEscapeHtml(mxAdminT('moduleDataRemove')) +
            '">' +
            '<span class="material-symbols-outlined" style="font-size:16px;">delete</span></button>' +
            '<div class="mxadmin-module-media-name">' +
            mxAdminEscapeHtml(fname) +
            '</div>';
        grid.appendChild(card);
    }
    var uploadCard = document.createElement('div');
    uploadCard.className = 'mxadmin-module-media-upload-card';
    uploadCard.innerHTML =
        '<span class="material-symbols-outlined">add_photo_alternate</span>' +
        '<span>' +
        mxAdminEscapeHtml(mxAdminT('moduleMediaUpload')) +
        '</span>';
    uploadCard.onclick = function () {
        mxAdminEl('mxadminModuleMediaInput').click();
    };
    grid.appendChild(uploadCard);

    var delBtns = grid.querySelectorAll('[data-mxadmin-module-media-delete]');
    var di;
    for (di = 0; di < delBtns.length; di++) {
        delBtns[di].onclick = mxAdminMakeModuleMediaDeleteHandler(
            delBtns[di].getAttribute('data-mxadmin-module-media-delete'),
        );
    }
}

function mxAdminMakeModuleMediaDeleteHandler(filename) {
    return function () {
        var mod = mxAdminState.activeModuleRow;
        if (!mod || !mod.id || !filename) {
            return;
        }
        Global_confirmDelete(filename).then(function (ok) {
            if (!ok) {
                return;
            }
            mxAdminApiRequest(
                'DELETE',
                '/api/admin/data/module-file/' +
                    encodeURIComponent(mod.id) +
                    '/' +
                    encodeURIComponent(filename),
            )
                .then(function () {
                    mxAdminToast(mxAdminT('moduleMediaDeleteSuccess'), false);
                    mxAdminLoadModuleFiles();
                })
                .catch(function (err) {
                    mxAdminToast(
                        mxAdminApiErrorMessage(err, 'moduleMediaUploadError'),
                        true,
                    );
                });
        });
    };
}

function mxAdminHandleModuleMediaUploadInput(evt) {
    var mod = mxAdminState.activeModuleRow;
    var files = evt.target.files;
    if (!mod || !mod.id || !files || !files.length) {
        return;
    }
    var total = files.length;
    var done = 0;
    var okCount = 0;
    var fi;
    function onDone() {
        done += 1;
        if (done >= total) {
            evt.target.value = '';
            mxAdminLoadModuleFiles();
            if (okCount > 0) {
                mxAdminToast(mxAdminT('moduleMediaUploadSuccess'), false);
            } else {
                mxAdminToast(mxAdminT('moduleMediaUploadError'), true);
            }
        }
    }
    for (fi = 0; fi < files.length; fi++) {
        mxAdminUploadModuleFile(mod.id, files[fi])
            .then(function () {
                okCount += 1;
                onDone();
            })
            .catch(function () {
                onDone();
            });
    }
}

function mxAdminCollectModuleFormValues() {
    var record = mxAdminState.moduleRecord || {};
    var mod = mxAdminState.activeModuleRow || {};
    var nameInput = mxAdminEl('mxadminModuleName');
    if (nameInput) {
        record.name = nameInput.value;
        mod.name = nameInput.value;
    }
    if (mod.active !== undefined || mod.status !== undefined) {
        var activeVal = mxAdminEl('mxadminModuleActive').value === 'play';
        mod.active = activeVal;
        mod.status = activeVal ? 'play' : 'pause';
    }
    if (!record.desing || typeof record.desing !== 'object') {
        record.desing = {};
    }
    var desingInputs = document.querySelectorAll(
        '[data-mxadmin-module-desing-key]',
    );
    var i;
    for (i = 0; i < desingInputs.length; i++) {
        var inp = desingInputs[i];
        var dKey = inp.getAttribute('data-mxadmin-module-desing-key');
        var dLang = inp.getAttribute('data-mxadmin-module-desing-lang');
        if (!dKey) {
            continue;
        }
        if (dLang) {
            if (!mxAdminIsI18nObject(record.desing[dKey])) {
                record.desing[dKey] = {};
            }
            record.desing[dKey][dLang] = inp.value;
        } else {
            var raw = inp.value;
            if (
                /^-?\d+(\.\d+)?$/.test(String(raw).trim()) &&
                inp.type === 'number'
            ) {
                record.desing[dKey] = parseFloat(raw);
            } else {
                record.desing[dKey] = raw;
            }
        }
    }
    mod.desing = record.desing;

    if (Array.isArray(record.data)) {
        var dataInputs = document.querySelectorAll(
            '[data-mxadmin-module-data-key]',
        );
        for (i = 0; i < dataInputs.length; i++) {
            var dInp = dataInputs[i];
            var keyAttr = dInp.getAttribute('data-mxadmin-module-data-key');
            if (!keyAttr || keyAttr.indexOf('-text') !== -1) {
                continue;
            }
            var rowIndex = parseInt(
                dInp.getAttribute('data-mxadmin-module-data-index'),
                10,
            );
            var dataKey = keyAttr;
            var dataLang = dInp.getAttribute('data-mxadmin-module-data-lang');
            if (isNaN(rowIndex) || !record.data[rowIndex]) {
                continue;
            }
            var val = dInp.value;
            if (dataLang) {
                if (!mxAdminIsI18nObject(record.data[rowIndex][dataKey])) {
                    record.data[rowIndex][dataKey] = {};
                }
                record.data[rowIndex][dataKey][dataLang] = val;
            } else if (
                dInp.tagName &&
                String(dInp.tagName).toLowerCase() === 'select'
            ) {
                record.data[rowIndex][dataKey] = val;
            } else if (
                dInp.type === 'number' &&
                /^-?\d+(\.\d+)?$/.test(String(val).trim())
            ) {
                record.data[rowIndex][dataKey] = parseFloat(val);
            } else {
                record.data[rowIndex][dataKey] = val;
            }
        }
        var textOverrides = document.querySelectorAll(
            '[data-mxadmin-module-data-key$="-text"]',
        );
        for (i = 0; i < textOverrides.length; i++) {
            var tInp = textOverrides[i];
            var tKey = String(
                tInp.getAttribute('data-mxadmin-module-data-key'),
            ).replace(/-text$/, '');
            var tIndex = parseInt(
                tInp.getAttribute('data-mxadmin-module-data-index'),
                10,
            );
            if (tInp.value && !isNaN(tIndex) && record.data[tIndex]) {
                record.data[tIndex][tKey] = tInp.value;
            }
        }
        mod.data = record.data;
    }
    mxAdminState.moduleRecord = record;
    mxAdminState.activeModuleRow = mod;
}

function mxAdminHandleModuleFormSubmit(evt) {
    evt.preventDefault();
    var mod = mxAdminState.activeModuleRow;
    if (!mod || !mod.id) {
        return;
    }
    mxAdminCollectModuleFormValues();
    var record = mxAdminState.moduleRecord || {};
    var saveBtn = mxAdminEl('mxadminModuleSave');
    saveBtn.disabled = true;

    var modulesDoc = mxAdminState.modulesDoc || {
        data: mxAdminState.modulesList || [],
    };
    if (!Array.isArray(modulesDoc.data)) {
        modulesDoc.data = mxAdminState.modulesList || [];
    }
    if (mxAdminState.activeModuleIndex >= 0) {
        modulesDoc.data[mxAdminState.activeModuleIndex] = mod;
    }

    mxAdminApiRequest(
        'PUT',
        '/api/admin/data/module-record/' + encodeURIComponent(mod.id),
        record,
    )
        .then(function () {
            return mxAdminApiRequest(
                'PUT',
                '/api/admin/data/modules',
                modulesDoc,
            );
        })
        .then(function (result) {
            saveBtn.disabled = false;
            mxAdminState.modulesList = modulesDoc.data;
            mxAdminState.modulesDoc = modulesDoc;
            mxAdminRenderModulesList();
            mxAdminOnMutationSuccess(result);
            mxAdminToast(mxAdminT('saveSuccess'), false);
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err, 'modulesSaveError'), true);
        });
}

function mxAdminHandleModuleCancel() {
    mxAdminState.activeModuleRow = null;
    mxAdminState.activeModuleIndex = -1;
    mxAdminState.moduleRecord = null;
    mxAdminState.moduleFiles = [];
    mxAdminShowModuleDetailEmpty();
    mxAdminRenderModulesList();
}

function mxAdminMakeModuleTabHandler(tabName) {
    return function () {
        mxAdminShowModuleTab(tabName);
    };
}

function mxAdminFindModuleById(moduleId) {
    var list = mxAdminState.modulesList || [];
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].id === moduleId) {
            return list[i];
        }
    }
    return null;
}

function mxAdminGetModuleDisplayName(mod) {
    if (!mod) {
        return '—';
    }
    var lang = mxAdminState.lang;
    var nameVal = mxAdminPickLocalized(mod.name, lang);
    if (!nameVal && typeof mod.name === 'string') {
        nameVal = mod.name;
    }
    if (!nameVal) {
        nameVal = mod.path || mod.id || '—';
    }
    return nameVal;
}

function mxAdminApplyPendingModuleSelection() {
    var pendingId = mxAdminState.pendingModuleId;
    if (!pendingId) {
        return;
    }
    mxAdminState.pendingModuleId = '';
    var mod = mxAdminFindModuleById(pendingId);
    if (mod) {
        mxAdminSelectModule(mod);
    }
}

function mxAdminOpenModuleEditor(moduleId) {
    if (!moduleId) {
        return;
    }
    mxAdminState.pendingModuleId = moduleId;
    if (
        mxAdminState.loaded.modules &&
        mxAdminState.modulesList &&
        mxAdminState.modulesList.length
    ) {
        var mod = mxAdminFindModuleById(moduleId);
        if (!mod) {
            mxAdminToast(mxAdminT('moduleNotFound'), true);
            mxAdminState.pendingModuleId = '';
            return;
        }
    }
    mxAdminShowScreen('modules');
}

function mxAdminMakeLayoutModuleOpenHandler(moduleId) {
    return function () {
        mxAdminOpenModuleEditor(moduleId);
    };
}

function mxAdminEnsureModulesListForDesign() {
    return new Promise(function (resolve) {
        if (mxAdminState.modulesList && mxAdminState.modulesList.length) {
            resolve(mxAdminState.modulesList);
            return;
        }
        mxAdminApiRequest('GET', '/api/admin/data/modules')
            .then(function (resp) {
                var doc = mxAdminUnwrapApiData(resp) || {};
                mxAdminState.modulesDoc = doc;
                mxAdminState.modulesList = Array.isArray(doc.data)
                    ? doc.data
                    : [];
                resolve(mxAdminState.modulesList);
            })
            .catch(function () {
                resolve([]);
            });
    });
}



function mxAdminLoadSettings() {
    mxAdminState.loaded.settings = true;
    var loading = mxAdminEl('mxadminSettingsLoading');
    var form = mxAdminEl('mxadminSettingsForm');
    loading.classList.remove('hidden');
    form.classList.add('hidden');
    mxAdminShowAlert('mxadminSettingsError', '');

    mxAdminApiRequest('GET', '/api/admin/data/setting')
        .then(function (resp) {
            loading.classList.add('hidden');
            mxAdminState.settingData = mxAdminUnwrapApiData(resp) || {};
            mxAdminRenderSettingsForm(mxAdminState.settingData);
            form.classList.remove('hidden');
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminSettingsError',
                mxAdminApiErrorMessage(err, 'settingsLoadError'),
            );
        });
}

function mxAdminIsAllowedLogoFilename(name) {
    return /\.(png|jpe?g|webp|svg|gif)$/i.test(String(name || ''));
}

function mxAdminResolveSettingLogoFilename(file) {
    var setting = mxAdminState.settingData || {};
    var existing = mxAdminSiteLogoFile(setting);
    if (existing) {
        return existing;
    }
    var name = String((file && file.name) || 'logo.png').replace(/^.*[\\/]/, '');
    name = name.replace(/[^a-zA-Z0-9._\-]/g, '_');
    if (!name || name === '.' || name === '..') {
        name = 'logo.png';
    }
    if (!mxAdminIsAllowedLogoFilename(name)) {
        name = 'logo.png';
    }
    return name;
}

function mxAdminUploadSettingLogo(file) {
    var targetName = mxAdminResolveSettingLogoFilename(file);
    if (!mxAdminIsAllowedLogoFilename(targetName)) {
        return Promise.reject({ code: 'VALIDATION' });
    }
    if (mxAdminIsLocalPreview()) {
        var fd = new FormData();
        fd.append('file', file);
        return mxAdminApiUpload('/api/admin/data/setting-logo-upload', fd);
    }
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            var result = String(reader.result || '');
            var base64 =
                result.indexOf(',') !== -1 ? result.split(',')[1] : result;
            mxAdminApiRequest('POST', '/api/admin/data/setting-logo-upload', {
                filename: targetName,
                contentBase64: base64,
            })
                .then(resolve)
                .catch(reject);
        };
        reader.onerror = function () {
            reject({ code: 'NETWORK' });
        };
        reader.readAsDataURL(file);
    });
}

function mxAdminUpdateSettingLogoPreview(setting) {
    var logoWrap = mxAdminEl('mxadminSettingLogoPreview');
    var logoImg = mxAdminEl('mxadminSettingLogoImg');
    var logoEmpty = mxAdminEl('mxadminSettingLogoEmptyIcon');
    var logoNameEl = mxAdminEl('mxadminSettingLogoName');
    var logoFile = mxAdminSiteLogoFile(setting);
    var logoUrl = mxAdminSiteLogoUrl(logoFile);
    if (!logoWrap || !logoImg) {
        return;
    }
    logoWrap.classList.remove('hidden');
    if (logoFile && logoUrl) {
        logoImg.src = logoUrl + '?t=' + String(Date.now());
        logoImg.alt = mxAdminT('fieldLogo');
        logoImg.classList.remove('hidden');
        if (logoEmpty) {
            logoEmpty.classList.add('hidden');
        }
        if (logoNameEl) {
            logoNameEl.textContent = logoFile;
        }
        logoImg.onerror = function () {
            logoImg.classList.add('hidden');
            logoImg.src = '';
            logoImg.onerror = null;
            if (logoEmpty) {
                logoEmpty.classList.remove('hidden');
            }
        };
        return;
    }
    logoImg.classList.add('hidden');
    logoImg.src = '';
    logoImg.onerror = null;
    if (logoEmpty) {
        logoEmpty.classList.remove('hidden');
    }
    if (logoNameEl) {
        logoNameEl.textContent = mxAdminT('logoEmpty');
    }
}

function mxAdminHandleSettingLogoUploadInput(evt) {
    var files = evt.target.files;
    var file = files && files.length ? files[0] : null;
    if (!file) {
        return;
    }
    var targetName = mxAdminResolveSettingLogoFilename(file);
    if (!mxAdminIsAllowedLogoFilename(targetName)) {
        mxAdminToast(mxAdminT('logoUploadInvalid'), true);
        evt.target.value = '';
        return;
    }
    var btn = mxAdminEl('mxadminSettingLogoUploadBtn');
    mxAdminSetListRefreshBusy(btn, true);
    mxAdminUploadSettingLogo(file)
        .then(function (data) {
            var logoName =
                (data && (data.logo || data.filename)) || targetName;
            if (!mxAdminState.settingData) {
                mxAdminState.settingData = {};
            }
            mxAdminState.settingData.logo = logoName;
            mxAdminUpdateSettingLogoPreview(mxAdminState.settingData);
            mxAdminApplySiteLogo(mxAdminState.settingData);
            mxAdminOnMutationSuccess(data);
            mxAdminToast(mxAdminT('logoUploadSuccess'), false);
        })
        .catch(function (err) {
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            if (err && err.code === 'VALIDATION') {
                mxAdminToast(mxAdminT('logoUploadInvalid'), true);
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err, 'logoUploadError'), true);
        })
        .then(function () {
            evt.target.value = '';
            mxAdminSetListRefreshBusy(btn, false);
        });
}

function mxAdminRenderSettingsForm(setting) {
    mxAdminEl('mxadminSettingName').value = mxAdminSettingScalarToInput(setting.name);
    mxAdminEl('mxadminSettingDomain').value = mxAdminSettingScalarToInput(
        setting.domain,
    );
    mxAdminEl('mxadminSettingPhone').value = setting.phone || '';
    mxAdminEl('mxadminSettingMobile').value = setting.mobile || '';
    mxAdminEl('mxadminSettingEmail').value = setting.email || '';
    mxAdminEl('mxadminSettingPerson').value = setting.person || '';
    mxAdminEl('mxadminSettingTitle').value = setting.title || '';
    mxAdminEl('mxadminSettingAddress').value = setting.address || '';

    mxAdminUpdateSettingLogoPreview(setting);
    mxAdminApplySiteLogo(setting);

    var langs = mxAdminActiveLangs();
    var descWrap = mxAdminEl('mxadminSettingDescriptionFields');
    var keywordWrap = mxAdminEl('mxadminSettingKeywordFields');
    descWrap.innerHTML = '';
    keywordWrap.innerHTML = '';

    var i;
    for (i = 0; i < langs.length; i++) {
        var lang = langs[i];
        var descVal =
            setting.description && typeof setting.description === 'object'
                ? setting.description[lang] || ''
                : '';
        var keywordVal =
            setting.keyword && typeof setting.keyword === 'object'
                ? setting.keyword[lang] || ''
                : '';

        var descGroup = document.createElement('div');
        descGroup.className = 'mxadmin-form-group';
        descGroup.innerHTML =
            '<label>' +
            mxAdminEscapeHtml(mxAdminT('fieldDescription')) +
            ' (' +
            lang.toUpperCase() +
            ')</label>' +
            '<textarea data-mxadmin-setting-desc-lang="' +
            lang +
            '">' +
            mxAdminEscapeHtml(descVal) +
            '</textarea>';
        descWrap.appendChild(descGroup);

        var keywordGroup = document.createElement('div');
        keywordGroup.className = 'mxadmin-form-group';
        keywordGroup.innerHTML =
            '<label>' +
            mxAdminEscapeHtml(mxAdminT('fieldKeyword')) +
            ' (' +
            lang.toUpperCase() +
            ')</label>' +
            '<input type="text" data-mxadmin-setting-keyword-lang="' +
            lang +
            '" value="' +
            mxAdminEscapeHtml(keywordVal) +
            '" />';
        keywordWrap.appendChild(keywordGroup);
    }
}

function mxAdminHandleSettingsFormSubmit(evt) {
    evt.preventDefault();
    var setting = mxAdminState.settingData || {};
    var nameInput = mxAdminEl('mxadminSettingName').value;
    var domainInput = mxAdminEl('mxadminSettingDomain').value;
    if (
        setting.name != null &&
        typeof setting.name === 'object' &&
        !Array.isArray(setting.name)
    ) {
        var nameLangs = mxAdminActiveLangs();
        var nameOut = {};
        var ni;
        for (ni = 0; ni < nameLangs.length; ni++) {
            nameOut[nameLangs[ni]] = nameInput;
        }
        setting.name = nameOut;
    } else {
        setting.name = nameInput;
    }
    if (
        setting.domain != null &&
        typeof setting.domain === 'object' &&
        !Array.isArray(setting.domain)
    ) {
        var domainLangs = mxAdminActiveLangs();
        var domainOut = {};
        var di;
        for (di = 0; di < domainLangs.length; di++) {
            domainOut[domainLangs[di]] = domainInput;
        }
        setting.domain = domainOut;
    } else {
        setting.domain = domainInput;
    }
    setting.phone = mxAdminEl('mxadminSettingPhone').value;
    setting.mobile = mxAdminEl('mxadminSettingMobile').value;
    setting.email = mxAdminEl('mxadminSettingEmail').value;
    setting.person = mxAdminEl('mxadminSettingPerson').value;
    setting.title = mxAdminEl('mxadminSettingTitle').value;
    setting.address = mxAdminEl('mxadminSettingAddress').value;

    if (
        typeof setting.description !== 'object' ||
        setting.description === null
    ) {
        setting.description = {};
    }
    if (typeof setting.keyword !== 'object' || setting.keyword === null) {
        setting.keyword = {};
    }
    var descInputs = document.querySelectorAll(
        '[data-mxadmin-setting-desc-lang]',
    );
    var i;
    for (i = 0; i < descInputs.length; i++) {
        setting.description[
            descInputs[i].getAttribute('data-mxadmin-setting-desc-lang')
        ] = descInputs[i].value;
    }
    var keywordInputs = document.querySelectorAll(
        '[data-mxadmin-setting-keyword-lang]',
    );
    for (i = 0; i < keywordInputs.length; i++) {
        setting.keyword[
            keywordInputs[i].getAttribute('data-mxadmin-setting-keyword-lang')
        ] = keywordInputs[i].value;
    }

    var saveBtn = mxAdminEl('mxadminSettingsSave');
    saveBtn.disabled = true;
    mxAdminApiRequest('PUT', '/api/admin/data/setting', setting)
        .then(function (result) {
            saveBtn.disabled = false;
            mxAdminUpdateUserChip();
            mxAdminOnMutationSuccess(result);
            mxAdminToast(mxAdminT('saveSuccess'), false);
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err), true);
        });
}



function mxAdminLoadDesign() {
    mxAdminState.loaded.design = true;
    var loading = mxAdminEl('mxadminDesignLoading');
    var form = mxAdminEl('mxadminDesignForm');
    loading.classList.remove('hidden');
    form.classList.add('hidden');
    mxAdminShowAlert('mxadminDesignError', '');

    mxAdminApiRequest('GET', '/api/admin/data/desing')
        .then(function (resp) {
            mxAdminState.desingData = mxAdminUnwrapApiData(resp) || {};
            return mxAdminEnsureModulesListForDesign();
        })
        .then(function () {
            loading.classList.add('hidden');
            mxAdminRenderDesignForm(mxAdminState.desingData || {});
            form.classList.remove('hidden');
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminShowAlert(
                'mxadminDesignError',
                mxAdminApiErrorMessage(err, 'designLoadError'),
            );
        });
}

function mxAdminRenderDesignForm(desing) {
    var summary = mxAdminEl('mxadminLayoutSummary');
    summary.innerHTML = '';
    mxAdminRenderLayoutSection(
        summary,
        mxAdminT('layoutHeader'),
        desing.header,
    );
    mxAdminRenderLayoutSection(summary, mxAdminT('layoutBody'), desing.body);
    mxAdminRenderLayoutSection(
        summary,
        mxAdminT('layoutFooter'),
        desing.footer,
    );

    var colors = desing.colors || {};
    mxAdminRenderColorList('mxadminDesignLite', colors.lite || [], 'lite');
    mxAdminRenderColorList('mxadminDesignDark', colors.dark || [], 'dark');
}

function mxAdminRenderLayoutSection(container, title, ids) {
    var section = document.createElement('div');
    section.className = 'mxadmin-layout-section';
    section.innerHTML =
        '<div class="mxadmin-layout-section-title">' +
        mxAdminEscapeHtml(title) +
        '</div>';
    var list = document.createElement('ul');
    list.className = 'mxadmin-layout-list';
    if (!ids || !ids.length) {
        var emptyItem = document.createElement('li');
        emptyItem.className = 'mxadmin-layout-item mxadmin-layout-item-empty';
        emptyItem.textContent = mxAdminT('layoutEmpty');
        list.appendChild(emptyItem);
    } else {
        var i;
        for (i = 0; i < ids.length; i++) {
            var moduleId = String(ids[i] || '');
            var mod = mxAdminFindModuleById(moduleId);
            var nameVal = mod ? mxAdminGetModuleDisplayName(mod) : moduleId;
            var item = document.createElement('li');
            item.className = 'mxadmin-layout-item';
            if (mod) {
                item.className += ' mxadmin-layout-item-link';
                item.onclick = mxAdminMakeLayoutModuleOpenHandler(moduleId);
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('title', mxAdminT('layoutModuleHint'));
            }
            item.innerHTML =
                '<span class="material-symbols-outlined">' +
                mxAdminEscapeHtml(mod && mod.icon ? mod.icon : 'widgets') +
                '</span>' +
                '<span class="mxadmin-layout-item-text">' +
                '<span class="mxadmin-layout-item-name">' +
                mxAdminEscapeHtml(nameVal) +
                '</span>' +
                '<span class="mxadmin-layout-item-id">' +
                mxAdminEscapeHtml(moduleId) +
                '</span>' +
                '</span>' +
                (mod
                    ? '<span class="material-symbols-outlined mxadmin-layout-item-chevron">chevron_right</span>'
                    : '');
            list.appendChild(item);
        }
    }
    section.appendChild(list);
    container.appendChild(section);
}

function mxAdminRenderColorList(containerId, tokens, themeKey) {
    var container = mxAdminEl(containerId);
    container.innerHTML = '';
    mxAdminUpdateDesignColorMeta(themeKey, tokens ? tokens.length : 0);
    if (!tokens || !tokens.length) {
        return;
    }
    var i;
    for (i = 0; i < tokens.length; i++) {
        var token = tokens[i] || {};
        var value = token.value || '#000000';
        var isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
        var row = document.createElement('div');
        row.className = 'mxadmin-color-row';
        row.innerHTML =
            '<span class="mxadmin-color-swatch" style="background:' +
            mxAdminEscapeHtml(isHex ? value : '#000000') +
            '"></span>' +
            '<span class="mxadmin-color-row-name">' +
            mxAdminEscapeHtml(token.name || '') +
            '</span>' +
            '<input type="color" value="' +
            mxAdminEscapeHtml(isHex ? value : '#000000') +
            '" data-mxadmin-color-index="' +
            i +
            '" data-mxadmin-color-theme="' +
            themeKey +
            '" />' +
            '<input type="text" class="mxadmin-color-hex" value="' +
            mxAdminEscapeHtml(value) +
            '" data-mxadmin-color-text-index="' +
            i +
            '" data-mxadmin-color-theme="' +
            themeKey +
            '" />';
        container.appendChild(row);
    }

    var colorInputs = container.querySelectorAll('input[type="color"]');
    for (i = 0; i < colorInputs.length; i++) {
        colorInputs[i].oninput = mxAdminMakeColorSyncHandler(
            colorInputs[i],
            true,
        );
    }
    var textInputs = container.querySelectorAll('input[type="text"]');
    for (i = 0; i < textInputs.length; i++) {
        textInputs[i].oninput = mxAdminMakeColorSyncHandler(
            textInputs[i],
            false,
        );
    }
}

function mxAdminMakeColorSyncHandler(sourceInput, fromColorPicker) {
    return function () {
        var row = sourceInput.parentNode;
        var colorInput = row.querySelector('input[type="color"]');
        var textInput = row.querySelector('input[type="text"]');
        var swatch = row.querySelector('.mxadmin-color-swatch');
        if (fromColorPicker) {
            textInput.value = colorInput.value;
            if (swatch) {
                swatch.style.background = colorInput.value;
            }
        } else if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(textInput.value)) {
            colorInput.value = textInput.value;
            if (swatch) {
                swatch.style.background = textInput.value;
            }
        }
    };
}

function mxAdminCollectColorList(containerId) {
    var container = mxAdminEl(containerId);
    var textInputs = container.querySelectorAll('input[type="text"]');
    var values = [];
    var i;
    for (i = 0; i < textInputs.length; i++) {
        values[
            Number(textInputs[i].getAttribute('data-mxadmin-color-text-index'))
        ] = textInputs[i].value;
    }
    return values;
}

function mxAdminHandleDesignFormSubmit(evt) {
    evt.preventDefault();
    var desing = mxAdminState.desingData || {};
    if (typeof desing.colors !== 'object' || desing.colors === null) {
        desing.colors = {};
    }
    var liteValues = mxAdminCollectColorList('mxadminDesignLite');
    var darkValues = mxAdminCollectColorList('mxadminDesignDark');
    var i;
    if (Array.isArray(desing.colors.lite)) {
        for (i = 0; i < desing.colors.lite.length; i++) {
            if (liteValues[i] !== undefined) {
                desing.colors.lite[i].value = liteValues[i];
            }
        }
    }
    if (Array.isArray(desing.colors.dark)) {
        for (i = 0; i < desing.colors.dark.length; i++) {
            if (darkValues[i] !== undefined) {
                desing.colors.dark[i].value = darkValues[i];
            }
        }
    }

    var saveBtn = mxAdminEl('mxadminDesignSave');
    saveBtn.disabled = true;
    mxAdminApiRequest('PUT', '/api/admin/data/desing', desing)
        .then(function (result) {
            saveBtn.disabled = false;
            mxAdminOnMutationSuccess(result);
            mxAdminToast(mxAdminT('saveSuccess'), false);
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            if (mxAdminHandleUnauthorized(err)) {
                return;
            }
            mxAdminToast(mxAdminApiErrorMessage(err), true);
        });
}



function mxAdminMakeNavHandler(screenName) {
    return function () {
        mxAdminShowScreen(screenName);
    };
}

function mxAdminMakePageTabHandler(tabName) {
    return function () {
        mxAdminShowPageTab(tabName);
    };
}

function mxAdminBindEvents() {
    var navBtns = document.querySelectorAll('.mxadmin-nav-btn');
    var i;
    for (i = 0; i < navBtns.length; i++) {
        navBtns[i].onclick = mxAdminMakeNavHandler(
            navBtns[i].getAttribute('data-mxadmin-screen'),
        );
    }

    var pageTabs = document.querySelectorAll('.mxadmin-form-tab');
    for (i = 0; i < pageTabs.length; i++) {
        pageTabs[i].onclick = mxAdminMakePageTabHandler(
            pageTabs[i].getAttribute('data-mxadmin-tab'),
        );
    }

    mxAdminEl('mxadminLoginForm').onsubmit = mxAdminHandleLoginSubmit;
    var passwordToggle = mxAdminEl('mxadminPasswordToggle');
    if (passwordToggle) {
        passwordToggle.onclick = mxAdminTogglePasswordVisibility;
        mxAdminSyncPasswordToggleA11y();
    }
    mxAdminEl('mxadminLogoutBtn').onclick = mxAdminLogout;
    mxAdminEl('mxadminLangToggle').onclick = function () {
        mxAdminSetLang(mxAdminState.lang === 'tr' ? 'en' : 'tr');
    };

    mxAdminEl('mxadminCategoriesForm').onsubmit =
        mxAdminHandleCategoriesFormSubmit;
    mxAdminEl('mxadminPageForm').onsubmit = mxAdminHandlePageFormSubmit;
    mxAdminEl('mxadminPageCancel').onclick = mxAdminHandlePageCancel;
    var pageDetailBack = mxAdminEl('mxadminPageDetailBack');
    if (pageDetailBack) {
        pageDetailBack.onclick = mxAdminHandlePageCancel;
        pageDetailBack.setAttribute('title', mxAdminT('pageDetailBack'));
    }
    var pageAddBtn = mxAdminEl('mxadminPageAddBtn');
    if (pageAddBtn) {
        pageAddBtn.onclick = mxAdminAddPage;
    }
    var settingLogoInput = mxAdminEl('mxadminSettingLogoInput');
    var settingLogoUploadBtn = mxAdminEl('mxadminSettingLogoUploadBtn');
    if (settingLogoUploadBtn && settingLogoInput) {
        settingLogoUploadBtn.onclick = function () {
            settingLogoInput.click();
        };
        settingLogoInput.onchange = mxAdminHandleSettingLogoUploadInput;
    }
    var pagesListRefreshBtn = mxAdminEl('mxadminPagesListRefreshBtn');
    if (pagesListRefreshBtn) {
        pagesListRefreshBtn.onclick = mxAdminRefreshPagesList;
    }
    var modulesListRefreshBtn = mxAdminEl('mxadminModulesListRefreshBtn');
    if (modulesListRefreshBtn) {
        modulesListRefreshBtn.onclick = mxAdminRefreshModulesList;
    }
    var pageDeleteBtn = mxAdminEl('mxadminPageDeleteBtn');
    if (pageDeleteBtn) {
        pageDeleteBtn.onclick = mxAdminDeletePage;
    }
    var pageStatusSelect = mxAdminEl('mxadminPageStatus');
    if (pageStatusSelect) {
        pageStatusSelect.onchange = mxAdminHandlePageStatusChange;
    }
    mxAdminEl('mxadminSettingsForm').onsubmit = mxAdminHandleSettingsFormSubmit;
    mxAdminEl('mxadminDesignForm').onsubmit = mxAdminHandleDesignFormSubmit;

    var searchInput = mxAdminEl('mxadminPagesSearch');
    if (searchInput) {
        searchInput.oninput = mxAdminHandlePagesSearchInput;
    }

    var modulesSearchInput = mxAdminEl('mxadminModulesSearch');
    if (modulesSearchInput) {
        modulesSearchInput.oninput = mxAdminHandleModulesSearchInput;
    }

    var moduleForm = mxAdminEl('mxadminModuleForm');
    if (moduleForm) {
        moduleForm.onsubmit = mxAdminHandleModuleFormSubmit;
    }
    var moduleCancel = mxAdminEl('mxadminModuleCancel');
    if (moduleCancel) {
        moduleCancel.onclick = mxAdminHandleModuleCancel;
    }
    var moduleBack = mxAdminEl('mxadminModuleDetailBack');
    if (moduleBack) {
        moduleBack.onclick = mxAdminHandleModuleCancel;
    }
    var moduleDataAdd = mxAdminEl('mxadminModuleDataAdd');
    if (moduleDataAdd) {
        moduleDataAdd.onclick = mxAdminHandleModuleDataAdd;
    }
    var pageMediaInput = mxAdminEl('mxadminPageMediaInput');
    if (pageMediaInput) {
        pageMediaInput.onchange = mxAdminHandlePageMediaUploadInput;
    }
    var pageMediaUploadBtn = mxAdminEl('mxadminPageMediaUploadBtn');
    if (pageMediaUploadBtn) {
        pageMediaUploadBtn.onclick = function () {
            mxAdminEl('mxadminPageMediaInput').click();
        };
    }
    var moduleMediaInput = mxAdminEl('mxadminModuleMediaInput');
    if (moduleMediaInput) {
        moduleMediaInput.onchange = mxAdminHandleModuleMediaUploadInput;
    }
    var moduleMediaUploadBtn = mxAdminEl('mxadminModuleMediaUploadBtn');
    if (moduleMediaUploadBtn) {
        moduleMediaUploadBtn.onclick = function () {
            mxAdminEl('mxadminModuleMediaInput').click();
        };
    }
    var moduleTabs = document.querySelectorAll('[data-mxadmin-module-tab]');
    for (i = 0; i < moduleTabs.length; i++) {
        moduleTabs[i].onclick = mxAdminMakeModuleTabHandler(
            moduleTabs[i].getAttribute('data-mxadmin-module-tab'),
        );
    }

    var quickPages = mxAdminEl('mxadminQuickPages');
    if (quickPages) {
        quickPages.onclick = mxAdminOpenFirstCategoryPages;
    }
    var quickWrap = mxAdminEl('mxadminQuickActions');
    if (quickWrap) {
        var quickBtns = quickWrap.querySelectorAll('[data-mxadmin-quick]');
        for (i = 0; i < quickBtns.length; i++) {
            quickBtns[i].onclick = mxAdminMakeNavHandler(
                quickBtns[i].getAttribute('data-mxadmin-quick'),
            );
        }
    }

    var categoriesEditBtn = mxAdminEl('mxadminCategoriesEditBtn');
    if (categoriesEditBtn) {
        categoriesEditBtn.onclick = function () {
            mxAdminShowScreen('categories');
        };
    }

    var categoriesBackBtn = mxAdminEl('mxadminCategoriesBackBtn');
    if (categoriesBackBtn) {
        categoriesBackBtn.onclick = mxAdminHandleCategoriesBack;
        categoriesBackBtn.setAttribute('title', mxAdminT('categoriesBack'));
    }

    var sidebarToggle = mxAdminEl('mxadminSidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.onclick = mxAdminToggleSidebarDrawer;
    }
    var sidebarOverlay = mxAdminEl('mxadminSidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.onclick = mxAdminCloseSidebarDrawer;
    }
}


function mxAdminApplyPanelVersion() {
    var el = mxAdminEl('mxadminVersion');
    if (!el) {
        return;
    }
    el.textContent = 'v' + MXADMIN_PANEL_VERSION;
}

function mxAdminInit() {
    var browserLang = (
        navigator.language ||
        navigator.userLanguage ||
        'tr'
    ).toLowerCase();
    mxAdminState.lang = browserLang.indexOf('en') === 0 ? 'en' : 'tr';
    mxAdminApplyPanelVersion();
    mxAdminApplyI18n();
    mxAdminInjectSelectChevronStyle();
    mxAdminBindEvents();
    mxAdminPrefetchSiteLogo();
    mxAdminCheckSession();
}

window.onload = mxAdminInit;


var Global_confirmDelete = mxAdminConfirmDelete;
