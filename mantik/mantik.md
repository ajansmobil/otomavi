# Oto Mavi — mantik (öğrenilen kurallar)

> Agent günceller. Proje kanonu: `.cursorrules` · Paket log: `data/yonetici/`  
> Son güncelleme: 2026-07-20 (Paket 23–29 oturumu)

## Sipariş modeli (KATI)

- `eticaret: false` · `order: false` — **sepet yok**
- CTA dili: **WhatsApp ile Sipariş** (Teklif Al / Sepete Ekle kullanılmaz)
- wa.me metin: “…WhatsApp siparişi oluşturmak istiyorum…”
- Tel: `0544 717 18 28` · WA: `905447171828`

## Modül haritası

| Yer | Modül id | path |
|-----|----------|------|
| Ana arama | `t1af01` | `arac-parca-arama-otomavi` |
| Ana kategori grid | `t1ls02` / `t1plpr` | `page-list-otomavi` |
| Kategori detay | `t1af01` + `t1ulo01` | arama + `urun-liste-otomavi` |
| Ürün detay | `t1udo01` | `urun-detay-otomavi` |
| Kurumsal / iç sayfa | `tp5jo4` | **`page-desing-5`** |
| CTA şerit | `t1ct01` | `cta-1` |
| Slider | `k4t90c` | `slider-text` |
| İletişim harita | `bi4hta` | `map` — görsel `img/bi4hta/map.png` · `backgroundcolor: #ffffff` |

**Kullanılmaz:** `t1pd01` / `page-desing-otomavi` (iç sayfa UX zayıf — Paket 29 ile değiştirildi).

## Harita (map)

- Dalga SVG fill = `desing.backgroundcolor` → **beyaz** (`#ffffff`); siyah dalga haritayı yutar
- Varsayılan: `webmodules/body/map|map-2|map-3` `backgroundcolor: #ffffff`
- Görsel: Sanayi Mah. (Şehitkamil) statik harita → `matrix/img/bi4hta/map.png`
- Tıklanınca `externalUrl` Google Maps araması

## SSS / FAQ (KATI yasak)

- Üst menü, Hakkımızda altı, footer’da **SSS / Sıkça Sorulan Sorular yok**
- Sorular WhatsApp / telefon ile

## Kontrast (KATI)

- Kök neden: `webmodules/ham/src/css.css` → `a:link,a:visited{color:#000}` özgüllüğü sınıfı ezer
- Koyu dolgu `<a>` butonlarda: `color: #ffffff !important` (+ span/ikon)
- Örnekler: İncele, WhatsApp ile Sipariş, slider “Ürünleri İncele”, WA “sor”
- WhatsApp buton zemin: `#25D366` + beyaz yazı

## Veri modeli

- `category.json`: üst kategoriler (`category: ""`)
- `products.json`: ürünler (`category: <kategori-id>`) — karışık nesting yok
- Render: `{"path":"otomavi","mode":"matrix"}` zorunlu

## Menü

Anasayfa(@home) · Ürünler · Hakkımızda · İletişim — SSS yok

## Menü dropdown (menu-2)

- Alta inince kaybolma: hover köprüsü (`::before`) + `margin-top` boşluğu kaldırıldı
- Aktif satır taşması: dropdown `padding:0` + `overflow:hidden` + köşe radius son/ilk satırda
