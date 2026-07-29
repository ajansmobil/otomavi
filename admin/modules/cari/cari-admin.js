
var MXADMIN_CARI_I18N = {
    tr: {
        sectionTitle: 'Cari',
        navCari: 'Cari & Gelir/Gider',
        screenTitle: 'Cari hesaplar',
        screenSub: 'Müşteri alacak/verecek ve gelir-gider hareketleri',
        loading: 'Yükleniyor…',
        empty: 'Henüz cari kaydı yok.',
        loadError: 'Cari listesi yüklenemedi.',
        summaryGelir: 'Toplam gelir',
        summaryGider: 'Toplam gider',
        summaryBakiye: 'Net bakiye',
        summaryAlacak: 'Toplam alacak',
        summaryVerecek: 'Toplam verecek',
        listTitle: 'Cari listesi',
        addCari: 'Yeni cari',
        detailTitle: 'Cari özeti',
        transactionsTitle: 'İşlem geçmişi',
        addTxTitle: 'Yeni işlem',
        selectHint: 'Soldan bir cari seçin veya yeni cari ekleyin.',
        colName: 'Ad / Unvan',
        colPhone: 'Telefon',
        colAlacak: 'Alacak',
        colVerecek: 'Verecek',
        colDate: 'Tarih',
        colType: 'Tür',
        colAmount: 'Tutar',
        colDesc: 'Açıklama',
        typeGelir: 'Gelir',
        typeGider: 'Gider',
        addIslem: 'İşlem ekle',
        name: 'Ad / Unvan',
        phone: 'Telefon',
        email: 'E-posta',
        note: 'Not',
        amount: 'Miktar',
        amountPlaceholder: '1500',
        description: 'Açıklama',
        date: 'Tarih',
        save: 'Kaydet',
        edit: 'Düzenle',
        cancel: 'İptal',
        close: 'Kapat',
        backToList: 'Cari listesine dön',
        delete: 'Sil',
        netBalance: 'Net bakiye',
        txCount: 'İşlem sayısı',
        txEmpty: 'Bu caride henüz işlem yok.',
        confirmDeleteCari: 'Bu cari ve tüm işlemleri silinecek. Emin misiniz?',
        confirmDeleteIslem: 'Bu işlem silinecek. Emin misiniz?',
        saveSuccess: 'Kaydedildi.',
        saveError: 'Kayıt başarısız.',
        deleteSuccess: 'Silindi.',
        deleteError: 'Silme başarısız.',
        nameRequired: 'Cari adı zorunlu.',
        amountRequired: 'Geçerli tutar girin.',
        dateRequired: 'Tarih zorunlu.',
    },
    en: {
        sectionTitle: 'Accounts',
        navCari: 'Accounts & Income/Expense',
        screenTitle: 'Account ledger',
        screenSub: 'Receivables, payables and transaction history',
        loading: 'Loading…',
        empty: 'No accounts yet.',
        loadError: 'Failed to load accounts.',
        summaryGelir: 'Total income',
        summaryGider: 'Total expense',
        summaryBakiye: 'Net balance',
        summaryAlacak: 'Total receivable',
        summaryVerecek: 'Total payable',
        listTitle: 'Account list',
        addCari: 'New account',
        detailTitle: 'Account summary',
        transactionsTitle: 'Transaction history',
        addTxTitle: 'New transaction',
        selectHint: 'Select an account from the list or add a new one.',
        colName: 'Name',
        colPhone: 'Phone',
        colAlacak: 'Receivable',
        colVerecek: 'Payable',
        colDate: 'Date',
        colType: 'Type',
        colAmount: 'Amount',
        colDesc: 'Description',
        typeGelir: 'Income',
        typeGider: 'Expense',
        addIslem: 'Add transaction',
        name: 'Name',
        phone: 'Phone',
        email: 'Email',
        note: 'Note',
        amount: 'Amount',
        amountPlaceholder: '1500',
        description: 'Description',
        date: 'Date',
        save: 'Save',
        edit: 'Edit',
        cancel: 'Cancel',
        close: 'Close',
        backToList: 'Back to account list',
        delete: 'Delete',
        netBalance: 'Net balance',
        txCount: 'Transactions',
        txEmpty: 'No transactions for this account yet.',
        confirmDeleteCari: 'This account and all transactions will be deleted.',
        confirmDeleteIslem: 'Delete this transaction?',
        saveSuccess: 'Saved.',
        saveError: 'Save failed.',
        deleteSuccess: 'Deleted.',
        deleteError: 'Delete failed.',
        nameRequired: 'Name is required.',
        amountRequired: 'Enter a valid amount.',
        dateRequired: 'Date is required.',
    },
};

var mxAdminCariMounted = false;
var mxAdminCariState = {
    cariler: [],
    selectedId: null,
    islemler: [],
    summary: { gelir: 0, gider: 0, balance: 0 },
    loading: false,
    savingIslem: false,
    mode: 'none',
};

function mxAdminCariLang() {
    if (typeof mxAdminState !== 'undefined' && mxAdminState && mxAdminState.lang) {
        return mxAdminState.lang;
    }
    return 'tr';
}

function mxAdminCariT(key) {
    var lang = mxAdminCariLang();
    var dict = MXADMIN_CARI_I18N[lang] || MXADMIN_CARI_I18N.tr;
    return dict[key] !== undefined ? dict[key] : key;
}

function mxAdminCariEsc(str) {
    if (str == null) {
        return '';
    }
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function mxAdminCariAttr(str) {
    return mxAdminCariEsc(str).replace(/'/g, '&#39;');
}

function mxAdminCariToast(msg, isError) {
    if (typeof mxAdminToast === 'function') {
        mxAdminToast(msg, !!isError);
        return;
    }
    if (typeof Global_toast === 'function') {
        Global_toast(msg, !!isError);
    }
}

function mxAdminCariConfirm(message) {
    if (typeof mxAdminConfirmDelete === 'function') {
        return mxAdminConfirmDelete(message);
    }
    if (typeof Global_confirmDelete === 'function') {
        return Global_confirmDelete(message);
    }
    return Promise.resolve(false);
}

function mxAdminCariApi(method, path, body) {
    if (typeof mxAdminApiRequest !== 'function') {
        return Promise.reject({ code: 'NO_API' });
    }
    return mxAdminApiRequest(method, path, body);
}

function mxAdminCariUnwrap(resp) {
    if (typeof mxAdminUnwrapApiData === 'function') {
        return mxAdminUnwrapApiData(resp);
    }
    if (resp && resp.data !== undefined) {
        return resp.data;
    }
    return resp;
}

function mxAdminCariFormatMoney(num) {
    var n = Number(num);
    if (isNaN(n)) {
        return '0,00';
    }
    return n.toFixed(2).replace('.', ',');
}


function mxAdminCariParseAmount(raw) {
    if (raw == null) {
        return NaN;
    }
    var s = String(raw).trim();
    if (!s) {
        return NaN;
    }
    s = s.replace(/\s/g, '');
    if (s.indexOf(',') !== -1) {
        s = s.replace(/\./g, '');
        s = s.replace(',', '.');
    }
    var n = parseFloat(s);
    return isNaN(n) ? NaN : n;
}


function mxAdminCariSanitizeAmountRaw(raw) {
    var s = String(raw || '');
    var out = '';
    var sepUsed = false;
    var i;
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (c >= '0' && c <= '9') {
            out += c;
            continue;
        }
        if ((c === ',' || c === '.') && !sepUsed) {
            out += c;
            sepUsed = true;
        }
    }
    return out;
}

function mxAdminCariBindAmountInput(el) {
    if (!el) {
        return;
    }
    el.oninput = function () {
        var next = mxAdminCariSanitizeAmountRaw(el.value);
        if (el.value !== next) {
            el.value = next;
        }
    };
    el.onpaste = function (ev) {
        if (ev && ev.preventDefault) {
            ev.preventDefault();
        }
        var clip = ev && ev.clipboardData ? ev.clipboardData : window.clipboardData;
        var text = clip && clip.getData ? clip.getData('text') : '';
        el.value = mxAdminCariSanitizeAmountRaw(text);
    };
}

function mxAdminCariSplitBalance(balance) {
    var bal = Number(balance) || 0;
    return {
        alacak: bal > 0 ? bal : 0,
        verecek: bal < 0 ? Math.abs(bal) : 0,
    };
}

function mxAdminCariComputeTxSummary(islemler) {
    var gelir = 0;
    var gider = 0;
    var i;
    var rows = islemler || [];
    for (i = 0; i < rows.length; i++) {
        var amt = Number(rows[i].amount) || 0;
        if (rows[i].type === 'gelir') {
            gelir += amt;
        } else {
            gider += amt;
        }
    }
    return { gelir: gelir, gider: gider, count: rows.length };
}

function mxAdminCariTodayIsoDate() {
    var d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return (
        d.getFullYear() +
        '-' +
        (m < 10 ? '0' : '') +
        m +
        '-' +
        (day < 10 ? '0' : '') +
        day
    );
}

function mxAdminCariMountScreens() {
    var root = document.getElementById('mxadminScreenCari');
    if (!root) {
        return;
    }
    root.innerHTML =
        '<div class="mxadmin-screen-head">' +
        '<div class="mxadmin-cari-screen-head">' +
        '<h2 id="mxadminCariHead">' +
        mxAdminCariEsc(mxAdminCariT('screenTitle')) +
        '</h2>' +
        '<p class="mxadmin-cari-screen-sub" id="mxadminCariSub">' +
        mxAdminCariEsc(mxAdminCariT('screenSub')) +
        '</p>' +
        '</div>' +
        '</div>' +
        '<div id="mxadminCariBody" class="mxadmin-cari-body"></div>';
    mxAdminCariMounted = true;
}

function mxAdminCariRenderShell() {
    var body = document.getElementById('mxadminCariBody');
    if (!body) {
        return;
    }
    var html = '';
    html += '<div class="mxadmin-cari-summary">';
    html +=
        '<div class="mxadmin-cari-summary-card"><div class="mxadmin-cari-summary-label">' +
        mxAdminCariEsc(mxAdminCariT('summaryGelir')) +
        '</div><div class="mxadmin-cari-summary-value is-gelir" id="mxadminCariSumGelir">0,00</div></div>';
    html +=
        '<div class="mxadmin-cari-summary-card"><div class="mxadmin-cari-summary-label">' +
        mxAdminCariEsc(mxAdminCariT('summaryGider')) +
        '</div><div class="mxadmin-cari-summary-value is-gider" id="mxadminCariSumGider">0,00</div></div>';
    html +=
        '<div class="mxadmin-cari-summary-card"><div class="mxadmin-cari-summary-label">' +
        mxAdminCariEsc(mxAdminCariT('summaryAlacak')) +
        '</div><div class="mxadmin-cari-summary-value is-gelir" id="mxadminCariSumAlacak">0,00</div></div>';
    html +=
        '<div class="mxadmin-cari-summary-card"><div class="mxadmin-cari-summary-label">' +
        mxAdminCariEsc(mxAdminCariT('summaryVerecek')) +
        '</div><div class="mxadmin-cari-summary-value is-gider" id="mxadminCariSumVerecek">0,00</div></div>';
    html +=
        '<div class="mxadmin-cari-summary-card mxadmin-cari-summary-card--accent"><div class="mxadmin-cari-summary-label">' +
        mxAdminCariEsc(mxAdminCariT('summaryBakiye')) +
        '</div><div class="mxadmin-cari-summary-value" id="mxadminCariSumBakiye">0,00</div></div>';
    html += '</div>';

    html += '<div class="mxadmin-cari-main">';
    html += '<div class="mxadmin-cari-list-col">';
    html += '<div class="mxadmin-cari-table-panel">';
    html += '<div class="mxadmin-cari-panel-head">';
    html +=
        '<span class="mxadmin-cari-panel-title">' +
        mxAdminCariEsc(mxAdminCariT('listTitle')) +
        '</span>';
    html +=
        '<button type="button" class="btn-add" id="mxadminCariAddBtn">' +
        mxAdminCariEsc(mxAdminCariT('addCari')) +
        '</button>';
    html += '</div>';
    html += '<div class="mxadmin-cari-table-wrap">';
    html += '<table class="mxadmin-cari-table">';
    html += '<thead><tr>';
    html += '<th>' + mxAdminCariEsc(mxAdminCariT('colName')) + '</th>';
    html += '<th class="mxadmin-cari-col-hide-sm">' + mxAdminCariEsc(mxAdminCariT('colPhone')) + '</th>';
    html += '<th class="mxadmin-cari-col-num">' + mxAdminCariEsc(mxAdminCariT('colAlacak')) + '</th>';
    html += '<th class="mxadmin-cari-col-num">' + mxAdminCariEsc(mxAdminCariT('colVerecek')) + '</th>';
    html += '</tr></thead>';
    html += '<tbody id="mxadminCariTableBody"></tbody>';
    html += '</table>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="mxadmin-cari-detail-col">';
    html += '<div class="mxadmin-cari-detail-panel" id="mxadminCariDetail"></div>';
    html += '</div>';
    html += '</div>';

    body.innerHTML = html;

    var addBtn = document.getElementById('mxadminCariAddBtn');
    if (addBtn) {
        addBtn.onclick = function () {
            mxAdminCariShowAddCariForm();
        };
    }
    mxAdminCariApplyLayout();
}


function mxAdminCariApplyLayout() {
    var body = document.getElementById('mxadminCariBody');
    if (!body) {
        return;
    }
    var isFocus =
        mxAdminCariState.mode === 'detail' || mxAdminCariState.mode === 'add';
    if (isFocus) {
        body.classList.add('is-cari-focus');
    } else {
        body.classList.remove('is-cari-focus');
    }
    var panel = document.getElementById('mxadminCariDetail');
    if (panel) {
        if (isFocus) {
            panel.classList.add('is-open');
        } else {
            panel.classList.remove('is-open');
            panel.innerHTML = '';
        }
    }
}

function mxAdminCariBackToList() {
    mxAdminCariState.selectedId = null;
    mxAdminCariState.mode = 'none';
    mxAdminCariState.islemler = [];
    mxAdminCariApplyLayout();
    mxAdminCariRenderList();
}

function mxAdminCariUpdateSummaryUI() {
    var s = mxAdminCariState.summary || {};
    var cariler = mxAdminCariState.cariler || [];
    var totalAlacak = 0;
    var totalVerecek = 0;
    var i;
    for (i = 0; i < cariler.length; i++) {
        var split = mxAdminCariSplitBalance(cariler[i].balance);
        totalAlacak += split.alacak;
        totalVerecek += split.verecek;
    }
    var gelirEl = document.getElementById('mxadminCariSumGelir');
    var giderEl = document.getElementById('mxadminCariSumGider');
    var alacakEl = document.getElementById('mxadminCariSumAlacak');
    var verecekEl = document.getElementById('mxadminCariSumVerecek');
    var bakiyeEl = document.getElementById('mxadminCariSumBakiye');
    if (gelirEl) {
        gelirEl.textContent = mxAdminCariFormatMoney(s.gelir || 0);
    }
    if (giderEl) {
        giderEl.textContent = mxAdminCariFormatMoney(s.gider || 0);
    }
    if (alacakEl) {
        alacakEl.textContent = mxAdminCariFormatMoney(totalAlacak);
    }
    if (verecekEl) {
        verecekEl.textContent = mxAdminCariFormatMoney(totalVerecek);
    }
    if (bakiyeEl) {
        bakiyeEl.textContent = mxAdminCariFormatMoney(s.balance || 0);
        bakiyeEl.classList.remove('is-gelir', 'is-gider');
        if (Number(s.balance) > 0) {
            bakiyeEl.classList.add('is-gelir');
        } else if (Number(s.balance) < 0) {
            bakiyeEl.classList.add('is-gider');
        }
    }
}

function mxAdminCariRenderList() {
    var tbody = document.getElementById('mxadminCariTableBody');
    if (!tbody) {
        return;
    }
    var rows = mxAdminCariState.cariler || [];
    if (!rows.length) {
        tbody.innerHTML =
            '<tr><td colspan="4" class="mxadmin-cari-empty">' +
            mxAdminCariEsc(mxAdminCariT('empty')) +
            '</td></tr>';
        return;
    }
    var html = '';
    var i;
    for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        var split = mxAdminCariSplitBalance(row.balance);
        var active = mxAdminCariState.selectedId === row.id ? ' is-active' : '';
        html +=
            '<tr class="mxadmin-cari-table-row' +
            active +
            '" data-cari-id="' +
            row.id +
            '">';
        html +=
            '<td class="mxadmin-cari-table-name">' +
            '<span class="mxadmin-cari-table-name-text">' +
            mxAdminCariEsc(row.name || '') +
            '</span>' +
            (row.phone
                ? '<span class="mxadmin-cari-table-phone-sm">' + mxAdminCariEsc(row.phone) + '</span>'
                : '') +
            '</td>';
        html += '<td class="mxadmin-cari-col-hide-sm">' + mxAdminCariEsc(row.phone || '—') + '</td>';
        html +=
            '<td class="mxadmin-cari-col-num is-gelir">' +
            (split.alacak > 0 ? mxAdminCariFormatMoney(split.alacak) : '—') +
            '</td>';
        html +=
            '<td class="mxadmin-cari-col-num is-gider">' +
            (split.verecek > 0 ? mxAdminCariFormatMoney(split.verecek) : '—') +
            '</td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
    var trs = tbody.querySelectorAll('.mxadmin-cari-table-row[data-cari-id]');
    for (i = 0; i < trs.length; i++) {
        trs[i].onclick = function () {
            var id = parseInt(this.getAttribute('data-cari-id'), 10);
            mxAdminCariSelectCari(id);
        };
    }
}

function mxAdminCariFindCari(id) {
    var rows = mxAdminCariState.cariler || [];
    var want = id != null ? String(id) : '';
    var i;
    for (i = 0; i < rows.length; i++) {
        if (String(rows[i].id) === want) {
            return rows[i];
        }
    }
    return null;
}

function mxAdminCariRenderDetail() {
    var detail = document.getElementById('mxadminCariDetail');
    if (!detail) {
        return;
    }
    var cari = mxAdminCariFindCari(mxAdminCariState.selectedId);
    if (!cari || mxAdminCariState.mode !== 'detail') {
        if (mxAdminCariState.mode === 'add') {
            return;
        }
        detail.innerHTML = '';
        return;
    }

    var split = mxAdminCariSplitBalance(cari.balance);
    var txSum = mxAdminCariComputeTxSummary(mxAdminCariState.islemler);
    var netBal = Number(cari.balance) || 0;
    var netClass = netBal >= 0 ? 'is-gelir' : 'is-gider';

    var html = '';
    html += '<div class="mxadmin-cari-detail-hero">';
    html += '<div class="mxadmin-cari-detail-hero-top">';
    html += '<div class="mxadmin-cari-detail-hero-title">';
    html += '<span class="material-symbols-outlined">person</span>';
    html += '<div>';
    html += '<h3 class="mxadmin-cari-detail-name">' + mxAdminCariEsc(cari.name || '') + '</h3>';
    html += '<span class="mxadmin-cari-detail-meta">' + mxAdminCariEsc(mxAdminCariT('detailTitle')) + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="mxadmin-cari-detail-hero-actions">';
    html +=
        '<button type="button" class="mxadmin-cari-text-btn" id="mxadminCariEditBtn" title="' +
        mxAdminCariAttr(mxAdminCariT('edit')) +
        '"><span class="material-symbols-outlined">edit</span>' +
        mxAdminCariEsc(mxAdminCariT('edit')) +
        '</button>';
    html +=
        '<button type="button" class="mxadmin-cari-icon-btn mxadmin-cari-icon-btn-danger" id="mxadminCariDeleteBtn" title="' +
        mxAdminCariAttr(mxAdminCariT('delete')) +
        '"><span class="material-symbols-outlined">delete</span></button>';
    html +=
        '<button type="button" class="mxadmin-cari-text-btn" id="mxadminCariCloseBtn" title="' +
        mxAdminCariAttr(mxAdminCariT('backToList')) +
        '"><span class="material-symbols-outlined">arrow_back</span>' +
        mxAdminCariEsc(mxAdminCariT('backToList')) +
        '</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="mxadmin-cari-detail-stats">';
    html +=
        '<div class="mxadmin-cari-stat is-gelir" id="mxadminCariStatAlacak"><span class="mxadmin-cari-stat-label">' +
        mxAdminCariEsc(mxAdminCariT('colAlacak')) +
        '</span><span class="mxadmin-cari-stat-value">' +
        mxAdminCariFormatMoney(split.alacak) +
        '</span></div>';
    html +=
        '<div class="mxadmin-cari-stat is-gider" id="mxadminCariStatVerecek"><span class="mxadmin-cari-stat-label">' +
        mxAdminCariEsc(mxAdminCariT('colVerecek')) +
        '</span><span class="mxadmin-cari-stat-value">' +
        mxAdminCariFormatMoney(split.verecek) +
        '</span></div>';
    html +=
        '<div class="mxadmin-cari-stat ' +
        netClass +
        '" id="mxadminCariStatNet"><span class="mxadmin-cari-stat-label">' +
        mxAdminCariEsc(mxAdminCariT('netBalance')) +
        '</span><span class="mxadmin-cari-stat-value">' +
        mxAdminCariFormatMoney(netBal) +
        '</span></div>';
    html +=
        '<div class="mxadmin-cari-stat" id="mxadminCariStatTxCount"><span class="mxadmin-cari-stat-label">' +
        mxAdminCariEsc(mxAdminCariT('txCount')) +
        '</span><span class="mxadmin-cari-stat-value">' +
        String(txSum.count) +
        '</span></div>';
    html += '</div>';

    html += '<div class="mxadmin-cari-contact-chips" id="mxadminCariContactView">';
    if (cari.phone) {
        html +=
            '<span class="mxadmin-cari-chip"><span class="material-symbols-outlined">phone</span>' +
            mxAdminCariEsc(cari.phone) +
            '</span>';
    }
    if (cari.email) {
        html +=
            '<span class="mxadmin-cari-chip"><span class="material-symbols-outlined">mail</span>' +
            mxAdminCariEsc(cari.email) +
            '</span>';
    }
    if (cari.note) {
        html +=
            '<span class="mxadmin-cari-chip mxadmin-cari-chip--wide"><span class="material-symbols-outlined">notes</span>' +
            mxAdminCariEsc(cari.note) +
            '</span>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="mxadmin-cari-edit-form hidden" id="mxadminCariEditForm">';
    html += '<div class="mxadmin-cari-form-block">';
    html += '<div class="mxadmin-cari-form-block-title">' + mxAdminCariEsc(mxAdminCariT('edit')) + '</div>';
    html += '<div class="mxadmin-cari-form-grid">';
    html +=
        '<div class="mx-form-group"><input type="text" id="mxadminCariEditName" class="mx-input" value="' +
        mxAdminCariAttr(cari.name || '') +
        '" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('name')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="text" id="mxadminCariEditPhone" class="mx-input" value="' +
        mxAdminCariAttr(cari.phone || '') +
        '" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('phone')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="email" id="mxadminCariEditEmail" class="mx-input" value="' +
        mxAdminCariAttr(cari.email || '') +
        '" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('email')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="text" id="mxadminCariEditNote" class="mx-input" value="' +
        mxAdminCariAttr(cari.note || '') +
        '" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('note')) +
        '</label></div>';
    html += '</div>';
    html += '<div class="mxadmin-cari-form-actions">';
    html +=
        '<button type="button" class="btn-save" id="mxadminCariEditSave">' +
        mxAdminCariEsc(mxAdminCariT('save')) +
        '</button>';
    html +=
        '<button type="button" class="mxadmin-cari-text-btn" id="mxadminCariEditCancel">' +
        mxAdminCariEsc(mxAdminCariT('cancel')) +
        '</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="mxadmin-cari-tx-section">';
    html += '<div class="mxadmin-cari-tx-add">';
    html += '<div class="mxadmin-cari-form-block-title">' + mxAdminCariEsc(mxAdminCariT('addTxTitle')) + '</div>';
    html += '<div class="mxadmin-cari-form-grid mxadmin-cari-form-grid--tx">';
    html +=
        '<div class="mx-form-group mxadmin-cari-form-desc-top"><input type="text" id="mxadminCariIslemDesc" class="mx-input" autocomplete="off" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('description')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><select id="mxadminCariIslemType" class="mx-select"><option value="gelir">' +
        mxAdminCariEsc(mxAdminCariT('typeGelir')) +
        '</option><option value="gider">' +
        mxAdminCariEsc(mxAdminCariT('typeGider')) +
        '</option></select><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('colType')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="text" inputmode="decimal" id="mxadminCariIslemAmount" class="mx-input mxadmin-cari-amount-input" placeholder="' +
        mxAdminCariAttr(mxAdminCariT('amountPlaceholder')) +
        '" autocomplete="off" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('amount')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="date" id="mxadminCariIslemDate" class="mx-input" value="' +
        mxAdminCariAttr(mxAdminCariTodayIsoDate()) +
        '" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('date')) +
        '</label></div>';
    html += '</div>';
    html +=
        '<button type="button" class="btn-save mxadmin-cari-tx-add-btn" id="mxadminCariIslemSave">' +
        '<span class="material-symbols-outlined">add</span>' +
        mxAdminCariEsc(mxAdminCariT('addIslem')) +
        '</button>';
    html += '</div>';

    html += '<div class="mxadmin-cari-tx-list">';
    html += '<div class="mxadmin-cari-tx-list-head">' + mxAdminCariEsc(mxAdminCariT('transactionsTitle')) + '</div>';
    html += '<div class="mxadmin-cari-islem-table-wrap">';
    html += '<table class="mxadmin-cari-islem-table"><thead><tr>';
    html += '<th>' + mxAdminCariEsc(mxAdminCariT('colDate')) + '</th>';
    html += '<th>' + mxAdminCariEsc(mxAdminCariT('colType')) + '</th>';
    html += '<th>' + mxAdminCariEsc(mxAdminCariT('colDesc')) + '</th>';
    html += '<th class="mxadmin-cari-col-num">' + mxAdminCariEsc(mxAdminCariT('colAmount')) + '</th>';
    html += '<th class="mxadmin-cari-col-actions"></th>';
    html += '</tr></thead><tbody id="mxadminCariIslemRows"></tbody></table>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    detail.innerHTML = html;
    detail.classList.add('is-open');

    var editBtn = document.getElementById('mxadminCariEditBtn');
    if (editBtn) {
        editBtn.onclick = function () {
            mxAdminCariToggleEditForm(true);
        };
    }
    var editCancel = document.getElementById('mxadminCariEditCancel');
    if (editCancel) {
        editCancel.onclick = function () {
            mxAdminCariToggleEditForm(false);
        };
    }
    var editSave = document.getElementById('mxadminCariEditSave');
    if (editSave) {
        editSave.onclick = function () {
            mxAdminCariUpdateCari(cari.id);
        };
    }
    var delBtn = document.getElementById('mxadminCariDeleteBtn');
    if (delBtn) {
        delBtn.onclick = function () {
            mxAdminCariDeleteCari(cari.id);
        };
    }
    var closeBtn = document.getElementById('mxadminCariCloseBtn');
    if (closeBtn) {
        closeBtn.onclick = function () {
            mxAdminCariBackToList();
        };
    }
    var saveBtn = document.getElementById('mxadminCariIslemSave');
    if (saveBtn) {
        saveBtn.onclick = function () {
            mxAdminCariSaveIslem();
        };
    }
    mxAdminCariBindTxFormEnter();
    mxAdminCariBindAmountInput(document.getElementById('mxadminCariIslemAmount'));
    mxAdminCariRenderIslemRows();
}

function mxAdminCariBindTxFormEnter() {
    var ids = [
        'mxadminCariIslemDesc',
        'mxadminCariIslemAmount',
        'mxadminCariIslemDate',
    ];
    var handler = function (ev) {
        if (ev && ev.key === 'Enter') {
            ev.preventDefault();
            mxAdminCariSaveIslem();
        }
    };
    var i;
    for (i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el) {
            el.onkeydown = handler;
        }
    }
}

function mxAdminCariPatchDetailStats() {
    var cari = mxAdminCariFindCari(mxAdminCariState.selectedId);
    if (!cari) {
        return;
    }
    var split = mxAdminCariSplitBalance(cari.balance);
    var txSum = mxAdminCariComputeTxSummary(mxAdminCariState.islemler);
    var netBal = Number(cari.balance) || 0;
    var alacakEl = document.getElementById('mxadminCariStatAlacak');
    var verecekEl = document.getElementById('mxadminCariStatVerecek');
    var netEl = document.getElementById('mxadminCariStatNet');
    var txEl = document.getElementById('mxadminCariStatTxCount');
    if (alacakEl) {
        alacakEl.querySelector('.mxadmin-cari-stat-value').textContent =
            mxAdminCariFormatMoney(split.alacak);
    }
    if (verecekEl) {
        verecekEl.querySelector('.mxadmin-cari-stat-value').textContent =
            mxAdminCariFormatMoney(split.verecek);
    }
    if (netEl) {
        netEl.querySelector('.mxadmin-cari-stat-value').textContent =
            mxAdminCariFormatMoney(netBal);
        netEl.classList.remove('is-gelir', 'is-gider');
        if (netBal >= 0) {
            netEl.classList.add('is-gelir');
        } else {
            netEl.classList.add('is-gider');
        }
    }
    if (txEl) {
        txEl.querySelector('.mxadmin-cari-stat-value').textContent = String(txSum.count);
    }
}

function mxAdminCariToggleEditForm(show) {
    var form = document.getElementById('mxadminCariEditForm');
    var contact = document.getElementById('mxadminCariContactView');
    if (form) {
        if (show) {
            form.classList.remove('hidden');
        } else {
            form.classList.add('hidden');
        }
    }
    if (contact) {
        if (show) {
            contact.classList.add('hidden');
        } else {
            contact.classList.remove('hidden');
        }
    }
}

function mxAdminCariRenderIslemRows() {
    var tbody = document.getElementById('mxadminCariIslemRows');
    if (!tbody) {
        return;
    }
    var rows = mxAdminCariState.islemler || [];
    if (!rows.length) {
        tbody.innerHTML =
            '<tr><td colspan="5" class="mxadmin-cari-empty">' +
            mxAdminCariEsc(mxAdminCariT('txEmpty')) +
            '</td></tr>';
        return;
    }
    var html = '';
    var i;
    for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        var typeClass =
            row.type === 'gelir' ? 'mxadmin-cari-type-gelir' : 'mxadmin-cari-type-gider';
        var typeLabel =
            row.type === 'gelir'
                ? mxAdminCariT('typeGelir')
                : mxAdminCariT('typeGider');
        html += '<tr class="mxadmin-cari-islem-row">';
        html += '<td class="mxadmin-cari-islem-date">' + mxAdminCariEsc(row.tx_date || '') + '</td>';
        html +=
            '<td><span class="mxadmin-cari-type-pill ' +
            typeClass +
            '">' +
            mxAdminCariEsc(typeLabel) +
            '</span></td>';
        html += '<td>' + mxAdminCariEsc(row.description || '—') + '</td>';
        html +=
            '<td class="mxadmin-cari-col-num ' +
            typeClass +
            '">' +
            mxAdminCariFormatMoney(row.amount) +
            '</td>';
        html +=
            '<td class="mxadmin-cari-col-actions"><button type="button" class="mxadmin-cari-icon-btn mxadmin-cari-icon-btn-danger" data-islem-id="' +
            row.id +
            '" title="' +
            mxAdminCariAttr(mxAdminCariT('delete')) +
            '"><span class="material-symbols-outlined">delete</span></button></td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
    var btns = tbody.querySelectorAll('button[data-islem-id]');
    for (i = 0; i < btns.length; i++) {
        btns[i].onclick = function () {
            var islemId = parseInt(this.getAttribute('data-islem-id'), 10);
            mxAdminCariDeleteIslem(islemId);
        };
    }
}

function mxAdminCariShowAddCariForm() {
    var detail = document.getElementById('mxadminCariDetail');
    if (!detail) {
        return;
    }
    mxAdminCariState.mode = 'add';
    mxAdminCariState.selectedId = null;
    mxAdminCariApplyLayout();
    mxAdminCariRenderList();

    var html = '';
    html += '<div class="mxadmin-cari-detail-hero mxadmin-cari-detail-hero--form">';
    html += '<div class="mxadmin-cari-detail-hero-top">';
    html +=
        '<div class="mxadmin-cari-detail-hero-title"><span class="material-symbols-outlined">person_add</span><div><h3 class="mxadmin-cari-detail-name">' +
        mxAdminCariEsc(mxAdminCariT('addCari')) +
        '</h3></div></div>';
    html +=
        '<button type="button" class="mxadmin-cari-text-btn" id="mxadminCariAddCancel">' +
        mxAdminCariEsc(mxAdminCariT('cancel')) +
        '</button>';
    html += '</div>';
    html += '<div class="mxadmin-cari-form-block">';
    html += '<div class="mxadmin-cari-form-grid">';
    html +=
        '<div class="mx-form-group"><input type="text" id="mxadminCariNewName" class="mx-input" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('name')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="text" id="mxadminCariNewPhone" class="mx-input" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('phone')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="email" id="mxadminCariNewEmail" class="mx-input" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('email')) +
        '</label></div>';
    html +=
        '<div class="mx-form-group"><input type="text" id="mxadminCariNewNote" class="mx-input" /><label class="mx-form-label">' +
        mxAdminCariEsc(mxAdminCariT('note')) +
        '</label></div>';
    html += '</div>';
    html +=
        '<button type="button" class="btn-save" id="mxadminCariNewSave">' +
        mxAdminCariEsc(mxAdminCariT('save')) +
        '</button>';
    html += '</div>';
    html += '</div>';
    detail.innerHTML = html;

    var cancelBtn = document.getElementById('mxadminCariAddCancel');
    if (cancelBtn) {
        cancelBtn.onclick = function () {
            mxAdminCariBackToList();
        };
    }
    var saveBtn = document.getElementById('mxadminCariNewSave');
    if (saveBtn) {
        saveBtn.onclick = function () {
            mxAdminCariCreateCari();
        };
    }
    var nameEl = document.getElementById('mxadminCariNewName');
    if (nameEl) {
        nameEl.focus();
    }
}

function mxAdminCariLoadAll(done) {
    mxAdminCariState.loading = true;
    return mxAdminCariApi('GET', '/api/admin/cari')
        .then(function (resp) {
            var data = mxAdminCariUnwrap(resp) || {};
            mxAdminCariState.cariler = data.cariler || [];
            mxAdminCariState.summary = data.summary || {
                gelir: 0,
                gider: 0,
                balance: 0,
            };
            mxAdminCariUpdateSummaryUI();
            mxAdminCariRenderList();
            if (
                mxAdminCariState.mode === 'detail' &&
                mxAdminCariState.selectedId &&
                mxAdminCariFindCari(mxAdminCariState.selectedId)
            ) {
                mxAdminCariApplyLayout();
                mxAdminCariRenderDetail();
                mxAdminCariPatchDetailStats();
                mxAdminCariRenderIslemRows();
            }
        })
        .catch(function () {
            mxAdminCariToast(mxAdminCariT('loadError'), true);
        })
        .then(function () {
            mxAdminCariState.loading = false;
            if (typeof done === 'function') {
                done();
            }
        });
}

function mxAdminCariSelectCari(id) {
    mxAdminCariState.selectedId = id;
    mxAdminCariState.mode = 'detail';
    mxAdminCariApplyLayout();
    mxAdminCariRenderList();
    mxAdminCariRenderDetail();
    mxAdminCariLoadIslemler(id);
}

function mxAdminCariLoadIslemler(cariId) {
    mxAdminCariApi(
        'GET',
        '/api/admin/cari/islemler?cari_id=' + encodeURIComponent(String(cariId)),
    )
        .then(function (resp) {
            var data = mxAdminCariUnwrap(resp) || {};
            mxAdminCariState.islemler = data.islemler || data || [];
            if (!Array.isArray(mxAdminCariState.islemler)) {
                mxAdminCariState.islemler = [];
            }
            mxAdminCariRenderIslemRows();
            mxAdminCariPatchDetailStats();
        })
        .catch(function () {
            mxAdminCariToast(mxAdminCariT('loadError'), true);
        });
}

function mxAdminCariCreateCari() {
    var nameEl = document.getElementById('mxadminCariNewName');
    var phoneEl = document.getElementById('mxadminCariNewPhone');
    var emailEl = document.getElementById('mxadminCariNewEmail');
    var noteEl = document.getElementById('mxadminCariNewNote');
    var name = nameEl ? String(nameEl.value || '').trim() : '';
    if (!name) {
        mxAdminCariToast(mxAdminCariT('nameRequired'), true);
        return;
    }
    mxAdminCariApi('POST', '/api/admin/cari', {
        name: name,
        phone: phoneEl ? String(phoneEl.value || '').trim() : '',
        email: emailEl ? String(emailEl.value || '').trim() : '',
        note: noteEl ? String(noteEl.value || '').trim() : '',
    })
        .then(function (resp) {
            var data = mxAdminCariUnwrap(resp) || {};
            mxAdminCariToast(mxAdminCariT('saveSuccess'), false);
            mxAdminCariState.mode = 'detail';
            var newId = data && data.id != null ? data.id : null;
            mxAdminCariLoadAll(function () {
                if (newId != null) {
                    mxAdminCariSelectCari(newId);
                }
            });
        })
        .catch(function () {
            mxAdminCariToast(mxAdminCariT('saveError'), true);
        });
}

function mxAdminCariUpdateCari(cariId) {
    var nameEl = document.getElementById('mxadminCariEditName');
    var phoneEl = document.getElementById('mxadminCariEditPhone');
    var emailEl = document.getElementById('mxadminCariEditEmail');
    var noteEl = document.getElementById('mxadminCariEditNote');
    var name = nameEl ? String(nameEl.value || '').trim() : '';
    if (!name) {
        mxAdminCariToast(mxAdminCariT('nameRequired'), true);
        return;
    }
    mxAdminCariApi('PATCH', '/api/admin/cari/' + cariId, {
        name: name,
        phone: phoneEl ? String(phoneEl.value || '').trim() : '',
        email: emailEl ? String(emailEl.value || '').trim() : '',
        note: noteEl ? String(noteEl.value || '').trim() : '',
    })
        .then(function () {
            mxAdminCariToast(mxAdminCariT('saveSuccess'), false);
            mxAdminCariLoadAll();
            mxAdminCariSelectCari(cariId);
        })
        .catch(function () {
            mxAdminCariToast(mxAdminCariT('saveError'), true);
        });
}

function mxAdminCariSaveIslem() {
    var cariId = mxAdminCariState.selectedId;
    if (!cariId) {
        mxAdminCariToast(mxAdminCariT('selectHint'), true);
        return;
    }
    if (mxAdminCariState.savingIslem) {
        return;
    }
    var typeEl = document.getElementById('mxadminCariIslemType');
    var amountEl = document.getElementById('mxadminCariIslemAmount');
    var dateEl = document.getElementById('mxadminCariIslemDate');
    var descEl = document.getElementById('mxadminCariIslemDesc');
    var amount = amountEl ? mxAdminCariParseAmount(amountEl.value) : NaN;
    var txDate = dateEl ? String(dateEl.value || '').trim() : '';
    if (isNaN(amount) || amount <= 0) {
        mxAdminCariToast(mxAdminCariT('amountRequired'), true);
        if (amountEl) {
            amountEl.focus();
        }
        return;
    }
    if (!txDate) {
        mxAdminCariToast(mxAdminCariT('dateRequired'), true);
        if (dateEl) {
            dateEl.focus();
        }
        return;
    }
    var saveBtn = document.getElementById('mxadminCariIslemSave');
    mxAdminCariState.savingIslem = true;
    if (saveBtn) {
        saveBtn.disabled = true;
    }
    mxAdminCariApi('POST', '/api/admin/cari/islemler', {
        cari_id: cariId,
        type: typeEl ? typeEl.value : 'gelir',
        amount: amount,
        tx_date: txDate,
        description: descEl ? String(descEl.value || '').trim() : '',
    })
        .then(function () {
            mxAdminCariToast(mxAdminCariT('saveSuccess'), false);
            if (amountEl) {
                amountEl.value = '';
            }
            if (descEl) {
                descEl.value = '';
            }
            mxAdminCariLoadAll(function () {
                mxAdminCariLoadIslemler(cariId);
            });
        })
        .catch(function (err) {
            var msg =
                typeof mxAdminApiErrorMessage === 'function'
                    ? mxAdminApiErrorMessage(err)
                    : mxAdminCariT('saveError');
            mxAdminCariToast(msg, true);
        })
        .then(function () {
            mxAdminCariState.savingIslem = false;
            if (saveBtn) {
                saveBtn.disabled = false;
            }
        });
}

function mxAdminCariDeleteCari(cariId) {
    mxAdminCariConfirm(mxAdminCariT('confirmDeleteCari')).then(function (ok) {
        if (!ok) {
            return;
        }
        mxAdminCariApi('DELETE', '/api/admin/cari/' + cariId)
            .then(function () {
                mxAdminCariToast(mxAdminCariT('deleteSuccess'), false);
                mxAdminCariState.selectedId = null;
                mxAdminCariState.mode = 'none';
                mxAdminCariState.islemler = [];
                mxAdminCariLoadAll();
                mxAdminCariApplyLayout();
            })
            .catch(function () {
                mxAdminCariToast(mxAdminCariT('deleteError'), true);
            });
    });
}

function mxAdminCariDeleteIslem(islemId) {
    mxAdminCariConfirm(mxAdminCariT('confirmDeleteIslem')).then(function (ok) {
        if (!ok) {
            return;
        }
        var cariId = mxAdminCariState.selectedId;
        mxAdminCariApi('DELETE', '/api/admin/cari/islemler/' + islemId)
            .then(function () {
                mxAdminCariToast(mxAdminCariT('deleteSuccess'), false);
                mxAdminCariLoadAll();
                if (cariId) {
                    mxAdminCariLoadIslemler(cariId);
                }
            })
            .catch(function () {
                mxAdminCariToast(mxAdminCariT('deleteError'), true);
            });
    });
}

function mxAdminCariRefreshUi() {
    var head = document.getElementById('mxadminCariHead');
    if (head) {
        head.textContent = mxAdminCariT('screenTitle');
    }
    var sub = document.getElementById('mxadminCariSub');
    if (sub) {
        sub.textContent = mxAdminCariT('screenSub');
    }
}

function mxAdminCariPackShowScreen(name) {
    if (name !== 'cari') {
        return false;
    }
    if (!mxAdminCariMounted) {
        mxAdminCariMountScreens();
    }
    
    mxAdminCariState.selectedId = null;
    mxAdminCariState.mode = 'none';
    mxAdminCariState.islemler = [];
    mxAdminCariRenderShell();
    mxAdminCariLoadAll();
    return true;
}

function mxAdminCariPackInit(api) {
    mxAdminCariMountScreens();
    if (api && typeof api.onReady === 'function') {
        api.onReady();
    }
}

function mxAdminCariBuildNav(host) {
    if (!host) {
        return;
    }
    var section = document.createElement('div');
    section.className = 'mxadmin-sidebar-section';
    section.id = 'mxadminModuleNavCari';
    section.setAttribute('data-mxadmin-module', 'cari');

    var head = document.createElement('div');
    head.className = 'mxadmin-sidebar-section-head';
    var title = document.createElement('span');
    title.textContent = mxAdminCariT('sectionTitle');
    head.appendChild(title);
    section.appendChild(head);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mxadmin-nav-btn';
    btn.setAttribute('data-mxadmin-screen', 'cari');
    btn.innerHTML =
        '<span class="material-symbols-outlined">account_balance_wallet</span>' +
        '<span>' +
        mxAdminCariEsc(mxAdminCariT('navCari')) +
        '</span>';
    section.appendChild(btn);
    host.appendChild(section);
}

if (typeof mxAdminModuleRegister === 'function') {
    mxAdminModuleRegister({
        id: 'cari',
        init: mxAdminCariPackInit,
        buildNav: mxAdminCariBuildNav,
        showScreen: mxAdminCariPackShowScreen,
        screens: {
            cari: 'mxadminScreenCari',
        },
    });
}
