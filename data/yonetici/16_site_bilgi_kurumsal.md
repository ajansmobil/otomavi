# Paket 16 — Site bilgileri + kurumsal (Geotech → Oto Mavi)

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix`  
Bağımlılık: Paket 15 tamam (katalog genişlemiş olmalı)  
Referans: `14_analiz.md` §4 · https://www.geotechotomotiv.com/

## Amaç

Geotech’teki işletme bilgileri, değer önerileri ve kurumsal sayfalar Oto Mavi’ye eksiksiz ve tutarlı işlensin. Sepet dili yok; WhatsApp / telefon sipariş modeli.

## Yapılacaklar

### 1) İletişim yüzeyi

- `page/iletisim` (veya `xnzu5au0ag`) + `modules.json` contact (`fhxr98`):
  - Adres: Sanayi mah. 60081 nolu cadde no 43 Şehitkamil Gaziantep
  - Tel: 0544 717 18 28
  - E-posta: info@otomavi.com
  - Çalışma: Sabah 08:00 – 22:00
  - WhatsApp CTA metni Oto Mavi
- Footer (`txt39m`): aynı bilgiler + yasal linkler; Geotech “Sahibinden mağaza” için opsiyonel metin/link alanı (URL yoksa sadece “Sahibinden’de Oto Mavi” notu — uydurma URL yazma)

### 2) Kurumsal sayfalar (`kurumsal.json` + page/)

- Mevcut: Hakkımızda, Misyon, Vizyon, Kalite, yasal — metinleri Geotech değerleriyle güçlendir (BMW 2. el / uygun fiyat / 1. sınıf kalite → Oto Mavi dili)
- **Yeni:** `sss` (Sıkça Sorulan Sorular) — en az 5 soru-cevap (teslimat 1–3 gün, WhatsApp sipariş, orijinal/eşdeğer, Gaziantep depo, iade politikası özeti)
- **Yeni:** `kariyer` — kısa açık pozisyon / başvuru (e-posta ile) metni
- Kurumsal body: mümkünse `t1pd01` veya mevcut intro; eski `tp5jo4` yerine Oto Mavi iç sayfa tercih

### 3) Ana sayfa güven / değer şeridi

- `t1st01` (stats-1) dört madde:
  1. Uzman hizmet (7 gün destek)
  2. Uygun fiyat
  3. Hızlı tedarik (1–3 gün)
  4. Geniş parça seçimi
- `t1in01` / `t1ct01`: Geotech slogan uyarlaması, “Alışveriş Yap / Sepet” YOK → “Ürünleri İncele” / “WhatsApp ile Teklif Al”

### 4) Öne çıkan üreticiler (marka şeridi)

- Mevcut uygun modül varsa kullan; yoksa kısa intro/text blok veya page-list dışı sade bir body metin kartı (yeni webmodule ZORUNLU değil)
- Marka isimleri: Castrol, Bosch, Dayco, Ridex, Ravenol, vb. (tanıtım; logo dosyası yoksa metin satırı)

### 5) Menü

- `vey1el` / sayfa listesi: Anasayfa · Ürünler · Hakkımızda · SSS · İletişim (Kariyer kurumsal altı veya menü — tercih: kurumsal alt)

### 6) Render + dogrula

Aynı paket içinde webrender + `webmaker-analiz.js otomavi` → hata=0.  
Kanıt: `16_run.log`.

## Yasaklar

- Uydurma telefon / adres
- eticaret / sepet
- Commit / push yok
- Yasak JSON alanları

## DONE

- SSS + Kariyer canlı
- İletişim + footer + stats tutarlı
- dogrula hata=0 · render 200
