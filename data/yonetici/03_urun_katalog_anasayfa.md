# Paket 03 — Ürün kategorileri + ana sayfa doluluğu

## Rol
Cursor CLI geliştirici. **cwd:** `D:\projeler\otomavi\Web\matrix`
Önkoşul: Paket 02 kimlik düzeltmeleri uygulanmış olmalı (yoksa önce 02’yi tamamla).

## Amaç
Geotech departmanlarını Oto Mavi ürün kataloğuna taşı; ana sayfada kategori grid + tanıtım + CTA dolu olsun.

## Referans kategoriler (Geotech → Türkçe Oto Mavi)
En az şu products satırları (id benzersiz 6–10 char; path slug slash’sız):

1. Filtreler (yakıt/hava/yağ/polen)
2. Frenler
3. Gövde
4. Motor
5. Elektrik
6. Sönümleme / süspansiyon
7. Klima
8. Ateşleme ve ön ısıtma
9. Yağlar ve sıvılar
10. Bakım kiti
11. İç donanım
12. Aydınlatma
13. Kayışlar ve zincirler
14. Silecekler

(İstersen birleştirerek 9–12 kategori yap; boş kategori bırakma.)

## Yapılacaklar

### A) products.json (Model B kategori dosyası)
- `pagesetting` path `products` ile uyumlu yapı
- Her kategori: R15 beyaz liste alanları + `page/<id>/index.json` (detail:true ise text orada)
- name/description/keyword dil objesi `{ "tr": "..." }`
- Geotech’teki ürün yelpazesi anlatımı; marka Oto Mavi

### B) modules — ana sayfa
- `desing.json` body: kategori listesi (page-list / page-list-* products’a bağlı) + tanıtım + stats/CTA
- Mevcut `t1ls01` page’e bakıyor olabilir → products kategorisini gösteren liste modülü ekle/ayararla
- Katalog modülü (`catalog`) gerekirse R12 ile kataloğdan ekle

### C) page.json navigasyon
- Model A: Ürünler / Kurumsal / İletişim tutarlı
- R1: home ekleme
- R13: page detail/img false

### D) Kurumsal içerik tutarlılığı
- hakkimizda/misyon/vizyon/kalite/yasal: Oto Mavi BMW yedek parça; Geotech adını “eski marka” diye geçirme veya sadece gerekirse “önceki ticari unvan” notu — ağırlık Oto Mavi

## Yasaklar
- Sepet/ödeme kodu
- Uydurma telefon
- Commit/push yok
- Slider ComfyUI (paket 04)

## Doğrulama
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```
`data/yonetici/03_run.log` yaz.
