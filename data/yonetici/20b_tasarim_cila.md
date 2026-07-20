# Paket 20b — Tasarım cila + render mode fix

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix` (+ gerekirse `D:\matrix`)

## Acil bilinenler (Paket 20 sonrası)

1. Render **zorunlu**: `{"path":"otomavi","mode":"matrix"}` — `mode` yoksa `webmodulepath=modul` (klasör yok) → boş `#header/#content/#footer`. `.cursorrules` + `20_run.log` not et.
2. Slider uyarısı: `style="--slide-bg--:--bgcolor--"` — `k4t90c` desing’e `bgcolor: "#0B3A6E"` (veya `#111827`) ekle.
3. Menü: logo + tüm linkler (Anasayfa/Ürünler/Hakkımızda/İletişim/SSS) masaüstünde görünür olmalı; `vey1el` renkleri kontrol.
4. `t1ls02` / `t1af01` grid+kompakt arama zaten bağlı — görsel ince ayar:
   - Arama paneli hero altına taşmasın; margin/padding
   - Kategori kartı description 2 satır ellipsis (modül CSS)
5. `stats-1` gradient solid `#E9F3FB` ise gerçek gradient veya düz bgcolor token’ına çevir (kırık CSS olmasın)

## Yap

- Yukarıdaki JSON/desing düzeltmeleri
- `POST .../webmaker/` body `{"path":"otomavi","mode":"matrix"}`
- dogrula hata=0; placeholder `--bgcolor--` ana sayfada kalmasın (slider)
- `data/yonetici/20_run.log` yaz (Paket 20+20b özeti)

## Yasak

- Commit yok
- Global slider-text’i tüm projeler için bozma — instance desing yeterliyse onu kullan

## DONE

- mode:matrix ile dolu HTML
- ana sayfa grid + açık arama
- dogrula 0 · placeholder kritik yok
