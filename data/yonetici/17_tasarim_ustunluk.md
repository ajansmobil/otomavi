# Paket 17 — Tasarım üstünlük (Geotech’ten daha iyi)

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix` (+ gerekirse `D:\matrix` webmodules)  
Bağımlılık: 15 + 16  
Referans: `14_analiz.md` §5

## Amaç

Magento-demo kalabalığını (çoklu promo, countdown, İngilizce demo menü, cookie duvarı hissi) taklit ETME. Oto Mavi ana sayfa ve iç sayfa: **tek kompozisyon, marka önce, sade CTA**.

## Yapılacaklar

### 1) İlk ekran (slider `k4t90c`)

- En az 2 slayt; başlık markayı ezmesin
- Metin TR tutarlı; emoji/promo sticker yok
- CTA: Ürünler / İletişim veya WhatsApp — “Sepete ekle” yok
- Overlay / yükseklik mevcut paletle; okunaklılık kontrol

### 2) Ana sayfa body sırası (zorunlu sade akış)

Önerilen `desing.json` body:
1. `t1af01` araç-parça arama  
2. `t1ls01` kategori grid  
3. `t1st01` güven şeridi  
4. `t1in01` kısa hikaye  
5. `t1ct01` tek CTA  

Gereksiz tekrarlayan promo / ikinci liste varsa kaldır veya birleştir.  
`sg` veya benzeri kalabalık bloğu varsa sadeleştir veya çıkar (log’a gerekçe yaz).

### 3) Menü `vey1el`

- Renk: `#0B3A6E` aktif/bg tutarlı
- Linkler: Anasayfa, Ürünler, Hakkımızda, İletişim (+ SSS)
- Demo “Shop / Elements / Features” benzeri yok

### 4) İç sayfa

- `t1pd01` hero + breadcrumb + WhatsApp/Ara CTA korunur
- Kategori grid `t1pc03` kartları: boş img kırığı yok; hover transition varsa bırak

### 5) Footer

- Tek kolon düzeni okunaklı; tel + adres + çalışma saati
- WhatsApp `t1wa01` kalır

### 6) Opsiyonel webmodule dokunuşu

Yalnızca mevcut şablon yetersizse: küçük CSS/desing token ayarı. Yeni global modül şart değil.  
W1/W2 ihlali yapma.

### 7) Render + dogrula

Webrender + analiz → hata=0.  
Kanıt: `17_run.log` (önce/sonra body sırası + renderId).

## Yasaklar

- Mor/glow AI klişe; cream+terracotta klişe
- Kart çöplüğü / pill cluster / stat spam (stats 4 madde max)
- eticaret UI
- Commit / push yok

## DONE

- Ana sayfa akışı sade ve marka-öncelikli
- dogrula hata=0 · render 200
- `17_run.log` yazıldı
