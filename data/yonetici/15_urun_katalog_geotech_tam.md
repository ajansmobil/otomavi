# Paket 15 — Geotech tam ürün kataloğu (Oto Mavi)

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix` (Matrix HTTP/modül işi için gerektiğinde `D:\matrix`)  
Referans analiz: `data/yonetici/14_analiz.md`  
Referans site: https://www.geotechotomotiv.com/  
Marka: Oto Mavi · eticaret: false · WhatsApp 905447171828 · tel 0544 717 18 28

## Amaç

Geotech’teki **tüm departman ve alt ürün satırları** Model B ile `products.json` + `page/<id>/` altına eklenecek. Mevcut 14 üst / 43 ürün bozulmadan genişletilir.

## Mevcut (dokunma / koru)

- 14 üst + 43 ürün id’leri kalır
- `t1pd01` (page-desing-otomavi), `t1pc03` (page-category-3), `t1plpr` bağları korunur
- Üst body: `["t1pd01","t1pc03"]` · ürün body: `["t1pd01"]` · kök: `["t1pd01","t1plpr"]`

## Yapılacaklar

### 1) Yeni üst kategoriler (zorunlu)

Her biri: `products.json` satırı + `page/<id>/index.json` + `index.webp` (yoksa en yakın kategori görselinden kopyala) + benzersiz TR description/text (≥120 karakter, SEO benzerlik düşük).

| path (öneri) | name.tr | Alt ürünler (min. 4) |
|--------------|---------|----------------------|
| `turbo-zorlamali-emme` | Turbo / Zorlamalı Emme | Turboşarj, Ara soğutucu, Turbo contası, Basınç dönüştürücü |
| `direksiyon` | Direksiyon | Rot başı / çubuk ucu, Bağlantı çubuğu, Onarım kiti, Kremayer kapağı |
| `sanizman` | Şanzıman | Şanzıman montajı, Hız sensörü, Ters ışık anahtarı, Dişli/çark |
| `lastik-jant` | Lastik ve Jant | Lastik, Jant kapağı, Lastik tamir kiti, Ara parça |
| `suspansiyon-poyra` | Süspansiyon / Poyra | Tekerlek göbeği, Tekerlek yatağı, Bijon/saplama, Mil contası |
| `park-elektronik` | Park ve Elektronik | Park sensörü, Motor beyni (ECU), Röle / kontrol ünitesi (özet) |
| `arac-ekipmanlari` | Araç Ekipmanları | Genel ekipman, Aksesuar seti, Atölye sarf (özet 3–4 satır) |

**ID üretimi:** `GET http://localhost/webmaker/services/page-id?projepath=otomavi&count=N` — istemci/elle uydurma ID YASAK.

### 2) Mevcut üstlere eksik alt ürünler

`14_analiz.md` §3.1 tablosundaki eksikler eklenir (ör. tambur fren, kapılar, ısı eşanjörü, yaprak yay, röle, lambda, oil cooler, ateşleme kablosu, ATF, hidrolik yağı, sinyal lambası, silecek motoru, …).  
Her yeni ürün: `category` = üst id, body `["t1pd01"]`, page klasörü + text + img.

### 3) Index / SEO

- Üst ve ürün `name`/`description`/`text` TR dolu; birbirine yapıştırma metin YOK
- `keyword` üstlerde makul; dogrula benzerlik hatası üretme
- `status: "play"`, `modulestatus` products köküne dokunma (img/detail mevcut yapı)

### 4) Menü / ürünler hub

- Ürünler sayfası (`hs54qzyeyo` / products kök) yeni üstleri listeler (`t1plpr` / `t1ls01` category `""` otomatik okur — doğrula)
- Ana sayfa `t1ls01` yeni üstleri göstermeli

### 5) Görsel

- Eksik `index.webp` → parent veya kategori kopyası (11 mevcut eksik + yeni satırlar)
- ComfyUI varsa kategori başına 1 özgün; yoksa kopya — `15_run.log`’a yaz

### 6) Render + doğrulama (bu pakette)

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi"}'
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi
```

Hata varsa **aynı işte** düzelt, tekrar render/dogrula.  
Sonuç: `data/yonetici/15_run.log` + özet tablo (üst sayısı, ürün sayısı, renderId, hata/uyarı).

## Yasaklar

- `eticaret: true` / sepet / Magento checkout taklidi
- Global webmodules’ü tüm projeler için bozma (otomavi-özel OK)
- `_shared/` · `let`/`const`/arrow (JS yazarsan Matrix kuralı)
- Commit / push yok
- Yasak JSON alanları: permissions, dependencies, variables, api_endpoints, features
- `pagesetting.json` kök `pages` anahtarı yasak

## DONE

- Üst ≥ 20 · ürün satırı ≥ 75
- Geotech departman kapsaması tamam (analiz §3)
- dogrula hata=0
- Render 200
- `15_run.log` yazıldı
