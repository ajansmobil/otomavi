# Paket 20 — Oto Mavi tasarım yenileme (baştan sona)

rol: web  
cwd: `D:\matrix` (yeni webmodules) + `D:\projeler\otomavi\Web\matrix` (bağlama)  
Önizleme: http://localhost:8080/tr/ (webtest-active=otomavi)  
Marka paleti: `#0B3A6E` `#02427A` `#E9F3FB` `#F5F8FC` `#111827` — WhatsApp `905447171828`  
`eticaret: false` · sepet dili yok

## Teşhis (canlı ekran — zorunlu okuma)

Canlı sitede görülen sorunlar:
1. **`page-list-3` (t1ls01):** zigzag sol/sağ dev kartlar, 21 kategori = sonsuz scroll; siyah boşluklar; dağınık hizalama.
2. **`arac-parca-arama` (t1af01):** mobilde 6 select + VIN tek kolon → hero’dan sonra ekranı yutan lacivert kutu.
3. **Lacivert aşırısı:** arama + stats + intro + CTA hepsi koyu → yorgunluk.
4. **İç sayfa / kategori grid:** kabul edilebilir ama ana sayfa kadar zayıf; kartlar ve tipografi pekiştirilecek.
5. Cookie + WhatsApp çakışması (z-index/konum).

## Tasarım hedefi

- İlk ekran: menü + güçlü slider (marka önce, tek CTA)
- Hemen altında **kompakt** parça arama (açık zemin, 1–2 satır desktop)
- **Kategori grid** (kart ızgarası — zigzag YOK)
- Açık zemin güven şeridi (stats)
- Kısa intro + tek CTA bandı
- Mobil: 2 kolon grid; arama alanları sığ

---

## A) Yeni modül — `page-list-otomavi` (zorunlu)

Path: `D:\matrix\webmodules\body\page-list-otomavi\`  
Dosyalar: `index.html` + `index.json` + `back.js`  
Katalog: `webmodules/body/index.json` kaydı (`path=page-list-otomavi`, `category=page-list`).

### UI
- Bölüm başlığı + kısa alt başlık (desing dil objeleri: `sectionTitle`, `sectionSubtitle`)
- **CSS grid:** desktop 4 kolon, tablet 3, mobil 2
- Kart: üst görsel (aspect ~4/3, object-fit cover), altında ad + max 2 satır description (ellipsis)
- Açık zemin `#F5F8FC` / kart beyaz; border 1px soft; radius 14px; hover lift + gölge
- Zigzag / row-reverse / 60px gap YASAK
- W1: sabit TR yok — tüm metin desing `{tr,en}`
- W2: transition ≥0.25s + `@media` + `prefers-reduced-motion` + `cursor:pointer`
- back.js: `var` only, klasik `for`; `webmakerdata[json.desing.page].data` filtre `status==play` && `category==json.desing.category` (genelde `""`); `max` limiti

Referans mantık: `page-list-4` / `page-list` — ama görsel dil Oto Mavi’ye özel (global page-list-3’ü BOZMA).

---

## B) Araç arama — kompakt Oto Mavi yüzeyi

**Tercih A (önerilen):** yeni `webmodules/body/arac-parca-arama-otomavi/`  
- Mevcut `arac-parca-arama` back.js mantığını kopyala-uyarla (YMM+VIN+WhatsApp sonuç)
- Görsel fark:
  - Panel bg: `#E9F3FB` veya beyaz + ince lacivert border (tam ekran lacivert yıkama YOK)
  - Desktop: select’ler **3×2 grid** + VIN+buton aynı satır/alt satır
  - Mobil: Make+Model+Year görünür; Engine/Trans/Trim **“Detaylı filtre”** `<details>` veya collapsible (W1 metin desing’de)
  - Buton: `#02427A`, radius 10px
  - Dış padding 16–24px; max 1200px
- Global `arac-parca-arama` klasörünü bozma

**Tercih B (yalnızca A zaman almazsa):** mevcut `t1af01` desing token’larını açık zemine çek + `arac-parca-arama/index.html` CSS’ini **dikkatli** iyileştir (diğer projeleri kırarsa geri al; Oto Mavi fork tercih et).

Site bağlama: `modules.json` id `t1af01` path’i yeni modüle çevir VEYA yeni id `t1af02` + `desing.json` body’de değiştir.

---

## C) Oto Mavi bağlama (`D:\projeler\otomavi\Web\matrix`)

### 1) `modules.json`
- Yeni `t1ls02` (veya t1ls01 path güncelle): `page-list-otomavi`, `desing.page=category`, `category=""`, `size=4`, `max=24`, sectionTitle “Parça Kategorileri”, subtitle kısa
- Arama modülü kompakt path’e bağla
- `t1st01` stats: koyu gradient yerine **açık kart şeridi** — label/number renkleri lacivert; arka plan `#E9F3FB` veya beyaz (modül desing izin veriyorsa; stats-1 gradient zorunluysa hafif gradient veya data metinlerini sadeleştir)
- `t1in01`: fontcolor koyu metin + açık bgcolor (`#F5F8FC` / beyaz); “sepet yok” cümlesini UI’dan çıkar (içerikte gerekirse yumuşak)
- `t1ct01`: tek koyu CTA bandı kalsın (bilinçli vurgu)
- `t1pc03`: radius 14, soft gölge, gap dengeli; bgcolor beyaz
- `t1pd01`: hero daha ferah; radius 14; bg `#F5F8FC`
- `k4t90c` slider: height desktop ~560–600px; overlay 0.42–0.5; btn radius 10; align left; 3. slayt opsiyonel değil zorunlu değil
- `vey1el` menü: lacivert bar + beyaz logo/link; aktif net
- `t1wa01`: `bottom` ~88px veya cookie ile çakışmayacak konum (desing destekliyorsa)

### 2) `desing.json` body sırası (zorunlu)
```
t1af0x (kompakt arama) → t1ls02 (grid) → t1st01 → t1in01 → t1ct01
```
Eski `t1ls01` (page-list-3) ana sayfa body’den **çıkar**.

### 3) Ürünler hub / category kök
- `t1plpr` veya hub body: mümkünse aynı `page-list-otomavi` id’sini kullan (zigzag page-list / page-list-3 yok)
- Kategori satırları: `["t1pd01","t1pc03"]` koru

### 4) `.cursorrules`
Ana sayfa liste modülü `page-list-otomavi`; zigzag page-list-3 yasak notu.

---

## D) İç sayfa + kategori ürün kartları

- `page-desing-otomavi`: tipografi ritmi (H1 28–34px), CTA butonları eşit yükseklik, related grid 4/2/2
- `page-category-3`: kart başlık truncate; görsel min-height; hover soft — **global bozmadan** desing token + gerekirse hafif CSS (çoklu proje etkisi varsa otomavi code-module YAPMA; token yeterliyse token)

---

## E) Render + görsel doğrulama

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi"}'
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi
node D:/matrix/webmodules/test/run.js
```

Manuel (log’a yaz):
1. http://localhost:8080/tr/ — zigzag yok, grid var, arama kompakt
2. Bir kategori URL — ürün kartları
3. Bir ürün URL — hero + related
4. Mobil ~390px — 2 kolon grid, arama collapsible çalışıyor

Kanıt: `data/yonetici/20_run.log` + renderId + dogrula hata=0

---

## Yasaklar

- Global `page-list-3` / `arac-parca-arama`’yı tüm siteler için çirkinleştirme — Oto Mavi fork tercih
- Magento demo kalabalığı / countdown / sepet
- `_shared/` · `let`/`const`/arrow (back.js)
- Commit / push yok
- Purple glow / cream-terracotta AI klişe

## DONE

- Ana sayfa zigzag yok; kategori **grid**
- Arama paneli kompakt / açık zemin
- dogrula hata=0 · render ok · webmodules test geçsin
- `20_run.log` yazıldı
