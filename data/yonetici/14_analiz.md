# Oto Mavi — Geotech Tam Katalog + Tasarım Üstünlük Analizi

**Tarih:** 2026-07-20  
**Hedef kök:** `D:\projeler\otomavi\Web\matrix`  
**Referans:** [geotechotomotiv.com](https://www.geotechotomotiv.com/)  
**Marka:** Oto Mavi · `otomavi.com` · `eticaret: false`  
**Yönetici modu:** Ana oturum kod yazmaz — Cursor CLI (`agent --yolo -p`) uygular.

---

## 1. İş özeti

Geotech’teki **tüm departman / ürün satırları** Oto Mavi kataloğuna taşınacak; iletişim ve kurumsal bilgiler eksiksiz işlenecek; ana sayfa ve iç sayfa deneyimi Magento-demo kalabalığından arındırılıp **daha sade, marka-öncelikli ve güven veren** bir tasarıma çekilecek. Her içerik/tasarım paketinden sonra **webrender** + dogrula/hata döngüsü zorunlu.

---

## 2. Mevcut durum (kanıt — 2026-07-20)

| Alan | Durum |
|------|--------|
| Kimlik | Oto Mavi / otomavi.com / BMW yedek parça — OK |
| İletişim | Tel `0544 717 18 28`, adres Sanayi mah. 60081…, WhatsApp `905447171828` — OK |
| Katalog | **14 üst + 43 ürün** (Model B) |
| İç sayfa | `t1pd01` = `page-desing-otomavi` + kategori grid `t1pc03` — Paket 13 OK |
| Ana sayfa | menü `vey1el`, slider `k4t90c`, arama `t1af01`, liste `t1ls01`, intro/stats/cta, footer+WA |
| dogrula | Paket 13 sonrası **hata=0 uyarı=0** |
| Görsel borç | `page/*/index.webp` — **11 eksik**; kısa text **3** |
| Sepet / Magento YMM | Bilinçli KAPSAM DIŞI (`eticaret: false`) |

### Mevcut 14 üst kategori

Filtreler · Frenler · Gövde · Motor · Elektrik · Sönümleme/Süspansiyon · Klima · Ateşleme · Yağlar · Bakım Kiti · İç Donanım · Aydınlatma · Kayışlar · Silecekler

---

## 3. Geotech referans haritası (taşınacak ürün ağacı)

Kaynak menü / departman listesi ([geotechotomotiv.com](https://www.geotechotomotiv.com/)):

### 3.1 Zaten kısmen var — ALT ÜRÜN tamamlanacak

| Departman | Geotech alt ürünler | Oto Mavi şimdi | Eksik örnekler |
|-----------|---------------------|----------------|----------------|
| Filtreler | Yakıt, Hava, Yağ, Polen | 4/4 | — |
| Frenler | Disk, Balata, Aşınma sensörü, Tambur | 3 | Aşınma sensörü, Tambur fren |
| Gövde | Tampon, Kapılar, Yakıt deposu, Yan ayna | 3 | Kapılar, Yakıt deposu |
| Klima | Kompresör, Isı eşanjörü, Kurutucu, Kondanser | 3 | Isı eşanjörü |
| Kayışlar | V kayış, Gergi, Tensioner, Titreşim sönümleyici | 3 | Titreşim sönümleyici (+ triger var) |
| Sönümleme | Amortisör, Helezon, Yaprak yay, Yaylar | 3 | Yaprak yay |
| Elektrik | Marş, Akü, Alternatör, Röle | 3 | Röle başlatıcı |
| Motor | Motor elektriği, Lambda, Vuruntu, Oil cooler | 3 | Lambda, Oil cooler (yeniden adlandır/ayır) |
| Ateşleme | Buji, Bobin, Kızdırma, Kablo | 3 | Ateşleme kablosu |
| Yağlar/Sıvılar | Motor yağı, Antifriz, Fren, Hidrolik, ATF, Katkı | 3 | Hidrolik yağı, ATF, Katkı |
| İç donanım | Paspas, Trim, Kol dayama, Vites topuzu, Cam kolu | 3 | Vites topuzu, Cam kolu |
| Aydınlatma | Far, Stop, Sis, Sinyal, Kontroller | 3 | Sinyal lambası |
| Silecekler | Lastik, Kol, Motor, Bağlantı | 3 | Silecek motoru |
| Bakım Kiti | Periyodik / Filtre / Conta | 3 | — (yeterli) |

### 3.2 TAMAMEN EKSİK üst kategoriler (Geotech’te var)

| Yeni üst | Alt ürünler (min.) |
|----------|-------------------|
| Turbo / Zorlamalı Emme | Turboşarj, Ara soğutucu, Turbo contası, Basınç dönüştürücü |
| Direksiyon | Çubuk ucu, Bağlantı çubuğu, Onarım kiti, Kremayer kapağı |
| Şanzıman | Şanzıman montajı, Hız sensörü, Ters ışık anahtarı, Dişli/çark |
| Lastikler / Jant | Lastik, Jant kapağı, Tamir kiti, Ara parça |
| Süspansiyon (ayrı) | Tekerlek göbeği, Rulman, Bijon/saplama, Mil contası — *not: mevcut `omsusp06` “Sönümleme” ise yeni id ile “Süspansiyon / Poyra” ayrılır veya omsusp06 altına genişletilir; paket kararı: **yeni üst `omsusp` ayrımı yerine mevcut sonumleme’yi “Sönümleme” tut, yeni üst `ompoyra` / path `suspansiyon-poyra` ekle* |
| Park / Elektronik | Park sensörü, Motor beyni (ECU) — Geotech sidebar |
| Araç ekipmanları | Genel ekipman / aksesuar özet kategorisi |

### 3.3 Hedef katalog büyüklüğü (Model B)

| Katman | Hedef |
|--------|--------|
| Üst kategori | **20–21** (≥ Geotech departman kapsaması) |
| Alt ürün satırı | **75–90** (her üstte 3–5 ürün) |
| Her satır | `products.json` + `page/<id>/index.json` + `index.webp` + benzersiz SEO text/description |
| Ürün body | üst: `[t1pd01,t1pc03]` · ürün: `[t1pd01]` |

---

## 4. Site bilgileri (Geotech → Oto Mavi)

| Bilgi | Geotech | Oto Mavi hedef |
|-------|---------|----------------|
| Adres | Sanayi mah. 60081 nolu cadde no 43 Şehitkamil Gaziantep | Aynı (doğrulanmış) |
| Tel | 0544 717 18 28 | Aynı |
| WhatsApp | Destek Al | `905447171828` + footer `t1wa01` |
| Çalışma | Sabah 8 – akşam 10 | setting/contact + footer’a yaz |
| Sahibinden | Mağaza linki | footer veya iletişim CTA (opsiyonel URL alanına) |
| Değer önerisi | Uzman / Uygun / Hızlı kargo / Rakipsiz seçim | stats + intro metinlerine taşı (Türkçe, Oto Mavi dili) |
| Markalar | Vicma, Castrol, Ravenol, Bosch… | Ana sayfa “Öne çıkan üreticiler” bloğu (mevcut modül veya text+grid) |
| Kurumsal | Hakkımızda, Kariyer, SSS, İletişim | Hakkımızda var; **SSS + Kariyer** ekle; yasal sayfalar koru |
| Slogan | BMW 2. el parça / uygun fiyat / 1. sınıf kalite | Slider + CTA — sepet dili YOK; “Teklif Al / WhatsApp” |

---

## 5. Tasarım üstünlük (Geotech’ten daha iyi)

Geotech Magento demosu: aşırı banner, countdown, cookie duvarı, İngilizce/TR karışık menü, demo “Shop/Elements”.

**Oto Mavi ilk ekran kuralı (tek kompozisyon):**

1. Marka (logo + lacivert şerit)  
2. Tek güçlü mesaj (BMW yedek parça / Gaziantep)  
3. Kısa destek cümlesi  
4. CTA grubu (Ürünler + WhatsApp)  
5. Dominant slider görseli  

**Ana sayfa akışı (sade):**

1. Menü + slider  
2. Araç/parça arama (`t1af01`) — sade kart  
3. Üst kategori grid (`t1ls01`) — kalabalık promo yok  
4. Değer / güven şeridi (stats — 4 madde Geotech’ten uyarlanmış)  
5. Kısa intro + CTA  
6. Footer: adres, tel, çalışma saati, yasal, WhatsApp  

**İç sayfa:** `page-desing-otomavi` breadcrumb + hero + metin + benzer parçalar — korunur, metinler zenginleştirilir.

**Renk:** `#0B3A6E` `#02427A` `#E9F3FB` — hardcoded yeni renk yok; desing token.

---

## 6. Fonksiyon / sayfa haritası (özet)

| Yüzey | Modül / dosya | Rol |
|-------|---------------|-----|
| Ana sayfa | `desing.json` body | t1af01 → t1ls01 → t1in01 → t1st01 → t1ct01 |
| Menü | `vey1el` menu-2 | Anasayfa, Ürünler, Hakkımızda, İletişim (+ SSS) |
| Ürünler hub | `hs54qzyeyo` / products kök | t1pd01 + t1plpr |
| Kategori | 14→20+ üst | t1pd01 + t1pc03 |
| Ürün detay | 43→75+ | t1pd01 |
| İletişim | `xnzu5au0ag` | contact-3 + harita/metin |
| Kurumsal | `kurumsal.json` | hakkımızda, misyon, vizyon, kalite, yasal + SSS/kariyer |
| Render | `POST /webmaker/services/webmaker/` `{path:"otomavi"}` | public çıktı |
| Doğrulama | `webmaker-analiz.js otomavi` | hata=0 |

---

## 7. Plan (paket sırası)

| # | Paket | rol | Amaç |
|---|-------|-----|------|
| 15 | `15_urun_katalog_geotech_tam.md` | web | Eksik üst + alt ürünler; page JSON; görsel; desing body |
| 16 | `16_site_bilgi_kurumsal.md` | web | SSS, kariyer, çalışma saati, değer önerisi, marka şeridi, iletişim zenginleştirme |
| 17 | `17_tasarim_ustunluk.md` | web | Ana sayfa sadeleştirme, slider/CTA, menü, Geotech kalabalığı yok |
| 18 | `18_webrender_dogrula.md` | web | Full render + dogrula + placeholder/uyarı düzeltme döngüsü |

**P0:** 15 → 18 (katalog + render)  
**P1:** 16 → 17 → 18 (bilgi + tasarım + tekrar render)  
Borç zinciri: P0 bitmeden P2 yok; her paketten sonra render kanıtı.

---

## 8. Doğrulama / DONE

```powershell
# Render
Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi"}'

# Dogrula
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi
```

**DONE:**  
- Geotech departman kapsaması ≥ %95 (üst + alt satır)  
- dogrula **hata=0**  
- Render 200, kritik `OUTPUT_PLACEHOLDER_LEAK` yok (veya bilinçli ertelenenler kapanışta listelenir)  
- Ana sayfa sepet/demo dili yok; Oto Mavi kimliği tutarlı  

---

## 9. Riskler

- Çok sayıda yeni `page-id` → sunucu `GET /webmaker/services/page-id` zorunlu (istemci ID yasak).  
- ComfyUI kapalıysa görseller kategori `index.webp` kopyası ile doldurulur; özgün üretim sonraki tur.  
- Magento canlı SKU/fiyat senkronu yok — katalog tanıtım + WhatsApp sipariş modeli.  
- `menu-2` hardcoded metin uyarısı paylaşılan şablon borcu — proje JSON’unda çözülmezse kapanışta “bilinçli ertelenen” olarak yazılır.
