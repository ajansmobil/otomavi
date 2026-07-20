# Paket 18 — Webrender + hata kapatma döngüsü

rol: web  
cwd: `D:\projeler\otomavi\Web\matrix`  
Bağımlılık: 15–17 uygulandıktan sonra (veya ara denetim olarak 15 sonrası da kısmi çalıştırılabilir)

## Amaç

Her değişikliğin public çıktıya yansıması ve dogrula/render uyarılarının kapatılması. Kanıtsız “yapıldı” yok.

## Adımlar (sıra zorunlu)

### 1) Full render

```powershell
$r = Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi"}'
$r | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 data/yonetici/18_render.json
```

Beklenen: HTTP/status başarı, `renderId` dolu. `warnings` varsa listele.

### 2) Dogrula

```powershell
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi > data/yonetici/18_dogrula.txt
```

Hedef: **hata=0**. Uyarı varsa tek tek değerlendir; proje JSON’undan düzeltilebilenleri düzelt.

### 3) Çıktı sızıntı kontrolü

Public HTML’de (`D:\projeler\otomavi\web\public` veya projedeki kanonik public):

- `{{` / `@` / `--undefined` / `src=...undefined` ara
- Kırık ürün/kategori linkleri (yeni id’ler)
- Ana sayfa + bir üst kategori + bir ürün detay + iletişim sayfasını manuel kontrol listesine yaz

### 4) Düzelt → tekrar render

Hata/kritik sızıntı varsa JSON düzelt → tekrar adım 1–2. En fazla 3 tur; kalırsa `18_run.log`’a “bilinçli ertelenen” + gerekçe.

### 5) Özet metrikler (`18_run.log`)

- Üst kategori sayısı / ürün sayısı (`products.json`)
- renderId + warningCount
- dogrula hata/uyarı
- Bilinçli ertelenenler (menu-2 hardcoded vb.)

## Yasaklar

- Commit / push yok
- dogrula’yı geçiştirme / çıktıyı silme
- eticaret açma

## DONE

- render başarı + dogrula hata=0
- `18_render.json` + `18_dogrula.txt` + `18_run.log` mevcut
