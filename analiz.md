# Oto Mavi (otomavi) — Proje Analizi

> Kanonik kurallar: [`.cursorrules`](.cursorrules) · [`mantik/mantik.md`](mantik/mantik.md)  
> Referans: [geotechotomotiv.com](https://www.geotechotomotiv.com/)  
> Güncelleme: 2026-07-20 (Paket 23–29)

## Özet

Geotech içeriği Oto Mavi markasıyla Matrix WebMaker kataloğunda. **Sepet yok** (`eticaret: false`); sipariş **WhatsApp ile Sipariş** / telefon.

## Modül özeti (güncel)

| Alan | Body |
|------|------|
| Ana sayfa | `t1af01` → `t1ls02` → `t1st01` → `t1in01` → `t1ct01` |
| Kategori | `t1af01` + `t1ulo01` |
| Ürün | `t1udo01` |
| Kurumsal / iç | `tp5jo4` (**page-desing-5**) — `t1pd01` yok |
| Menü | Ürünler · Hakkımızda · İletişim — **SSS yok** |

## Veri

- `category.json`: 21 üst · `products.json`: 89 ürün (ayrı dosyalar)
- Render: `{"path":"otomavi","mode":"matrix"}`

## Öğrenilen yasaklar

1. Sepete Ekle / Teklif Al CTA yok → WhatsApp sipariş
2. SSS/FAQ yok
3. Koyu buton + siyah yazı yok (`a:link` ezer → `!important` beyaz)
4. `page-desing-otomavi` iç sayfada kullanılmaz → page-desing-5

## Paketler

| Paket | Konu |
|-------|------|
| 23 | urun-liste-otomavi |
| 24 | urun-detay-otomavi |
| 25 | WA sipariş dili |
| 26–28 | Kontrast (WA / İncele / slider) |
| 27 | SSS kaldır |
| 29 | İç sayfa → page-desing-5 |

Detay log: `data/yonetici/NN_*.md` / `NN_run.log`
