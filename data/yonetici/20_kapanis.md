# Paket 20 — Tasarım yenileme kapanış

**Tarih:** 2026-07-20  
**Render:** `mode:matrix` zorunlu · son `lalvm86s` · warn=0 · dogrula hata=0

## Teşhis → çözüm

| Sorun | Çözüm |
|-------|--------|
| Zigzag `page-list-3` | Yeni `page-list-otomavi` → `t1ls02` grid 4/3/2 |
| Lacivert arama kutusu | `arac-parca-arama-otomavi` açık panel + detay filtre |
| Lacivert yorgunluk | Stats/intro açık zemin; CTA tek koyu band |
| Boş HTML render | `{"path":"otomavi","mode":"matrix"}` |
| Slider `--bgcolor--` | `k4t90c.desing.bgcolor=#0B3A6E` |

## Ana sayfa body

`t1af01` → `t1ls02` → `t1st01` → `t1in01` → `t1ct01`

Önizleme: http://localhost:8080/tr/
