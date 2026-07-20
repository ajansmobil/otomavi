# Paket 21 — CTA + Footer renk (site paletine)

rol: web  
cwd: `D:\matrix` (modül) + `D:\projeler\otomavi\Web\matrix` (instance)  
Palet: `#0B3A6E` `#02427A` `#E9F3FB` `#FFFFFF` `#111827`  
Render: `{"path":"otomavi","mode":"matrix"}`

## Sorun (kullanıcı ekran görüntüsü)

1. **CTA (`t1ct01` / `cta-1`):** Buton yazıları koyu/siyah → lacivert zeminde okunmuyor; siteyle alakasız görünüm.
2. **Footer (`txt39m` / `footer-5`):** Ana zemin **hardcoded fallback `#cd9624` (sarı)** + alt şerit **`#238b23` (yeşil)** — Oto Mavi lacivert paletiyle hiç uyumsuz. Instance’taki `color` bu CSS variable’lara bağlanmıyor.

## A) `webmodules/body/cta-1` (modül düzelt)

`index.html` buton stilleri:
- **Primary:** arka plan `#FFFFFF`, yazı + ikon `#0B3A6E` (yüksek kontrast). Hover: hafif `#E9F3FB`.
- **Secondary:** şeffaf + beyaz border, yazı `#FFFFFF` (span + material icon dahil `color` kalıtımı).
- Hardcoded koyu metin bırakma; `color` buton ve `> *` / `.material-symbols-outlined` için net.
- Mevcut `--btnbg--` / `--btncolor--` token’larını kullanmaya devam et; varsayılan `index.json` desing: `btnbg:#ffffff`, `btncolor:#0B3A6E`.

W2: transition koru. Global diğer siteler: beyaz primary daha okunaklı (eski turuncu varsayılan zaten değişiyordu).

## B) `webmodules/footer/footer-5` (modül düzelt — zorunlu)

`index.html` içindeki sarı/yeşil fallback’leri kaldır:

| Eski fallback | Yeni (Oto Mavi uyumlu varsayılan) |
|---------------|-------------------------------------|
| `#cd9624` footer bg | `#0B3A6E` veya `#E9F3FB` (tercih: koyu lacivert `#0B3A6E`, metin beyaz) |
| `#000` text | `#FFFFFF` / `#E9F3FB` |
| `#238b23` bottom / social / hover | `#02427A` (koyu lacivert ton) |

Daha iyi: `--key--` placeholder kullan (moduleRender desing replace):
- `--footer_bg--`, `--footer_text--`, `--footer_bottom_bg--`, `--footer_link_hover--`, `--social_bg--`
- `var(--footer-bg-color, …)` yerine doğrudan `background-color: --footer_bg--;` (Matrix desing token stili)

`index.json` desing varsayılanlarına bu anahtarları ekle.  
`back.js` bozulmasın.

Poppins Google Fonts harici link kalabilir veya bırak (kapsam dışı zorunlu değil).

## C) Oto Mavi `modules.json`

### `t1ct01`
```
btnbg: "#FFFFFF"
btncolor: "#0B3A6E"
gradient: "linear-gradient(135deg, #0B3A6E 0%, #02427A 100%)"
```

### `txt39m`
```
footer_bg: "#0B3A6E"
footer_text: "#FFFFFF"
footer_bottom_bg: "#02427A"
footer_link_hover: "#E9F3FB"
social_bg: "#02427A"
color: "#0B3A6E"  // varsa koru / uyumlu
```
(Token adları A/B’de ne yazdıysan birebir aynı olsun.)

## D) Render + doğrula

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost/webmaker/services/webmaker/" -ContentType "application/json" -Body '{"path":"otomavi","mode":"matrix"}'
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```

Kontrol: `public/tr/style.css` içinde `#cd9624` / `#238b23` **kalmasın**; CTA primary `color` açıkça lacivert veya beyaz (okunaklı).

Kanıt: `data/yonetici/21_run.log`

## Yasak

- Commit / push yok
- Sarı/yeşil fallback bırakma
- `mode` olmadan render yok

## DONE

- Footer sarı/yeşil yok; lacivert Oto Mavi
- CTA buton metinleri okunaklı, site paleti
- dogrula hata=0 · render ok
