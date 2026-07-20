# Paket 02 — Kimlik (Oto Mavi) + dogrula R13/R15/DIL + iletişim

## Rol
Cursor CLI geliştirici. **cwd:** `D:\projeler\otomavi\Web\matrix`
Kurallar: `D:\projeler\elo\web\talimatlar\web\kurallar\kurallar.md` (R0–R16)

## Marka kararı (kesin — boya/kaplama YASAK)
- **Marka:** Oto Mavi
- **Domain:** otomavi.com
- **İş:** Gaziantep BMW / oto yedek parçaları (eski Geotech Otomotiv rebrand)
- **Adres:** Sanayi mah. 60081 nolu cadde no 43 Şehitkamil Gaziantep
- **Tel:** 0544 717 18 28
- **E-posta:** info@otomavi.com
- Referans: http://www.geotechotomotiv.com/

## Yapılacaklar

### A) setting.json
- `description` / `keyword`: BMW yedek parça, Oto Mavi, Gaziantep (boya/kaplama sil)
- `name`: Oto Mavi · `domain`: otomavi.com · `eticaret`: false · langs.tr true

### B) modules.json metinleri
- `t1in01`, `t1st01`, `t1ct01`, iletişim `fhxr98`: boya/kaplama → yedek parça kimliği
- İstatistik örnek: parça çeşidi, mutlu müşteri, yıl deneyim, destek
- CTA: sipariş / iletişim / ürünler
- Telefon: tel:05447171828 metin 0544 717 18 28
- Adres tam metin

### C) R13 + R15 + DIL (page.json / kurumsal.json / detaylar)
1. `page.json` üst `modulestatus`: `{ "page": true, "body": true, "detail": false, "img": false }`
2. Liste satırlarından `spot`, `desc` KALDIR (R15). Gerekirse içeriği `page/<id>/index.json`’e taşı.
3. `detail:false` iken `page/<id>/index.json` içinde **text YOK** (R11). Gövde metni gerekiyorsa liste satırında `text` (R11 istisnası) veya kategori detail:true olan kurumsal’da detayda tut.
4. `kurumsal.json` liste satırlarından `desc` kaldır; description dil objesi dolu olsun.
5. Aktif dil yalnız `tr`: tüm play sayfalarda description/keyword (ve kurala göre text) dolu.
6. `pagesetting.json` page kategorisi modulestatus’u R13 ile uyumlu yap.

### D) İletişim sayfası
- `xnzu5au0ag` + contact/map modülleri gerçek adres/tel
- Uydurma telefon/e-posta yasak

### E) Menü (menu-2 / vey1el)
- Linkler: Ürünler, Hakkımızda (veya Kurumsal), İletişim — Geotech yapısına yakın, Oto Mavi isimleri

## Yasaklar
- Ana sayfa `home` path ekleme (R1)
- path’te slash (R2)
- Commit/push yok
- Slider görsel üretimi bu pakette değil (paket 04)

## Doğrulama (bitirmeden çalıştır)
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```
Hedef: R15/DIL/iletişim uydurma hataları düşmüş olmalı. R16 slider hataları paket 04’e kalabilir — `data/yonetici/02_run.log` yaz.

## Çıktı
`data/yonetici/02_run.log` — yapılanlar + kalan hatalar listesi
