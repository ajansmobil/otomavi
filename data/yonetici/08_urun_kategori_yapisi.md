# Paket 08 — Ürün kategori + ürün yapısı (kritik)

## Rol
Cursor CLI geliştirici. **cwd:** `D:\projeler\otomavi\Web\matrix`  
Kurallar: `D:\projeler\elo\web\talimatlar\web\kurallar/kurallar.md` R7/R12/R14/R15  
Referans hiyerarşi: mobilya projesi (`category: ""` üst · `category: "<üst-id>"` alt)  
Marka: **Oto Mavi** · BMW yedek parça · Geotech yelpazesi  
`eticaret: false` — sepet/ödeme YOK; telefon/WhatsApp sipariş modeli

## Sorun
Şu an `products.json` yalnız **14 düz kategori** (hepsi `category: ""`). Gerçek **ürün satırı yok**.  
Kullanıcı: kategori + ürün yapısı çok önemli.

## Hedef model (Model B — tek `products.json`)

```
products.data[]
  ├─ ÜST KATEGORİ  category: ""          → ana sayfa / ürünler grid
  │    id: omfltr01  path: filtreler
  └─ ÜRÜN          category: "omfltr01"   → kategori sayfasında page-category listesi
       id: omfltr1a  path: yakit-filtresi
```

- Detay her zaman `page/{id}/index.json`
- Ana sayfa `page-list-3`: yalnız `category: ""` (mevcut back.js filtresi)
- Kategori detay: `page-desing-5` + **`page-category-3`** (ürün kartları)
- Ürün detay: `page-desing-5` (+ gerekirse zengin text: OEM notu, uyumluluk, iletişim CTA)

## A) 14 üst kategori (koru / güçlendir)
Mevcut `omfltr01`…`omslck14` kalsın. Her birinde:
- `category: ""`
- `img`, `description`, detay `text` dolu
- `desing.body`: en az `["tp5jo4", "<page-category-3-id>"]` (veya kategori varsayılan + satır override)

## B) Ürün satırları (zorunlu — Geotech alt kırılım)

Her üst kategoriye **en az 3 ürün** ekle (`category: "<üst-id>"`).  
Id: kısa benzersiz (örn. `omfya01`, `omfha02`…). path: slug, slash yok.

| Üst | Örnek ürünler (TR) |
|-----|---------------------|
| Filtreler | Yakıt filtresi, Hava filtresi, Yağ filtresi, Polen filtresi |
| Frenler | Fren diski, Fren balatası, Fren hidroliği |
| Gövde | Tampon, Yan ayna, Kaporta paneli |
| Motor | Conta seti, Soğutma parçası, Motor sensörü |
| Elektrik | Akü, Alternatör, Marş motoru |
| Sönümleme | Amortisör, Helezon yay, Salıncak burcu |
| Klima | Klima kompresörü, Kondanser, Kurutucu |
| Ateşleme | Buji, Ateşleme bobini, Kızdırma bujisi |
| Yağlar | Motor yağı, Antifriz, Fren hidroliği |
| Bakım kiti | Periyodik bakım seti, Filtre seti, Conta kiti |
| İç donanım | Paspas seti, İç trim, Kol dayama |
| Aydınlatma | Far, Stop lambası, Sis farı |
| Kayışlar | V kayışı, Triger seti, Gergi |
| Silecekler | Silecek lastiği, Silecek kolu, Fıskiye pompası |

Her ürün için:
1. `products.json` liste satırı (R15): id, path, name{tr}, status play, index, category=`<üst-id>`, img, description{tr}, icon
2. `page/{id}/index.json`: name, title, description, keyword, text (HTML — özellik + Oto Mavi iletişim), img, category, update, date
3. Görsel: `page/{id}/index.webp` — ComfyUI yazısız; kategori görselini kopyalayıp yeniden üretmek veya konu-özel üretmek OK. En az ürünlerin **çoğunda** gerçek dosya olsun (hepsi boş kalmasın). Hız için aynı kategoride 1 ortak görsel kopyası + 1 özgün kabul edilebilir ama tercihen konu-özel.

## C) Modüller
1. `modules.json`’a `page-category-3` ekle (katalogdan oku — R7/R12). Yeni id örn. `t1pc03`.
2. Üst kategori sayfalarının `desing.body` → `["tp5jo4", "t1pc03"]` (veya eşdeğeri).
3. `products.json` kök / pagesetting products desing: üst liste için `page-list-2` veya mevcut; ana sayfa `t1ls01` path `page-list-3`, `page: products`, category boş kalsın.
4. Ürün detaylarında sepet modülü **ekleme**.

## D) Menü / navigasyon
- Menüde “Ürünler” → products üst liste
- pathnext gerekirse üst kategoriden ilk ürüne değil, kategori kendi path’ine kalsın

## E) ELO talimat (yalnız boşluk varsa)
Nesting modeli (`category: üst-id` + page-category) `karar-agaci`’nda yoksa kısa paragraf ekle — **ayrı paket**, cwd `D:\projeler\elo\web`. Bu pakette site JSON öncelikli; talimat eklemek opsiyonel ama önerilir.

## Yasaklar
- `eticaret: true` / sepet / ödeme açma
- Magento YMM filtre motoru
- R1 home ekleme
- Commit/push yok
- Uydurma telefon (0544 717 18 28 kullan)

## Doğrulama
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi
# Üst kategori sayısı ~14 (category=="")
# Ürün sayısı >= 42 (14*3)
# page-category-3 modules + kategori body'de
```
**Şart:** dogrula hata=0; hiyerarşi kanıtı logda.

## Çıktı
`data/yonetici/08_run.log` + `data/yonetici/08_urun_agaci.md` (üst → alt id/path tablosu)
