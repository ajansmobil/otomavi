# Paket 01 — ELO web talimat / feature boşluk kontrolü

## Rol
Sen ELO web talimat ekibisin. **cwd zorunlu:** `D:\projeler\elo\web`

## Amaç
Oto Mavi sitesi (eski Geotech Otomotiv — BMW yedek parça, domain otomavi.com) WebMaker ile kuruluyor.
Referans: http://www.geotechotomotiv.com/

WebMaker kurumsal katalogda **olmayan** ama bu iş için **zorunlu** özellik varsa `talimatlar/web` altına ekle.
Olmayan / kapsam dışı olanları (sepet, ödeme, Magento araç filtresi) **ekleme** — sadece gerçek boşluk.

## Yapılacaklar

1. Oku: `talimatlar/web/kurallar/kurallar.md`, `feature/feature-gelistirme.md`, `karar-agaci/web-karar-agaci.md`, `analiz.md`
2. Hedef site ihtiyaçları:
   - Marka rebrand (Geotech → Oto Mavi)
   - Ürün kategori kataloğu (products)
   - Kurumsal + iletişim + WhatsApp
   - Slider R16
   - (Opsiyonel referans) araç make/model filtresi, sepet — WebMaker’da yoksa feature talebi olarak belgele; tam e-ticaret motoru yazma
3. Karar:
   - **A)** Mevcut R1–R16 + katalog yeterli → `data/yonetici/01_elo_sonuc.md` yaz: "ek özellik gerekmedi" + gerekçe
   - **B)** Talimat/feature eksik → `feature-gelistirme.md` kurallarına uygun ekle; `kurallar.md` / `dogrulama-listesi.md` senkronu; `01_elo_sonuc.md`’ye ne eklendiğini yaz
4. Commit/push YAPMA.

## Yasaklar
- `D:\projeler\otomavi\Web\matrix` JSON’una dokunma (bu paket yalnız ELO talimat)
- Magento klonu / sepet motoru yazma
- Uydurma kural ekleme

## Doğrulama
- `01_elo_sonuc.md` oluşmuş olmalı
- Eklediysen ilgili md dosyaları tutarlı
- Kısa özetle bitir: EKLENEN / EKLENMEDİ
