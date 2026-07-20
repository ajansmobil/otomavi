# Paket 06 — Slider sonrası tasarım geliştirmesi

## Rol
Cursor CLI geliştirici. **cwd:** `D:\projeler\otomavi\Web\matrix`  
Kurallar: `D:\projeler\elo\web\talimatlar\web\kurallar\kurallar.md` (R7/R12/R16)  
Referans his: http://www.geotechotomotiv.com/ (slider altı güven şeridi + kategori + promosyon ritmi)  
Marka: **Oto Mavi** · BMW / oto yedek parça · otomavi.com

## Amaç
Ana sayfada **slider’dan hemen sonra** görsel hiyerarşiyi güçlendir: boş/düz geçiş olmasın; güven → kategoriler → tanıtım → istatistik → CTA akışı.

## Mevcut body (değiştirilecek sıra)
`t1ls01` (page-list products) → `t1in01` (module-1) → `t1st01` (stats-1) → `t1ct01` (cta-1)

## Hedef body sırası
1. **Yeni USP / avantaj şeridi** (slider’ın hemen altı)
2. **Ürün kategorileri** (güçlendirilmiş liste)
3. **Tanıtım** (module-1 — metin/görsel polish)
4. **İstatistik**
5. **CTA**

## Yapılacaklar

### A) Yeni modül — güven / avantaj şeridi (zorunlu)
- Katalogdan seç: tercihen `services-grid-1` (`D:\matrix\webmodules\body\services-grid-1\index.json` oku; şema oradan).
- Alternatif: benzer kart/grid modülü (R12 — uydurma path yok).
- `modules.json`’a yeni id (6 char) ekle; `desing.json` `body` dizisinin **ilk** elemanı yap.
- İçerik (Oto Mavi / Geotech hissi, TR):
  1. Uzman Hizmet — haftanın 7 günü destek
  2. Uygun Fiyat — doğru parça, doğru fiyat
  3. Hızlı Teslimat — Gaziantep merkezli hızlı sevkiyat
  4. Geniş Seçim — filtre, fren, gövde, motor…
- Renkler site paletine uyumlu (`#0B3A6E`, `#02427A`, açık zemin `#E9F3FB` / beyaz).
- Badge/title/description Oto Mavi dilinde (dijital ajans metni kalmasın).

### B) Kategori grid güçlendir
- `t1ls01` için daha zengin görünüm: `page-list-2` veya `page-list-3` kataloğundan uygun olanı seç (index.json oku).
  - Path değiştirirsen R7: modules + desing id aynı kalabilir, `path` katalog path’i olmalı.
- `size`: masaüstünde dengeli (4–8); aspect-ratio okunaklı.
- Mümkünse bölüm başlığı/spot (modül şeması destekliyorsa): örn. “Parça Kategorileri” / “BMW yedek parçada ihtiyacın olan her şey”.

### C) Tanıtım + stats + CTA polish
- `t1in01`: margin, bgcolor, tipografi; boya/kaplama yok; BMW yedek parça.
- `t1st01` / `t1ct01`: gradient ve buton renkleri slider/menü ile aynı aile; CTA metinleri net.
- Slider (`k4t90c`) R16 bozulmasın: ≥2 `img`, semantik dosya adları kalsın. İstersen overlay/btnbg’i marka mavisiyle hizala (görsel silme).

### D) Yasaklar
- Sepet / Magento filtre motoru yazma
- `path: code` yalnızca katalogda hiç uygun modül yoksa
- Commit/push yok
- dogrula’yı bozan R15/R13/DIL regresyonu yok

## Doğrulama (bitirmeden)
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
curl "http://localhost:81/api/talimat/?run=web&path=D:/projeler/otomavi/Web/matrix"
```
**Şart:** hata=0 uyarı=0

## Çıktı
`data/yonetici/06_run.log` — eklenen modül id/path, yeni body sırası, dogrula sonucu
