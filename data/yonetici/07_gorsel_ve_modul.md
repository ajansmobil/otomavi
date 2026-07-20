# Paket 07 — Kategori/tanıtım görselleri + uygun modül

## Rol
Cursor CLI geliştirici.  
**cwd (site):** `D:\projeler\otomavi\Web\matrix`  
**cwd (yeni modül gerekirse):** `D:\matrix` + kurallar `D:\projeler\elo\web\talimatlar\web\webmodule\webmodule-gelistirme.md` + `webmodules/mantik/rust.md` (W1/W2)

Marka: **Oto Mavi** · BMW / oto yedek parça · otomavi.com

## Sorun
- `products` kategorilerinde **img yok** (`modulestatus.img: false`)
- Diskte `page/<id>/*.webp|jpg` yok → page-list boş görsel
- `t1in01` (module-1) `img: index.jpg` ama `img/t1in01/` yok
- Kullanıcı: resimleri ekle; modülleri kontrol et; en uygununu kullan; uyumsuzsa **yeni modül yap**

## Modül kararı (önce katalog — R12)

| İhtiyaç | Mevcut aday | Görsel yolu |
|---------|-------------|-------------|
| Ana sayfa kategori grid | `page-list-2` (şu an t1ls01) | `/page/{id}/{img}` |
| Ana sayfa kategori + açıklama | `page-list-3` (daha zengin) | aynı |
| Tanıtım | `module-1` | `/img/{moduleId}/{img}` |
| Ürünler sayfası liste | `page-list` / `page-list-2` | aynı |

**Tercih sırası:**
1. Ana sayfa kategorileri için **`page-list-3`** (görsel + başlık + description) — otomotiv kataloguna daha uygun.
2. Ürünler alt sayfasında `t1plpr` / page body için `page-list-2` veya aynı path tutarlılığı.
3. Mevcut modüller görseli gösteriyorsa **yeni modül YAPMA**.
4. Yeni modül yalnız şu durumda: page-list-* render’da img’i göstermiyor / kırık / şema products ile uyumsuz — o zaman `body/otomavi-kategori-grid` (veya benzeri slug) üret; W1/W2 + katalog kaydı + versiyon.

## Yapılacaklar

### A) products img aç
- `products.json` ve `pagesetting` products: `"img": true` (detail true kalsın)
- Her `data[]` satırına R15 uyumlu `"img": "index.webp"` (veya semantik ad)
- `page/<id>/index.json` içine de aynı `img` alanını yaz (birleşimde kaybolmasın)

### B) ComfyUI — 14 kategori + 1 tanıtım (zorunlu)
Her görsel **yazısız** (no text, no typography, no letters, no logo, no watermark).

| Hedef dosya | Konu (prompt EN) |
|-------------|------------------|
| `page/omfltr01/index.webp` | automotive oil air cabin filters close-up workshop |
| `page/omfren02/index.webp` | brake discs pads automotive |
| `page/omgvde03/index.webp` | car body panel bumper workshop |
| `page/ommotr04/index.webp` | car engine parts bay |
| `page/omelek05/index.webp` | car battery alternator electrical |
| `page/omsusp06/index.webp` | car suspension damper coil |
| `page/omklma07/index.webp` | car AC compressor condenser |
| `page/omatsg08/index.webp` | spark plugs ignition coils |
| `page/omsivi09/index.webp` | motor oil bottles fluids (no readable labels if possible) |
| `page/ombkim10/index.webp` | car maintenance kit tools |
| `page/omicdn11/index.webp` | car interior cabin |
| `page/omaydn12/index.webp` | car headlights lighting |
| `page/omkysi13/index.webp` | serpentine belt pulleys |
| `page/omslck14/index.webp` | windshield wipers |
| `img/t1in01/index.webp` (veya desing.img ile uyumlu ad) | BMW spare parts warehouse / Gaziantep workshop atmosphere |

- Semantik dosya adı tercih; `1.jpg` yasak (R16 ruhu).
- Üretim sonrası mümkünse vision/OCR: yazı varsa yeniden üret.
- `t1in01.desing.img` dosya adıyla eşleştir.

### C) Modül bağlama
- `t1ls01`: path → `page-list-3` (veya kanıtla page-list-2 yeterliyse bırak; gerekçeyi logla), `page: products`, size 4–8
- `desing.body` sırası koru: USP → kategoriler → tanıtım → stats → CTA
- Slider R16 bozma

### D) Yeni modül (yalnız gerekirse)
`D:\matrix\webmodules\body\<yeni-path>\` + `body/index.json` katalog kaydı + W1/W2 animasyon/mobil + test yoksa en azından manuel render kontrolü.  
ELO talimat: `webmodule-gelistirme.md` takip et.  
Site `modules.json` yeni path’i kullansın.

### E) Yasaklar
- Commit/push yok
- Uydurma telefon/metin
- Sepet motoru
- dogrula regresyonu yok

## Doğrulama
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
# her page/om*/index.webp ve img/t1in01 var mı, boyutu >0
Get-ChildItem D:\projeler\otomavi\Web\matrix\page\om*\*.webp
```
**Şart:** hata=0; en az 14 kategori görseli + tanıtım görseli diskte; products img alanları dolu.

## Çıktı
`data/yonetici/07_run.log` — seçilen modül(ler), yeni modül yapıldı mı (evet/hayır + neden), üretilen dosya listesi, dogrula
