# Paket 19 — category.json / products.json ayrımı (karışıklık gider)

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix` (+ webmodules için `D:\matrix`)  
Marka: Oto Mavi · eticaret: false

## Sorun

- `products.json` içinde **hem** üst kategori (`category: ""`) **hem** ürün (`category: <üst-id>`) var → karışık.
- `pagesetting` içinde `path: "category"` kaydı var ama `category.json` **data: []** (boş).
- Kullanıcı kuralı: **aynı JSON içinde kategori ve ürün olamaz.**

## Hedef model (zorunlu)

| Dosya | İçerik | `data[].category` |
|-------|--------|-------------------|
| `category.json` | Yalnızca üst kategoriler (şimdiki 21 üst) | hep `""` |
| `products.json` | Yalnızca ürün satırları (şimdiki 89) | hep `<category-id>` (üstün `id` alanı) |

`page/<id>/index.json` + `index.webp` **taşınmaz** — id’ler aynı kalır; sadece hangi liste dosyasına ait oldukları değişir.

## A) Veri taşıma

1. `products.json` içinden `category === ""` olan **21** satırı al → `category.json.data` yap.
2. Kalan **89** ürün `products.json.data` içinde kalsın; `category` alanları mevcut üst id’lere işaret etmeye devam etsin (id değişmez).
3. `category.json` kök alanlarını doldur (products’tan uyarla):
   - `name`, `path: "category"`, `description`, `keyword`, `desc: []`
   - `desing.body`: `["t1pd01","t1pc03"]` (kategori detayda ürün grid)
   - `modulestatus`: `{ page:true, body:true, detail:true, img:true, bgimg:false, icon:true }`
4. `products.json` kök:
   - `name` Ürünler, `path: "products"`
   - `desing.body`: `["t1pd01"]` (hub’da kategori listesi yok — ürün dosyasında kök kategori satırı kalmayacak)
   - `modulestatus` mevcut detail/img koru
   - **data içinde `category: ""` satır KALMASIN**
5. Her kategori satırı `desing.body`: `["t1pd01","t1pc03"]`
6. Her ürün satırı `desing.body`: `["t1pd01"]`
7. R15 beyaz liste: liste satırında yasak alan yok.

## B) pagesetting.json

`path: "category"` kaydını tamamla (şu an modulestatus boş):

```json
{
  "name": "Kategori",
  "path": "category",
  "desc": [],
  "data": [],
  "index": …,
  "desing": { "header": [], "body": ["t1pd01", "t1pc03"], "footer": [] },
  "modulestatus": {
    "page": true, "body": true, "detail": true,
    "img": true, "bgimg": false, "icon": true
  }
}
```

`products` kaydı kalsın (ürünler kategorisi). Sıra önerisi: `page` → `category` → `products` → `kurumsal` (veya mantıklı index; menü kırılmasın).

## C) Modül bağları (`modules.json`) — kritik

Liste modülleri **kategori** dosyasını okumalı:

| id | path | `desing.page` | `desing.category` |
|----|------|---------------|-------------------|
| `t1ls01` | page-list-3 | **`category`** | `""` |
| `t1plpr` | page-list | **`category`** | `""` (page-list zaten `category==""` filtreler) |
| `t1pc03` | page-category-3 | **`products`** (ürünleri çek) | — |

`page.json` Ürünler hub (`hs54qzyeyo`): body `["t1pd01","t1plpr"]` — t1plpr artık category listeler → hub doğru.

## D) Webmodules düzeltmesi (ayrımın çalışması için ZORUNLU)

### 1) `webmodules/body/page-category-3/back.js`

Şu an yalnızca `webmakerdata[page.categorypage]` okuyor → kategori sayfasında `categorypage=="category"` olunca ürünleri bulamaz.

**Düzelt:** kaynak sıra:
1. `json.desing.page` varsa ve `webmakerdata[json.desing.page].data` varsa onu kullan
2. yoksa `page.categorypage` fallback

`for...of` yerine klasik `for` + `var` (Matrix back.js kuralı). Davranış: `iterator.category == page.id` ve `status=="play"`.

W1: sabit TR metin ekleme. Test: `node webmodules/test/run.js` veya en azından sözdizimi kontrol.

### 2) `webmodules/body/page-desing-otomavi/back.js`

Ürün detayda parent kategori artık `category.json`’da:

- Parent bulma: önce `webmakerdata.category.data` içinde `id === page.category`, yoksa eski `productsData` taraması
- Related / ürün listesi: **ürünler** için `webmakerdata.products.data` (categorypage products iken zaten; zorunlu fallback `webmakerdata.products`)
- Breadcrumb “Ürünler/Kategori” etiketi: `webmakerdata.category.name` veya products name — Oto Mavi’de breadcrumb’da kategori kökü `category` ise onu kullan
- Kategori sayfası (`categorypage==="category"`, `page.category===""`): related grid zorunlu değil; ürün grid’i `t1pc03` yapar

Global `page-desing-5` bozma.

## E) .cursorrules (otomavi) güncelle

`D:\projeler\otomavi\Web\matrix\.cursorrules` içindeki “Model B nesting (tek products.json)” notunu değiştir:

- Kategoriler → `category.json`
- Ürünler → `products.json` (`category` = kategori id)
- Ana sayfa liste `t1ls01.desing.page=category`
- Kategori detay `t1pc03.desing.page=products`

## F) Render + dogrula

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi"}'
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi
```

Manuel kontrol listesi (log’a yaz):
1. Ana sayfa kategori kartları görünür (21)
2. Bir kategori sayfası → alt ürün kartları (`t1pc03`)
3. Bir ürün detay → breadcrumb parent adı doğru + benzer ürünler
4. `products.json` içinde `category:""` yok; `category.json` içinde dolu `category` yok

Kanıt: `data/yonetici/19_run.log` + sayılar.

## Yasaklar

- Üst kategori satırını products’ta bırakmak
- Ürün satırını category.json’a koymak
- ID’leri yeniden üretmek (page-id gerekmez — mevcut id taşınır)
- eticaret / sepet
- Commit / push yok
- Yasak JSON alanları

## DONE

- category.data.length === 21 (veya mevcut üst sayısı)
- products.data.length === 89 (veya mevcut ürün sayısı); hepsinde category dolu
- dogrula hata=0
- render status=ok
- kategori sayfasında ürün grid dolu
