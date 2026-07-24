

var MX_ADMIN_API_BASE = 'https://otomavi.com';

var MX_ADMIN_I18N = {
    tr: {
        appTitle: 'Site Yönetimi',
        navDashboard: 'Dashboard',
        navPages: 'Sayfalar',
        navSettings: 'Ayarlar',
        navDesign: 'Tasarım',
        loginTitle: 'Site Yönetimi',
        loginSub: 'Devam etmek için giriş yapın',
        labelUsername: 'Kullanıcı adı',
        labelPassword: 'Parola',
        loginSubmit: 'Giriş Yap',
        loginHint: 'Bu panelden yeni kullanıcı oluşturulamaz — kullanıcı ekleme yalnızca site yöneticiniz tarafından yapılır.',
        loginErrorInvalid: 'Kullanıcı adı veya parola hatalı.',
        loginErrorNetwork: 'Yönetim sunucusuna bağlanılamadı. Lütfen daha sonra tekrar deneyin.',
        configWarning: 'Yönetim API adresi henüz yapılandırılmamış. Lütfen site yöneticinizle iletişime geçin.',
        loading: 'Yükleniyor…',
        save: 'Kaydet',
        cancel: 'İptal',
        saveSuccess: 'Kaydedildi.',
        saveError: 'Kaydedilemedi. Lütfen tekrar deneyin.',
        dashboardTitle: 'Dashboard',
        cardDomain: 'Alan adı',
        cardUsername: 'Kullanıcı adı',
        cardProject: 'Proje',
        mustResetWarning: 'Parolanızın sıfırlanması gerekiyor. Lütfen site yöneticinizle iletişime geçin.',
        loginHistoryTitle: 'Giriş geçmişiniz',
        loginHistoryEmpty: 'Kayıt bulunamadı.',
        loginHistoryError: 'Giriş geçmişi yüklenemedi.',
        colDate: 'Tarih',
        colIp: 'IP',
        colDevice: 'Cihaz',
        colResult: 'Sonuç',
        resultSuccess: 'Başarılı',
        resultFail: 'Başarısız',
        pagesTitle: 'Sayfalar',
        pagesEmpty: 'Sayfa bulunamadı.',
        pagesLoadError: 'Sayfalar yüklenemedi.',
        fieldName: 'Ad',
        fieldDescription: 'Açıklama',
        fieldStatus: 'Durum',
        statusPlay: 'Yayında',
        statusPause: 'Pasif',
        settingsTitle: 'Ayarlar',
        settingsLoadError: 'Ayarlar yüklenemedi.',
        fieldSiteName: 'Site adı',
        fieldDomain: 'Alan adı',
        fieldPhone: 'Telefon',
        fieldMobile: 'Cep telefonu',
        fieldEmail: 'E-posta',
        fieldAddress: 'Adres',
        fieldPerson: 'Yetkili',
        fieldTitle: 'Ünvan',
        fieldKeyword: 'Anahtar kelime',
        designTitle: 'Tasarım',
        designLiteTheme: 'Açık tema',
        designDarkTheme: 'Koyu tema',
        designLoadError: 'Tasarım renkleri yüklenemedi.',
        notConfigured: 'Yönetim API adresi yapılandırılmamış.',
        networkError: 'Sunucuya ulaşılamadı.',
        unauthorized: 'Oturum sona ermiş, lütfen tekrar giriş yapın.'
    },
    en: {
        appTitle: 'Site Admin',
        navDashboard: 'Dashboard',
        navPages: 'Pages',
        navSettings: 'Settings',
        navDesign: 'Design',
        loginTitle: 'Site Admin',
        loginSub: 'Sign in to continue',
        labelUsername: 'Username',
        labelPassword: 'Password',
        loginSubmit: 'Sign In',
        loginHint: 'New users cannot be created from this panel — user accounts are managed by your site administrator.',
        loginErrorInvalid: 'Invalid username or password.',
        loginErrorNetwork: 'Could not reach the admin server. Please try again later.',
        configWarning: 'The admin API address is not configured yet. Please contact your site administrator.',
        loading: 'Loading…',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Saved.',
        saveError: 'Could not save. Please try again.',
        dashboardTitle: 'Dashboard',
        cardDomain: 'Domain',
        cardUsername: 'Username',
        cardProject: 'Project',
        mustResetWarning: 'Your password must be reset. Please contact your site administrator.',
        loginHistoryTitle: 'Your login history',
        loginHistoryEmpty: 'No records found.',
        loginHistoryError: 'Could not load login history.',
        colDate: 'Date',
        colIp: 'IP',
        colDevice: 'Device',
        colResult: 'Result',
        resultSuccess: 'Success',
        resultFail: 'Failed',
        pagesTitle: 'Pages',
        pagesEmpty: 'No pages found.',
        pagesLoadError: 'Could not load pages.',
        fieldName: 'Name',
        fieldDescription: 'Description',
        fieldStatus: 'Status',
        statusPlay: 'Live',
        statusPause: 'Hidden',
        settingsTitle: 'Settings',
        settingsLoadError: 'Could not load settings.',
        fieldSiteName: 'Site name',
        fieldDomain: 'Domain',
        fieldPhone: 'Phone',
        fieldMobile: 'Mobile',
        fieldEmail: 'Email',
        fieldAddress: 'Address',
        fieldPerson: 'Contact person',
        fieldTitle: 'Title',
        fieldKeyword: 'Keyword',
        designTitle: 'Design',
        designLiteTheme: 'Light theme',
        designDarkTheme: 'Dark theme',
        designLoadError: 'Could not load design colors.',
        notConfigured: 'Admin API address is not configured.',
        networkError: 'Could not reach the server.',
        unauthorized: 'Your session has expired, please sign in again.'
    }
};

var mxAdminState = {
    lang: 'tr',
    screen: 'dashboard',
    me: null,
    settingData: null,
    pageData: null,
    desingData: null,
    activePageId: null,
    loaded: { dashboard: false, pages: false, settings: false, design: false }
};



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
        var key = nodes[i].getAttribute('data-mxadmin-i18n');
        nodes[i].textContent = mxAdminT(key);
    }
    document.documentElement.setAttribute('lang', mxAdminState.lang);
    var toggleBtn = mxAdminEl('mxadminLangToggle');
    if (toggleBtn) {
        toggleBtn.textContent = mxAdminState.lang === 'tr' ? 'EN' : 'TR';
    }
    document.title = mxAdminT('appTitle');
}

function mxAdminSetLang(lang) {
    mxAdminState.lang = lang === 'en' ? 'en' : 'tr';
    mxAdminApplyI18n();
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



function mxAdminApiConfigured() {
    return !!(MX_ADMIN_API_BASE && MX_ADMIN_API_BASE.indexOf('{{') !== 0);
}

function mxAdminApiUrl(pathSuffix) {
    if (!mxAdminApiConfigured()) {
        return '';
    }
    return MX_ADMIN_API_BASE.replace(/\/+$/, '') + pathSuffix;
}


function mxAdminApiRequest(method, pathSuffix, body) {
    return new Promise(function (resolve, reject) {
        if (!mxAdminApiConfigured()) {
            reject({ code: 'NOT_CONFIGURED' });
            return;
        }
        var url = mxAdminApiUrl(pathSuffix);
        var opts = {
            method: method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        };
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
        request.then(function (res) {
            res.json().then(function (data) {
                if (!res.ok) {
                    reject({ code: res.status === 401 ? 'UNAUTHORIZED' : 'HTTP', status: res.status, data: data });
                    return;
                }
                resolve(data);
            }).catch(function () {
                if (!res.ok) {
                    reject({ code: res.status === 401 ? 'UNAUTHORIZED' : 'HTTP', status: res.status });
                    return;
                }
                resolve({});
            });
        }).catch(function () {
            reject({ code: 'NETWORK' });
        });
    });
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
    return mxAdminT(fallbackKey || 'saveError');
}



function mxAdminShowScreen(name) {
    var screens = { dashboard: 'mxadminScreenDashboard', pages: 'mxadminScreenPages', settings: 'mxadminScreenSettings', design: 'mxadminScreenDesign' };
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
    var navBtns = document.querySelectorAll('.mxadmin-nav-btn');
    var i;
    for (i = 0; i < navBtns.length; i++) {
        if (navBtns[i].getAttribute('data-mxadmin-screen') === name) {
            navBtns[i].classList.add('is-active');
        } else {
            navBtns[i].classList.remove('is-active');
        }
    }
    mxAdminState.screen = name;

    if (name === 'dashboard' && !mxAdminState.loaded.dashboard) {
        mxAdminLoadDashboard();
    } else if (name === 'pages' && !mxAdminState.loaded.pages) {
        mxAdminLoadPages();
    } else if (name === 'settings' && !mxAdminState.loaded.settings) {
        mxAdminLoadSettings();
    } else if (name === 'design' && !mxAdminState.loaded.design) {
        mxAdminLoadDesign();
    }
}

function mxAdminShowApp(me) {
    mxAdminState.me = me || {};
    mxAdminEl('mxadminScreenLogin').classList.add('hidden');
    mxAdminEl('mxadminTopbar').classList.remove('hidden');
    mxAdminShowScreen('dashboard');
}

function mxAdminShowLogin() {
    mxAdminEl('mxadminTopbar').classList.add('hidden');
    mxAdminEl('mxadminScreenLogin').classList.remove('hidden');
    if (!mxAdminApiConfigured()) {
        mxAdminShowAlert('mxadminConfigWarning', mxAdminT('configWarning'));
    }
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

    mxAdminApiRequest('POST', '/api/admin/auth/login', { username: username, password: password })
        .then(function (data) {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            mxAdminShowApp(data);
        })
        .catch(function (err) {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            if (err && err.code === 'UNAUTHORIZED') {
                mxAdminShowAlert('mxadminLoginError', mxAdminT('loginErrorInvalid'));
            } else if (err && err.code === 'NOT_CONFIGURED') {
                mxAdminShowAlert('mxadminConfigWarning', mxAdminT('configWarning'));
            } else {
                mxAdminShowAlert('mxadminLoginError', mxAdminT('loginErrorNetwork'));
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
    mxAdminApiRequest('POST', '/api/admin/auth/logout').then(function () {
        mxAdminAfterLogout();
    }).catch(function () {
        mxAdminAfterLogout();
    });
}

function mxAdminAfterLogout() {
    mxAdminState.me = null;
    mxAdminState.loaded = { dashboard: false, pages: false, settings: false, design: false };
    mxAdminEl('mxadminUsername').value = '';
    mxAdminEl('mxadminPassword').value = '';
    mxAdminShowLogin();
}



function mxAdminLoadDashboard() {
    mxAdminState.loaded.dashboard = true;
    var me = mxAdminState.me || {};
    
    mxAdminEl('mxadminCardDomainValue').textContent = me.domain || window.location.hostname || '—';
    mxAdminEl('mxadminCardUsernameValue').textContent = me.username || '—';
    mxAdminEl('mxadminCardProjectValue').textContent = me.project_id || me.projectId || '—';

    if (me.must_reset || me.mustReset) {
        mxAdminEl('mxadminMustResetWarning').classList.remove('hidden');
    } else {
        mxAdminEl('mxadminMustResetWarning').classList.add('hidden');
    }

    var loading = mxAdminEl('mxadminHistoryLoading');
    var table = mxAdminEl('mxadminHistoryTable');
    var empty = mxAdminEl('mxadminHistoryEmpty');
    loading.classList.remove('hidden');
    table.classList.add('hidden');
    empty.classList.add('hidden');
    mxAdminShowAlert('mxadminHistoryError', '');

    
    mxAdminApiRequest('GET', '/api/admin/auth/login-history')
        .then(function (data) {
            loading.classList.add('hidden');
            var list = (data && data.data) || (Array.isArray(data) ? data : []);
            mxAdminRenderLoginHistory(list);
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            mxAdminShowAlert('mxadminHistoryError', mxAdminApiErrorMessage(err, 'loginHistoryError'));
        });
}

function mxAdminRenderLoginHistory(list) {
    var table = mxAdminEl('mxadminHistoryTable');
    var empty = mxAdminEl('mxadminHistoryEmpty');
    var body = mxAdminEl('mxadminHistoryBody');
    body.innerHTML = '';

    if (!list || !list.length) {
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
                dateText = new Date(dateVal).toLocaleString(mxAdminState.lang === 'en' ? 'en-US' : 'tr-TR');
            }
        } catch (dateErr) {
            dateText = dateVal;
        }
        var success = row.success === true || row.success === 1;
        tr.innerHTML =
            '<td>' + mxAdminEscapeHtml(dateText) + '</td>' +
            '<td>' + mxAdminEscapeHtml(row.ip || '—') + '</td>' +
            '<td>' + mxAdminEscapeHtml(row.user_agent || row.userAgent || '—') + '</td>' +
            '<td><span class="mxadmin-badge ' + (success ? 'mxadmin-badge-success' : 'mxadmin-badge-fail') + '">' +
            mxAdminEscapeHtml(success ? mxAdminT('resultSuccess') : mxAdminT('resultFail')) + '</span></td>';
        body.appendChild(tr);
    }
}



function mxAdminActiveLangs() {
    var setting = mxAdminState.settingData;
    if (setting && setting.langs && typeof setting.langs === 'object') {
        var langs = [];
        var key;
        for (key in setting.langs) {
            if (Object.prototype.hasOwnProperty.call(setting.langs, key) && setting.langs[key]) {
                langs.push(key);
            }
        }
        if (langs.length) {
            return langs;
        }
    }
    return ['tr', 'en'];
}

function mxAdminLoadPages() {
    mxAdminState.loaded.pages = true;
    var loading = mxAdminEl('mxadminPagesLoading');
    var empty = mxAdminEl('mxadminPagesEmpty');
    loading.classList.remove('hidden');
    empty.classList.add('hidden');
    mxAdminShowAlert('mxadminPagesError', '');
    mxAdminEl('mxadminPagesList').innerHTML = '';
    mxAdminEl('mxadminPageForm').classList.add('hidden');

    mxAdminApiRequest('GET', '/api/admin/data/page')
        .then(function (data) {
            loading.classList.add('hidden');
            mxAdminState.pageData = data || {};
            var list = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
            mxAdminRenderPagesList(list);
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            mxAdminShowAlert('mxadminPagesError', mxAdminApiErrorMessage(err, 'pagesLoadError'));
        });
}

function mxAdminRenderPagesList(list) {
    var ul = mxAdminEl('mxadminPagesList');
    ul.innerHTML = '';
    if (!list || !list.length) {
        mxAdminEl('mxadminPagesEmpty').classList.remove('hidden');
        return;
    }
    mxAdminEl('mxadminPagesEmpty').classList.add('hidden');

    var lang = mxAdminState.lang;
    var i;
    for (i = 0; i < list.length; i++) {
        var page = list[i] || {};
        var li = document.createElement('li');
        li.setAttribute('data-mxadmin-page-id', page.id || String(i));
        var name = page.name && typeof page.name === 'object' ? (page.name[lang] || page.name.tr || '') : (page.name || '');
        li.innerHTML =
            '<span>' + mxAdminEscapeHtml(name || page.path || ('#' + i)) + '</span>' +
            '<span class="mxadmin-page-path">/' + mxAdminEscapeHtml(page.path || '') + '</span>';
        li.onclick = mxAdminMakePageOpenHandler(page.id || String(i));
        ul.appendChild(li);
    }
}

function mxAdminMakePageOpenHandler(pageId) {
    return function () {
        mxAdminOpenPageEditor(pageId);
    };
}

function mxAdminFindPage(pageId) {
    var list = mxAdminState.pageData && Array.isArray(mxAdminState.pageData.data)
        ? mxAdminState.pageData.data
        : (Array.isArray(mxAdminState.pageData) ? mxAdminState.pageData : []);
    var i;
    for (i = 0; i < list.length; i++) {
        var page = list[i] || {};
        if (String(page.id || i) === String(pageId)) {
            return page;
        }
    }
    return null;
}

function mxAdminOpenPageEditor(pageId) {
    var page = mxAdminFindPage(pageId);
    if (!page) {
        return;
    }
    mxAdminState.activePageId = pageId;

    var items = mxAdminEl('mxadminPagesList').children;
    var i;
    for (i = 0; i < items.length; i++) {
        if (items[i].getAttribute('data-mxadmin-page-id') === String(pageId)) {
            items[i].classList.add('is-active');
        } else {
            items[i].classList.remove('is-active');
        }
    }

    mxAdminEl('mxadminPageStatus').value = page.status === 'pause' ? 'pause' : 'play';

    var langs = mxAdminActiveLangs();
    var nameWrap = mxAdminEl('mxadminPageNameFields');
    var descWrap = mxAdminEl('mxadminPageDescriptionFields');
    nameWrap.innerHTML = '';
    descWrap.innerHTML = '';

    var li;
    for (li = 0; li < langs.length; li++) {
        var lang = langs[li];
        var nameVal = page.name && typeof page.name === 'object' ? (page.name[lang] || '') : (li === 0 ? (page.name || '') : '');
        var descVal = page.description && typeof page.description === 'object' ? (page.description[lang] || '') : (li === 0 ? (page.description || '') : '');

        var nameGroup = document.createElement('div');
        nameGroup.className = 'mxadmin-form-group';
        nameGroup.innerHTML = '<label>' + mxAdminEscapeHtml(mxAdminT('fieldName')) + ' (' + lang.toUpperCase() + ')</label>' +
            '<input type="text" data-mxadmin-page-name-lang="' + lang + '" value="' + mxAdminEscapeHtml(nameVal) + '" />';
        nameWrap.appendChild(nameGroup);

        var descGroup = document.createElement('div');
        descGroup.className = 'mxadmin-form-group';
        descGroup.innerHTML = '<label>' + mxAdminEscapeHtml(mxAdminT('fieldDescription')) + ' (' + lang.toUpperCase() + ')</label>' +
            '<textarea data-mxadmin-page-desc-lang="' + lang + '">' + mxAdminEscapeHtml(descVal) + '</textarea>';
        descWrap.appendChild(descGroup);
    }

    mxAdminEl('mxadminPageForm').classList.remove('hidden');
}

function mxAdminHandlePageFormSubmit(evt) {
    evt.preventDefault();
    var page = mxAdminFindPage(mxAdminState.activePageId);
    if (!page) {
        return;
    }
    page.status = mxAdminEl('mxadminPageStatus').value;
    if (typeof page.name !== 'object' || page.name === null) {
        page.name = {};
    }
    if (typeof page.description !== 'object' || page.description === null) {
        page.description = {};
    }
    var nameInputs = document.querySelectorAll('[data-mxadmin-page-name-lang]');
    var i;
    for (i = 0; i < nameInputs.length; i++) {
        page.name[nameInputs[i].getAttribute('data-mxadmin-page-name-lang')] = nameInputs[i].value;
    }
    var descInputs = document.querySelectorAll('[data-mxadmin-page-desc-lang]');
    for (i = 0; i < descInputs.length; i++) {
        page.description[descInputs[i].getAttribute('data-mxadmin-page-desc-lang')] = descInputs[i].value;
    }

    var saveBtn = mxAdminEl('mxadminPageSave');
    saveBtn.disabled = true;
    mxAdminApiRequest('PUT', '/api/admin/data/page', mxAdminState.pageData)
        .then(function () {
            saveBtn.disabled = false;
            mxAdminToast(mxAdminT('saveSuccess'), false);
            mxAdminRenderPagesList(
                mxAdminState.pageData && Array.isArray(mxAdminState.pageData.data)
                    ? mxAdminState.pageData.data
                    : mxAdminState.pageData
            );
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            mxAdminToast(mxAdminApiErrorMessage(err), true);
        });
}

function mxAdminHandlePageCancel() {
    mxAdminEl('mxadminPageForm').classList.add('hidden');
    mxAdminState.activePageId = null;
    var items = mxAdminEl('mxadminPagesList').children;
    var i;
    for (i = 0; i < items.length; i++) {
        items[i].classList.remove('is-active');
    }
}



function mxAdminLoadSettings() {
    mxAdminState.loaded.settings = true;
    var loading = mxAdminEl('mxadminSettingsLoading');
    var form = mxAdminEl('mxadminSettingsForm');
    loading.classList.remove('hidden');
    form.classList.add('hidden');
    mxAdminShowAlert('mxadminSettingsError', '');

    mxAdminApiRequest('GET', '/api/admin/data/setting')
        .then(function (data) {
            loading.classList.add('hidden');
            mxAdminState.settingData = data || {};
            mxAdminRenderSettingsForm(mxAdminState.settingData);
            form.classList.remove('hidden');
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            mxAdminShowAlert('mxadminSettingsError', mxAdminApiErrorMessage(err, 'settingsLoadError'));
        });
}

function mxAdminRenderSettingsForm(setting) {
    mxAdminEl('mxadminSettingName').value = setting.name || '';
    mxAdminEl('mxadminSettingDomain').value = setting.domain || '';
    mxAdminEl('mxadminSettingPhone').value = setting.phone || '';
    mxAdminEl('mxadminSettingMobile').value = setting.mobile || '';
    mxAdminEl('mxadminSettingEmail').value = setting.email || '';
    mxAdminEl('mxadminSettingPerson').value = setting.person || '';
    mxAdminEl('mxadminSettingTitle').value = setting.title || '';
    mxAdminEl('mxadminSettingAddress').value = setting.address || '';

    var langs = mxAdminActiveLangs();
    var descWrap = mxAdminEl('mxadminSettingDescriptionFields');
    var keywordWrap = mxAdminEl('mxadminSettingKeywordFields');
    descWrap.innerHTML = '';
    keywordWrap.innerHTML = '';

    var i;
    for (i = 0; i < langs.length; i++) {
        var lang = langs[i];
        var descVal = setting.description && typeof setting.description === 'object' ? (setting.description[lang] || '') : '';
        var keywordVal = setting.keyword && typeof setting.keyword === 'object' ? (setting.keyword[lang] || '') : '';

        var descGroup = document.createElement('div');
        descGroup.className = 'mxadmin-form-group';
        descGroup.innerHTML = '<label>' + mxAdminEscapeHtml(mxAdminT('fieldDescription')) + ' (' + lang.toUpperCase() + ')</label>' +
            '<textarea data-mxadmin-setting-desc-lang="' + lang + '">' + mxAdminEscapeHtml(descVal) + '</textarea>';
        descWrap.appendChild(descGroup);

        var keywordGroup = document.createElement('div');
        keywordGroup.className = 'mxadmin-form-group';
        keywordGroup.innerHTML = '<label>' + mxAdminEscapeHtml(mxAdminT('fieldKeyword')) + ' (' + lang.toUpperCase() + ')</label>' +
            '<input type="text" data-mxadmin-setting-keyword-lang="' + lang + '" value="' + mxAdminEscapeHtml(keywordVal) + '" />';
        keywordWrap.appendChild(keywordGroup);
    }
}

function mxAdminHandleSettingsFormSubmit(evt) {
    evt.preventDefault();
    var setting = mxAdminState.settingData || {};
    setting.name = mxAdminEl('mxadminSettingName').value;
    setting.domain = mxAdminEl('mxadminSettingDomain').value;
    setting.phone = mxAdminEl('mxadminSettingPhone').value;
    setting.mobile = mxAdminEl('mxadminSettingMobile').value;
    setting.email = mxAdminEl('mxadminSettingEmail').value;
    setting.person = mxAdminEl('mxadminSettingPerson').value;
    setting.title = mxAdminEl('mxadminSettingTitle').value;
    setting.address = mxAdminEl('mxadminSettingAddress').value;

    if (typeof setting.description !== 'object' || setting.description === null) {
        setting.description = {};
    }
    if (typeof setting.keyword !== 'object' || setting.keyword === null) {
        setting.keyword = {};
    }
    var descInputs = document.querySelectorAll('[data-mxadmin-setting-desc-lang]');
    var i;
    for (i = 0; i < descInputs.length; i++) {
        setting.description[descInputs[i].getAttribute('data-mxadmin-setting-desc-lang')] = descInputs[i].value;
    }
    var keywordInputs = document.querySelectorAll('[data-mxadmin-setting-keyword-lang]');
    for (i = 0; i < keywordInputs.length; i++) {
        setting.keyword[keywordInputs[i].getAttribute('data-mxadmin-setting-keyword-lang')] = keywordInputs[i].value;
    }

    var saveBtn = mxAdminEl('mxadminSettingsSave');
    saveBtn.disabled = true;
    mxAdminApiRequest('PUT', '/api/admin/data/setting', setting)
        .then(function () {
            saveBtn.disabled = false;
            mxAdminToast(mxAdminT('saveSuccess'), false);
        })
        .catch(function (err) {
            saveBtn.disabled = false;
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
        .then(function (data) {
            loading.classList.add('hidden');
            mxAdminState.desingData = data || {};
            mxAdminRenderDesignForm(mxAdminState.desingData);
            form.classList.remove('hidden');
        })
        .catch(function (err) {
            loading.classList.add('hidden');
            mxAdminShowAlert('mxadminDesignError', mxAdminApiErrorMessage(err, 'designLoadError'));
        });
}

function mxAdminRenderColorGrid(containerId, tokens, themeKey) {
    var container = mxAdminEl(containerId);
    container.innerHTML = '';
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
            '<span class="mxadmin-color-row-name">' + mxAdminEscapeHtml(token.name || '') + '</span>' +
            '<input type="color" value="' + mxAdminEscapeHtml(isHex ? value : '#000000') + '" data-mxadmin-color-index="' + i + '" data-mxadmin-color-theme="' + themeKey + '" />' +
            '<input type="text" value="' + mxAdminEscapeHtml(value) + '" data-mxadmin-color-text-index="' + i + '" data-mxadmin-color-theme="' + themeKey + '" />';
        container.appendChild(row);
    }

    var colorInputs = container.querySelectorAll('input[type="color"]');
    for (i = 0; i < colorInputs.length; i++) {
        colorInputs[i].oninput = mxAdminMakeColorSyncHandler(colorInputs[i], true);
    }
    var textInputs = container.querySelectorAll('input[type="text"]');
    for (i = 0; i < textInputs.length; i++) {
        textInputs[i].oninput = mxAdminMakeColorSyncHandler(textInputs[i], false);
    }
}

function mxAdminMakeColorSyncHandler(sourceInput, fromColorPicker) {
    return function () {
        var row = sourceInput.parentNode;
        var colorInput = row.querySelector('input[type="color"]');
        var textInput = row.querySelector('input[type="text"]');
        if (fromColorPicker) {
            textInput.value = colorInput.value;
        } else if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(textInput.value)) {
            colorInput.value = textInput.value;
        }
    };
}

function mxAdminRenderDesignForm(desing) {
    var colors = desing.colors || {};
    mxAdminRenderColorGrid('mxadminDesignLite', colors.lite || [], 'lite');
    mxAdminRenderColorGrid('mxadminDesignDark', colors.dark || [], 'dark');
}

function mxAdminCollectColorGrid(containerId) {
    var container = mxAdminEl(containerId);
    var textInputs = container.querySelectorAll('input[type="text"]');
    var values = [];
    var i;
    for (i = 0; i < textInputs.length; i++) {
        values[Number(textInputs[i].getAttribute('data-mxadmin-color-text-index'))] = textInputs[i].value;
    }
    return values;
}

function mxAdminHandleDesignFormSubmit(evt) {
    evt.preventDefault();
    var desing = mxAdminState.desingData || {};
    if (typeof desing.colors !== 'object' || desing.colors === null) {
        desing.colors = {};
    }
    var liteValues = mxAdminCollectColorGrid('mxadminDesignLite');
    var darkValues = mxAdminCollectColorGrid('mxadminDesignDark');
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
        .then(function () {
            saveBtn.disabled = false;
            mxAdminToast(mxAdminT('saveSuccess'), false);
        })
        .catch(function (err) {
            saveBtn.disabled = false;
            mxAdminToast(mxAdminApiErrorMessage(err), true);
        });
}



function mxAdminMakeNavHandler(screenName) {
    return function () {
        mxAdminShowScreen(screenName);
    };
}

function mxAdminBindEvents() {
    var navBtns = document.querySelectorAll('.mxadmin-nav-btn');
    var i;
    for (i = 0; i < navBtns.length; i++) {
        navBtns[i].onclick = mxAdminMakeNavHandler(navBtns[i].getAttribute('data-mxadmin-screen'));
    }

    mxAdminEl('mxadminLoginForm').onsubmit = mxAdminHandleLoginSubmit;
    mxAdminEl('mxadminLogoutBtn').onclick = mxAdminLogout;
    mxAdminEl('mxadminLangToggle').onclick = function () {
        mxAdminSetLang(mxAdminState.lang === 'tr' ? 'en' : 'tr');
    };

    mxAdminEl('mxadminPageForm').onsubmit = mxAdminHandlePageFormSubmit;
    mxAdminEl('mxadminPageCancel').onclick = mxAdminHandlePageCancel;
    mxAdminEl('mxadminSettingsForm').onsubmit = mxAdminHandleSettingsFormSubmit;
    mxAdminEl('mxadminDesignForm').onsubmit = mxAdminHandleDesignFormSubmit;
}

function mxAdminInit() {
    var browserLang = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
    mxAdminState.lang = browserLang.indexOf('en') === 0 ? 'en' : 'tr';
    mxAdminApplyI18n();
    mxAdminBindEvents();
    mxAdminCheckSession();
}

window.onload = mxAdminInit;
