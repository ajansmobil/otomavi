# Paket 13 — Kategori ürünlerini sitede göster + iç sayfa modülü yeniden tasarım

## Rol
1) **Yeni/yeniden iç sayfa modülü:** cwd `D:\matrix` — `webmodules/mantik/rust.md` W1/W2 + `D:\projeler\elo\web\talimatlar\web\webmodule\webmodule-gelistirme.md`
2) **Site bağlama:** cwd `D:\projeler\otomavi\Web\matrix`

Marka: Oto Mavi · palet `#0B3A6E` `#02427A` `#E9F3FB` · WhatsApp `905447171828` · tel `0544 717 18 28`  
`eticaret: false`

## Sorun (mevcut durum — doğrulandı)
- `products.json`: **14 üst + 43 ürün**; imgs hepsi var (57/57).
- Üst kategori body: `["tp5jo4","t1pc03"]` — `tp5jo4` = eski `page-desing-5`.
- Ürün satırları: `desing` yok / body `[]` → ürün detayda kategori grid yok; iç sayfa deneyimi zayıf.
- Kök `products.json` desing.body: `["tp5jo4"]`.
- `t1pc03` (page-category-3) zaten Oto Mavi renklerinde.

## A) Yeni body modül — `page-desing-otomavi` (zorunlu)

**Path:** `D:\matrix\webmodules\body\page-desing-otomavi\`  
Dosyalar: `index.html` + `index.json` + `back.js`  
Katalog: `webmodules/body/index.json` kaydı ekle (path=`page-desing-otomavi`, category=`page`).

**Global `page-desing-5` / `tp5jo4` klasörünü BOZMA** — yeni şablon Oto Mavi’ye özel.

### UI (tek kompozisyon, marka renkleri)
1. **Üst:** breadcrumb — Ürünler → Kategori → (ürün ise) Ürün
2. **Hero satırı:** sol büyük görsel `/page/{id}/{img}` (fallback `index.webp`); sağ: H1 başlık, kategori rozeti, kısa `description`, WhatsApp + Ara CTA
3. **Gövde:** `{{text}}` zengin içerik (HTML ise olduğu gibi; düz metinse `<p>`); okunaklı tipografi, max-width ~720–800px
4. **Alt — ürün detayda:** aynı parent `category` id ile `products.data` filtre → “Benzer parçalar” kart grid (img+name+link); kendisini hariç tut
5. **Kategori sayfasında:** hero + text; asıl alt ürün grid’i site tarafında `t1pc03` ile gelir — bu modülde opsiyonel özet olabilir, zorunlu değil

### W1 / W2
- Sabit TR yasak — tüm UI metinleri `desing` dil objeleri: `ctaWhatsapp`, `ctaCall`, `relatedTitle`, `breadcrumbHome` / `breadcrumbProducts`, `categoryBadgeFallback`, `ariaBreadcrumb`, …
- Animasyon (`@keyframes` veya `transition` ≥0.2s) + `@media (max-width:768px)` + `prefers-reduced-motion` + `cursor:pointer` CTA’larda
- Renkler `--key--` desing token: `bgcolor`, `accent`, `titlecolor`, `textcolor`, `badgebg`, `btnWhatsappBg`, `btnCallBg`, `max`, `radius`
- Varsayılan desing değerleri Oto Mavi paleti

### back.js kuralları
- Yalnızca `var` — `let`/`const`/arrow/`for...of`/`forEach` arrow yasak; klasik `for` döngüsü
- Dil fallback helper (pd2Lang tarzı): `lang → tr → ilk anahtar → ""`
- `page.categorypage` / `webmakerdata.products` (veya `webmakerdata[page.categorypage]`) ile menü + breadcrumb + related
- Üst kategori mi ürün mü: `!page.category || page.category === ""` → kategori; dolu → ürün detay
- CTA: `https://wa.me/905447171828?text=` + encodeURIComponent(ürün/kategori adı mesajı); `tel:05447171828`
- `whatsapp` / `phone` desing’den override edilebilir (varsayılan yukarıdaki numaralar)
- Placeholder replace: `{{text}}`, `{{breadcrumb}}`, `{{hero}}` veya parçalı `{{heroImg}}`/`{{heroMeta}}`, `{{related}}` — HTML şablonunda ne kullanırsan back.js doldursun
- Referans mantık (kopyala-uyarla, global bozma): `webmodules/body/page-desing-5/back.js` (breadcrumb, categorypage, wa.me)

### index.html
- Kök `class="modulex"`
- CSS `.modulex` scoped
- `_shared/` yok

## B) Oto Mavi bağlama — `D:\projeler\otomavi\Web\matrix`

1. **`modules.json`:** yeni kayıt id=`t1pd01`, path=`page-desing-otomavi`, local=`body`, category=`page`  
   desing token’ları Oto Mavi (`#0B3A6E`, `#02427A`, `#E9F3FB`, whatsapp `905447171828`, phone `05447171828` + dil objeleri)
2. **14 üst kategori** (`category === ""`): `desing.body` = `["t1pd01","t1pc03"]`  
   (önce iç sayfa, sonra ürün kart grid — 43 ürün görünür)
3. **43 ürün** (`category` dolu): `desing.body` = `["t1pd01"]` — `products.json` liste satırına yaz (page detail’de desing yoksa liste birleşimi yeterli; gerekirse page/*/index.json’a da yazma — tutarlı olsun)
4. **`products.json` kök** `desing.body` = `["t1pd01","t1plpr"]` (ürünler hub: yeni iç sayfa + üst kategori listesi)
5. **`t1pc03`:** renkler zaten lacivert — kontrol et; gerekirse pekiştir (`bgcolor`/`colortitle`/`coloractive`)
6. **Eski `tp5jo4`:** ürün/kategori/kök body dizilerinden çıkar; modül kaydı `modules.json`’da kalabilir (silme) ama kullanılmasın
7. **`pagesetting.json`:** ürünler sayfası body varsa aynı mantıkla güncelle

## C) Görseller
57/57 `page/*/index.webp` mevcut — hero kırık olmamalı. Eksik görürsen kategori görselinden kopyala.

## D) Render (mümkünse)
Matrix açıksa: `POST http://localhost/webmaker/services/webmaker/` body `{ "path": "otomavi" }` veya projedeki kanonik render uç.  
Açıksa değilse `13_run.log`’a “render atlandı — Matrix kapalı” yaz.

## E) ELO (opsiyonel kısa)
`D:\projeler\elo\web\talimatlar\web\` altında `karar-agaci` varsa: iç sayfa → `page-desing-otomavi`; kategori → + `page-category-3` notu. Yoksa atla.

## Yasaklar
- Sepet / `eticaret: true`
- Global `page-desing-5` içeriğini tüm projeler için bozma
- Commit / push yok
- `_shared/` yok
- `let` / `const` / arrow function (back.js)

## Doğrulama (zorunlu — bitiş şartı)
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```
Şart: **hata=0** (mümkünse uyarı=0).

Ek kontrol (node one-liner veya script):
- 14 üst: body `["t1pd01","t1pc03"]`
- 43 ürün: body `["t1pd01"]`
- kök body `t1pd01` içerir, `tp5jo4` içermez
- `webmodules/body/page-desing-otomavi/` üç dosya var
- `webmodules/body/index.json` içinde `page-desing-otomavi` kaydı
- İsteğe bağlı: `node webmodules/test/run.js` — arac-parca-arama / mevcut testler kırılmasın

## Çıktı
Her iki yere de yaz (aynı içerik):
- `D:\matrix\data\yonetici\13_run.log`
- `D:\projeler\otomavi\Web\matrix\data\yonetici\13_run.log`

Log içeriği: yeni modül path, kaç kategori/ürüne bağlandı, dogrula özeti (hata/uyarı), render durumu.
