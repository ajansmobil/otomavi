# Paket 12b — ICERIK uyarı: placeholder anahtar adı

cwd: `D:\matrix` (webmodules) + `D:\projeler\otomavi\Web\matrix` (proje JSON)

## Sorun
dogrula uyarı: `modules.json — placeholder yönerge/adres metni`
Sebep: `vinPlaceholder` / `placeholdercolor` anahtar adları (uydurma-metin tarayıcısı "placeholder" içeren key'leri bayraklıyor).

## Yapılacaklar (kod yaz; commit YOK)

### 1) webmodules kütüphanesi — `D:\matrix\webmodules\body\arac-parca-arama\`
Rename:
- `vinPlaceholder` → `vinHint` (vinLabel değil — tutarlı hint ailesi)
- `placeholdercolor` → `hintcolor`

Dosyalar:
- `index.json` — desing anahtarları
- `index.html` — `{{vinPlaceholder}}` → `{{vinHint}}`; `--placeholdercolor--` → `--hintcolor--`
- `back.js` — varsa referansları güncelle (yoksa dokunma)

`phMake` / `phModel` vb. anahtarlara dokunma (bunlar "placeholder" substring içermiyor).

### 2) Oto Mavi proje — `D:\projeler\otomavi\Web\matrix\modules.json`
Modül `t1af01.desing` içinde aynı rename:
- `vinPlaceholder` → `vinHint`
- `placeholdercolor` → `hintcolor`

### 3) Doğrulama
```
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```
Hedef: **uyarı=0** (en azından placeholder uyarısı kalkmalı).

### 4) Log
`D:\projeler\otomavi\Web\matrix\data\yonetici\12b_run.log` yaz:
- değişen dosyalar
- rename özeti
- analiz çıktısı (uyarı/hata sayıları)
- commit yok notu

## Kısıtlar
- Commit / push yok
- Gereksiz refactor yok
- Yalnızca bu iki anahtar ailesi
