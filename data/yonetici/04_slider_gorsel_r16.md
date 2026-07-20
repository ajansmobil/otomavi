# Paket 04 — Slider görselleri R16 (ComfyUI)

## Rol
Cursor CLI geliştirici. **cwd:** `D:\projeler\otomavi\Web\matrix`

## Amaç
R16: slider modülü `k4t90c` (path: slider-text) en az **2** konuya uygun, **yazısız** görsel; `data[].img` dolu; dosyalar diskte.

## Kurallar (R16)
- Tema placeholder (`1.jpg`, `1.webp` yalnız sayı) YASAK → semantik ad:
  - `slider-otomavi-yedek-parca-01.webp`
  - `slider-otomavi-bmw-parca-02.webp`
- Prompt: BMW/oto yedek parça atölye/parça atmosferi; **no text, no typography, no letters, no words, no logo, no watermark**
- Dosya yolu: `img/k4t90c/<dosya>` veya `img/<dosya>` — modules.json data[] ile bağla
- En az 2 slayt

## Yapılacaklar
1. ComfyUI MCP/CLI ile 2 görsel üret (Flux/uygun workflow)
2. `modules.json` → k4t90c.data: `[{ "img": "..." }, { "img": "..." }]` (slider-text şemasına uygun; bg yerine img kullan — şablon ne istiyorsa index.json’dan oku)
3. `D:\matrix\webmodules\header\slider-text\index.json` oku — doğru alan adı (`img` vs `bg`)
4. Eski `1.webp` / sayısal adları kaldır veya yedekte bırak; aktif data semantik olsun
5. OCR/vision mümkünse yazı kontrolü

## ComfyUI yoksa
- Durumu `04_run.log`’a yaz; alternatif: mevcut `slider-oto-mavi-01.webp` + ikinci üretim denemesi
- R16 geçmeden DONE iddia etme

## Doğrulama
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
curl "http://localhost:81/api/talimat/?run=web&path=D:/projeler/otomavi/Web/matrix"
```
R16 hataları 0 olmalı.

## Çıktı
`data/yonetici/04_run.log`
