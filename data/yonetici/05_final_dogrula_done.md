# Paket 05 — Final doğrulama ve kapanış

## Rol
Cursor CLI geliştirici + QA. **cwd:** `D:\projeler\otomavi\Web\matrix`

## Amaç
Önceki paketlerden kalan tüm dogrula hatalarını kapat; siteyi DONE seviyesine getir.

## Kontrol listesi
- [ ] setting: Oto Mavi, otomavi.com, BMW yedek parça (boya yok)
- [ ] iletişim: 0544 717 18 28, Sanayi mah. 60081 nolu cadde no 43 Şehitkamil Gaziantep, info@otomavi.com
- [ ] products: ≥8 kategori, detaylar dolu
- [ ] ana sayfa body dolu + menü + footer
- [ ] slider ≥2 semantik görsel
- [ ] R1–R16 / DIL hata=0
- [ ] WhatsApp footer veya iletişimde (katalogda whatsapp modülü varsa)

## Yapılacaklar
1. `node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi` (tam)
2. Kalan her hatayı düzelt (JSON + görsel)
3. Tekrar dogrula → hata=0
4. `data/yonetici/kapanis_raporu.md` yaz:
   - Yapılanlar
   - dogrula kanıtı (hata/uyarı sayıları)
   - Bilinçli kapsam dışı (sepet, araç filtresi motoru) + neden

## Yasaklar
- Commit/push yok
- Erken DONE yok

## Bitiş koşulu
dogrula **hata=0**. Uyarı varsa raporda gerekçelendir.
