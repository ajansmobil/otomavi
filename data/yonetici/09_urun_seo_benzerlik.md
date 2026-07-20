# Paket 09 — Ürün SEO / benzerlik uyarılarını kapat

## Rol
cwd: `D:\projeler\otomavi\Web\matrix`

## Sorun
dogrula **hata=0** ama **uyarı=80**:
- SEO: birçok ürün `description.tr` kısa (<70; öneri ~120–160)
- BENZERLIK: komşu ürünlerde keyword/description Jaccard yüksek

## Yapılacaklar
1. Tüm **ürün** satırları (`category` dolu olanlar) + gerekirse üst kategoriler:
   - `description.tr` → 120–160 karakter, ürününe özgü (kopyala-yapıştır yok)
   - `page/{id}/index.json` description/keyword/title/text: her ürün farklı keyword seti (OEM/uygulama/parça tipi vurgula)
2. Aynı kategorideki ürünlerde keyword’leri ayır (ör. fren-diski ≠ fren-balatasi kelime çakışmasını düşür)
3. Hiyerarşi/modül/img/desing **bozma**
4. `eticaret` açma

## Doğrulama
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```
Hedef: **hata=0**, **uyarı mümkün olduğunca 0** (SEO+BENZERLIK). Kalan varsa `09_run.log`’da madde madde.

## Çıktı
`data/yonetici/09_run.log`
