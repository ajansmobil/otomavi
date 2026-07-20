# Paket 23 — Ürün liste sayfası (sidebar + grid, Oto Mavi)

rol: web  
cwd: `D:\matrix` (yeni modül) + `D:\projeler\otomavi\Web\matrix` (bağlama)  
Referans UI: Magento-benzeri sol filtre + ürün kart grid — **lacivert Oto Mavi** (turuncu yok)  
**Kritik:** `eticaret:false` · **Sepet / Sepete Ekle / fiyat zorunlu değil** · CTA = WhatsApp / detay link  
Palet: `#0B3A6E` `#02427A` `#E9F3FB` `#F5F8FC` `#FFFFFF` · WA `905447171828`  
Render: `{"path":"otomavi","mode":"matrix"}`

## Amaç

Kategori sayfası (ör. `/tr/filtreler/`) Magento-benzeri **liste düzeni** alsın:
- Sol: kategorilere göre alışveriş (sidebar)
- Üstte ayrı `t1af01` arama (Tercih A — bu modülde YMM yok)
- Sağ: ürün kart grid (görsel + ad + kısa desc + “Teklif Al / İncele”)

Fiyat slider / brand checkbox **YOK** (ürünlerde `price`/`brand` yok; uydurma R15 alanı ekleme).

---

## A) Yeni modül — `urun-liste-otomavi`

Path: `D:\matrix\webmodules\body\urun-liste-otomavi\`  
Dosyalar: `index.html` + `index.json` + `back.js`  
Katalog: `webmodules/body/index.json` kaydı (`category`: `page-category` veya `shop`, tags: otomavi, liste).

### Referans stil
- `webmodules/body/page-list-otomavi/` (var/for, ploPickLang, W1/W2, Oto Mavi palet)
- `webmodules/body/page-category-3/back.js` (products + `category == page.id`)

### Layout (zorunlu HTML iskeleti)

```html
<div class="modulex">
  <div class="modulex-inner">
    <aside class="modulex-sidebar">
      <h2 class="modulex-sidebar-title">{{sidebarTitle}}</h2>
      <nav class="modulex-sidebar-nav">{{sidebar}}</nav>
    </aside>
    <div class="modulex-main">
      <div class="modulex-toolbar">
        <span class="modulex-results">{{resultsLabel}} <strong class="modulex-count">{{count}}</strong></span>
        <label class="modulex-sort-wrap">
          <span class="modulex-sort-label">{{sortLabel}}</span>
          <select class="modulex-sort" data-ulo-sort>
            <option value="az">{{sortAz}}</option>
            <option value="za">{{sortZa}}</option>
          </select>
        </label>
      </div>
      <div class="modulex-grid" data-ulo-grid>{{html}}</div>
      <p class="modulex-empty" data-ulo-empty hidden>{{emptyText}}</p>
    </div>
  </div>
</div>
```

CSS: 2 kolon layout (sidebar ~240–280px + main 1fr); grid 3–4 kolon desktop / 2 mobil.  
Token: `--bg--`, `--sidebarBg--`, `--accent--`, `--cardRadius--`, `--whatsapp--`, `--titlecolor--`, `--textcolor--`, `--cardbg--`, `--bordercolor--`.  
W2: transition ≥0.2s, `@media max-width 768px` (sidebar üste accordion veya yatay chip), `prefers-reduced-motion`, `cursor:pointer` link/CTA.

### Sidebar (back.js → `{{sidebar}}`)
- Başlık: `desing.sidebarTitle` `{tr,en}`
- Kaynak: `webmakerdata.category.data` → `status==play` && `category==""`
- Her satır: `<a class="modulex-cat" href="wxLangInternalHref(path)">name</a>`
- Aktif: `iterator.id == page.id` → `is-active` sınıfı
- Üstte “Tüm kategoriler”: `desing.allCategoriesUrl` (örn. `/tr/urunler/` veya path `urunler`) + `allCategoriesLabel`
- Fiyat / marka / material blokları **YOK**

### Toolbar
- `resultsLabel` + ürün sayısı (`{{count}}`)
- Sıralama select: A-Z / Z-A — metinler desing W1 (`sortLabel`, `sortAz`, `sortZa`)
- İstemci JS (inline `<script>` veya back.js sonu): `data-ulo-sort` change → grid kartlarını ada göre yeniden sırala (yalnız `var`, arrow yok)

### Ürün grid (back.js → `{{html}}`)
- Kaynak: `webmakerdata.products.data` (veya `json.desing.page` varsayılan `"products"`) where `category == page.id` && `status==play`
- Kart HTML:
  - img `/page/{id}/{img}`
  - name (lang zinciri)
  - description max 2 satır (CSS `-webkit-line-clamp: 2`)
  - CTA1: detay link `İncele` (`ctaView` desing)
  - CTA2: `https://wa.me/905447171828?text=...` encodeURIComponent ürün adı (`ctaQuote` desing) — **Sepete Ekle yasak**, `data-mx-*` / addToCart yok
- Boş: `emptyText`; count=0 ise empty göster

### index.json desing (örnek değerler)

```json
{
  "name": "Oto Mavi Ürün Liste (sidebar+grid)",
  "desing": {
    "page": "products",
    "sidebarTitle": { "tr": "Kategorilere Göre", "en": "Shop by Category" },
    "allCategoriesLabel": { "tr": "Tüm kategoriler", "en": "All categories" },
    "allCategoriesUrl": "/tr/urunler/",
    "resultsLabel": { "tr": "Sonuç:", "en": "Results:" },
    "sortLabel": { "tr": "Sırala", "en": "Sort" },
    "sortAz": { "tr": "Ada göre A-Z", "en": "Name A-Z" },
    "sortZa": { "tr": "Ada göre Z-A", "en": "Name Z-A" },
    "ctaView": { "tr": "İncele", "en": "View" },
    "ctaQuote": { "tr": "Teklif Al", "en": "Get Quote" },
    "emptyText": { "tr": "Bu kategoride ürün bulunamadı.", "en": "No products in this category." },
    "waTextPrefix": { "tr": "Merhaba Oto Mavi, şu ürün için teklif almak istiyorum:", "en": "Hi Oto Mavi, I'd like a quote for:" },
    "whatsapp": "905447171828",
    "bg": "#F5F8FC",
    "sidebarBg": "#FFFFFF",
    "accent": "#02427A",
    "titlecolor": "#0B3A6E",
    "textcolor": "#1e3046",
    "cardbg": "#FFFFFF",
    "bordercolor": "rgba(11,58,110,0.12)",
    "cardRadius": "14px",
    "max": "1200px",
    "margin": "16px 0px 40px 0px"
  },
  "category": "page-category",
  "description": "Oto Mavi kategori detay: sol sidebar kategori linkleri + sağ ürün kart grid. Sepet yok; CTA İncele + WhatsApp Teklif Al."
}
```

### Teknik kısıt
- back.js: yalnız `var`, klasik `for`, W1/W2
- Sabit UI metni yok — hepsi desing `{tr,en}`
- `_shared/` yasak
- Hardcoded Magento turuncu yasak

---

## B) Oto Mavi bağlama (`D:\projeler\otomavi\Web\matrix`)

1. **modules.json**: yeni kayıt `id: t1ulo01`, `path: urun-liste-otomavi`, `local: body`, `category: page-category`  
   desing yukarıdaki token’larla (page: `"products"`). Index uygun sıraya ekle.

2. **Tüm üst kategoriler** (`category.json` `data[]` where `category==""`):  
   `desing.body` = `["t1af01","t1ulo01"]`  
   Eski `t1pd01` ve `t1pc03` **çıkar** (tercih: temiz shop; hero yok).  
   Kök `category.json` `desing.body` / pagesetting category kök aynıysa güncelle.

3. **Senkron:** her üst kategori için `page/<kategori-id>/index.json` içinde `desing.body` varsa aynı `[t1af01,t1ulo01]` yap (kırık senkron engelle).

4. `t1pc03` modules’ta kalabilir; body’den çıkınca kullanılmaz.

5. **`.cursorrules`** güncelle:
   - Kategori detay body: `t1af01 + t1ulo01` (path `urun-liste-otomavi`)
   - Eski `t1pc03` / `[t1pd01,t1pc03]` notunu güncelle
   - Sepet / Sepete Ekle yok notu koru
   - CLAUDE.md varsa aynı satırı senkronla (proje web kökü)

6. **webmodules/mantik/mantik.md** (veya plan): kısa not — `urun-liste-otomavi` eklendi.

---

## C) Render + doğrula + kanıt

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi","mode":"matrix"}' | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 D:\projeler\otomavi\Web\matrix\data\yonetici\23_render.json

node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli | Tee-Object -FilePath D:\projeler\otomavi\Web\matrix\data\yonetici\23_dogrula.txt
```

Manuel / HTML spot-check (render çıktı veya canlı):
- `/tr/filtreler/` → sol kategoriler, sağ ürün kartları
- WhatsApp `wa.me/905447171828` var
- “Sepete Ekle” / “sepet” metni **yok**
- Magento turuncu yok

**Kanıt dosyası:** `D:\projeler\otomavi\Web\matrix\data\yonetici\23_run.log`  
(ve kopya: `D:\matrix\data\yonetici\23_run.log` — özet aynı)

İçerik: değişiklik listesi + render status/renderId + dogrula hata=0 + Sepete Ekle yok kanıtı.

---

## Yasak

- `eticaret:true` / Sepete Ekle / sahte price alanı R15’e ekleme
- Magento turuncu tema
- Commit / push yok
- `_shared/` · arrow / `let` / `const` back.js

## DONE kriterleri

- [ ] `webmodules/body/urun-liste-otomavi/` (html+json+back.js) + katalog kaydı
- [ ] Üst kategoriler body = `[t1af01,t1ulo01]`
- [ ] modules.json `t1ulo01`
- [ ] `.cursorrules` güncel
- [ ] dogrula hata=0 · render mode matrix ok
- [ ] Sepet metni yok · WhatsApp CTA var
- [ ] `23_run.log` yazıldı
