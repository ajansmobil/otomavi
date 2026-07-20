# Paket 22 — Ürünler sayfasında kategoriler + kırık görsel

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix` (+ gerekirse `D:\matrix` page-desing-otomavi)  
Render: `{"path":"otomavi","mode":"matrix"}`

## Sorun

`/tr/urunler/` (page id `hs54qzyeyo`):
- Hero `t1pd01` → `/page/hs54qzyeyo/index.webp` **yok** → kırık resim (kullanıcı ekranı)
- `page.json` `modulestatus.img:false` (R13) — hub satırında img yok; yine de hero img basıyor
- Kullanıcı beklentisi: Ürünler’e tıklayınca **kategori kartları** gelsin

Not: Public HTML’de `t1plpr` grid aslında üretilmiş olabilir; kırık hero + sıra yüzünden “hata / boş” algısı. Hub’ı kategori-öncelikli yap.

## Yapılacaklar

### 1) `page.json` + `page/hs54qzyeyo/index.json` — body sırası

Ürünler hub body **zorunlu**:
```json
["t1plpr"]
```
veya (kısa intro istenirse):
```json
["t1plpr", "t1pd01"]
```
**Tercih:** yalnız `["t1plpr"]` — kırık hero yok, doğrudan “Tüm Kategoriler” grid.

`t1plpr` zaten `desing.page=category`, `category=""`, max 24 — 21 kategori kartı.

Aynı body’yi `pagesetting` products kökünde de tutarlı yapma: products hub ayrı; menü `urunler` path’ine gidiyor.  
İstersen `products.json` kök `desing.body` = `["t1plpr"]` yap (products kök URL kullanılırsa).

### 2) `page-desing-otomavi` — kırık img koruması (modül)

`back.js` hero görseli:
- `page.img` boş / yok / sadece placeholder ise **hero media bloğunu basma** (yalnız meta: başlık, desc, CTA)
- veya fallback: `/img/logo.png` — tercih: media’yı gizle (bozuk ikon gösterme)

W1/W2 bozma. Global page-desing-5’e dokunma.

### 3) Görsel (opsiyonel)

Hub’da hero tutulursa: bir kategori `index.webp` → `page/hs54qzyeyo/index.webp` kopyala ve liste satırına `img:"index.webp"` **yalnızca** R13’ü ihlal etmeyecekse.  
R13 `page` img:false → **kopya zorunlu değil**; body’den `t1pd01` çıkarmak yeterli.

### 4) Menü kontrolü

Ürünler linki `/tr/urunler/` (veya dil önekli) olmalı — `products` boş köke gitmemeli.

### 5) Render

```powershell
Invoke-RestMethod ... -Body '{"path":"otomavi","mode":"matrix"}'
```

Doğrula:
- http://localhost:8080/tr/urunler/ → kategori kartları görünür (Filtreler, Frenler, …)
- Kırık `/page/hs54qzyeyo/index.webp` yok
- dogrula hata=0

Kanıt: `data/yonetici/22_run.log`

## Yasak

- Commit yok
- Sepet / eticaret
- category.json ↔ products.json karıştırmama

## DONE

- Ürünler sayfasında kategori grid
- Kırık hero img yok
- render mode matrix · dogrula 0
