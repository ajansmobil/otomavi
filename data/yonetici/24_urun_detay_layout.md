# Paket 24 — Ürün detay sayfası (galeri + özet + bilgi paneli)

rol: web  
cwd: `D:\matrix` (modül) + `D:\projeler\otomavi\Web\matrix` (bağlama)  
Referans: kullanıcı Magento PDP ekranı (breadcrumb · görsel · başlık/SKU/CTA · sağ accordion · alt açıklama)  
**Kritik:** `eticaret:false` · **Sepete Ekle / fiyat / adet seçici YOK** · CTA = WhatsApp Teklif Al + Ara  
Palet: `#0B3A6E` `#02427A` `#E9F3FB` `#F5F8FC` · WA `905447171828` · tel `05447171828`  
Render: `{"path":"otomavi","mode":"matrix"}`

## Amaç

Ürün detay (`/tr/yakit-filtresi/` vb.) Magento-benzeri **3 kolon PDP** alsın; turuncu tema/sepet kopyalanmaz.

```
Breadcrumb
┌──────────┬─────────────────┬──────────────────┐
│ Görsel   │ Rozet+Başlık    │ Ürün bilgisi ▼   │
│          │ Kısa desc       │ Özellikler ▼     │
│          │ [Teklif Al WA]  │                  │
│          │ [Ara]           │                  │
│          │ Kategoriler: …  │                  │
└──────────┴─────────────────┴──────────────────┘
Açıklama (page.text)
Benzer parçalar (aynı category)
```

## A) Yeni modül — `urun-detay-otomavi`

Path: `D:\matrix\webmodules\body\urun-detay-otomavi\`  
`index.html` + `index.json` + `back.js`  
Katalog: `webmodules/body/index.json` (`category`: `page` veya `shop`)

### back.js kuralları
- Yalnız `var` / klasik `for` · W1 metinler desing `{tr,en}`
- Breadcrumb: Anasayfa → Ürünler → parent kategori → ürün
- Parent: `webmakerdata.category.data` id==`page.category`
- Görsel: `page.img` yok/boş/placeholder ise media basma (Paket 22 kuralı)
- SKU satırı: `page.path` göster (etiket desing `skuLabel`) — sahte OEM uydurma
- Ürün bilgisi satırları (mevcut veri): Kategori, Path/kod, Icon (varsa), Update tarihi
- Özellikler: `page.description` cümlelerini `;` / `.` ile bölüp max 5 madde (checkmark) — boşsa paneli gizle
- CTA: wa.me + tel — **Sepete Ekle / addToCart / mxCart yasak**
- Related: products aynı category, id≠page.id, status=play
- Global `page-desing-otomavi` / `page-desing-5` dokunma

### UI
- Lacivert CTA (turuncu Magento yok)
- Accordion: click toggle, `aria-expanded`, prefers-reduced-motion
- Mobil: kolonlar üst üste (görsel → özet → accordion → açıklama)
- W2 animasyon + cursor:pointer

## B) Bağlama

1. `modules.json`: id `t1udo01`, path `urun-detay-otomavi`, local `body`
2. **Tüm ürünler** (`products.json` data[] + `page/<ürün-id>/index.json`):  
   `desing.body` = `["t1udo01"]` (eski `t1pd01` çıkar)
3. `pagesetting` / products kök default body varsa `t1udo01` (ürün şablonu)
4. Kurumsal / kategori sayfalarında `t1pd01` kalabilir — yalnız ürün satırları değişir
5. `.cursorrules`: ürün detay body `t1udo01`; sepet yok notu

## C) Render + doğrula

```powershell
Invoke-RestMethod ... -Body '{"path":"otomavi","mode":"matrix"}'
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```

Manuel: `/tr/yakit-filtresi/` → 3 kolon, WA CTA, Sepete Ekle yok, dogrula hata=0  
Kanıt: `data/yonetici/24_run.log`

## Yasak
- eticaret true · price alanı R15 · Sepete Ekle · Magento turuncu
- Commit/push · `_shared/` · arrow/let/const back.js
- UTF-8 BOM (ConvertTo-Json dikkat)

## DONE
- [ ] Modül + katalog + t1udo01
- [ ] 89 ürün body t1udo01
- [ ] render mode matrix + dogrula 0
