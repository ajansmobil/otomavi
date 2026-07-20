# Paket 12 — Araç / VIN ürün arama modülü (Geotech benzeri, Oto Mavi tasarım)

## Rol
1) **Yeni webmodule:** cwd `D:\matrix` — kurallar `webmodules/mantik/rust.md` (W1/W2) + `D:\projeler\elo\web\talimatlar\web\webmodule\webmodule-gelistirme.md`  
2) **Site bağlama:** cwd `D:\projeler\otomavi\Web\matrix`

Referans UI: kullanıcı görseli (turuncu şerit, 6 select + VEYA + VIN + Arama).  
**Bizim tasarım:** turuncu KULLANMA. Oto Mavi paleti:
- Panel bg: `#0B3A6E` veya açık `#E9F3FB` (tercih: koyu lacivert panel + beyaz input — premium otomotiv)
- Buton: `#02427A` / hover `#1094DB`
- Metin: beyaz / koyu gri placeholder
- Yuvarlak radius ~10–12px (Geotech’e benzer ama marka uyumlu)

## Karar
Katalogda VIN/YMM modülü **YOK** → **yeni body modül zorunlu**.  
Path önerisi: `arac-parca-arama`  
Sepet/eticaret açma. Filtre sonuçları katalog ürünlerine yönlendirir veya WhatsApp/iletişim CTA.

## A) Yeni modül dosyaları
`D:\matrix\webmodules\body\arac-parca-arama\`
- `index.html` — `class="modulex"` kök; CSS scoped; layout:
  - Sol: 2×3 grid select: Araç, Model, Yılı, Motor, Şanzıman, Trim
  - Orta: **VEYA**
  - Sağ: VIN input + **Arama** butonu
  - Mobil: tek sütun stack, W2 `@media max-width 768`, `prefers-reduced-motion`, transition/animation
- `index.json` — name, category `search` veya `filter`, desing token’ları (`bgcolor`, `btnbg`, `btncolor`, `max`, label çevirileri `{tr,en}`), örnek `data` araç ağacı
- `back.js` — option HTML üretimi `{{html}}` / select options; i18n label’lar desing’den

### W1
Sabit TR metin `index.html`/`back.js` içinde yasak — `desing` dil objeleri:  
`labelMake`, `labelModel`, `labelYear`, `labelEngine`, `labelTrans`, `labelTrim`, `labelOr`, `vinPlaceholder`, `btnSearch`, `aria*`

### Davranış (istemci JS, self-contained)
1. Cascading: Araç seçilince Model dolar; Model→Yıl; … (data ağacından)
2. VIN: 11–17 karakter alfanumerik; geçersizse mxToast veya inline hata (i18n)
3. **Arama:**
   - Select doluysa: `products` içinde name/description/keyword/text’te make/model eşleşen **ürün veya kategori** linklerini sonuç şeridinde göster; yoksa WhatsApp `905447171828` ile ön mesaj (araç bilgisi)
   - VIN doluysa: iletişim/WhatsApp mesajına VIN ekle VEYA sonuç şeridi “VIN ile stok sor — iletişime geç”
4. `webmakerdata.products` varsa canlı filtre; yoksa demo data

### Örnek data (BMW odaklı — Oto Mavi)
```
BMW → 3 Series / 5 Series / X5 → yıllar → motor → şanzıman → trim
Mercedes-Benz → C-Class / E-Class → …
Audi → A4 / A6 → …
```
En az 3 marka, her birinde ≥2 model.

## B) Katalog kaydı
`D:\matrix\webmodules\body\index.json` — yeni kayıt (name, description, path, category, version, update, private:false, …)

## C) Oto Mavi entegrasyon
- `modules.json`: id örn. `t1af01`, path `arac-parca-arama`, desing marka renkleri
- `desing.json` body sırası: **slider sonrası ilk body**  
  `t1af01` → `t1sg01` → `t1ls01` → …
- Ana sayfada görünsün

## D) ELO talimat (kısa)
`D:\projeler\elo\web` — `karar-agaci` §J veya webmodule notuna: otomotiv katalogda `arac-parca-arama` (YMM+VIN UI; sepet değil).  
Commit yok.

## E) Test / doğrulama
```
# W1/W2 manuel kontrol + 
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```
hata=0. Mümkünse `node webmodules/test/run.js` veya ilgili smoke.

## Yasaklar
- Turuncu Geotech klonu (renk)
- Magento backend / gerçek VIN decode API zorunlu değil (UI + istemci filtre + WhatsApp)
- `_shared/` klasörü
- Commit/push yok

## Çıktı
`D:\projeler\otomavi\Web\matrix\data\yonetici\12_run.log`  
+ varsa `D:\projeler\elo\web\data\yonetici\12_modul_sonuc.md`
