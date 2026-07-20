# Oto Mavi (otomavi) — Yönetici Analiz ve Plan

**Tarih:** 2026-07-20  
**Hedef kök:** `D:\projeler\otomavi\Web\matrix`  
**Referans site:** http://www.geotechotomotiv.com/ (eski marka Geotech Otomotiv)  
**Yeni marka / domain:** Oto Mavi · otomavi.com  
**Yönetici modu:** Kod yazılmaz — Cursor CLI (`agent --yolo -p`) paketlerle çalıştırılır.

---

## 1. İş özeti

Geotech Otomotiv (Gaziantep BMW oto yedek parçaları) marka değişikliği ile **Oto Mavi / otomavi.com** olarak yeniden kurulacak. Matrix WebMaker kurumsal sitesi eksiksiz bitirilecek: doğrulama 0 hata, dolu ana sayfa, gerçek iletişim, ürün kategorileri, kurumsal sayfalar, slider görselleri.

## 2. Mevcut durum (kanıt)

| Alan | Durum |
|------|--------|
| Proje | `public/data/proje/otomavi` · web=true · skor=0 |
| Tema | `kurumsal/1` · `eticaret: false` |
| setting | domain `otomavi.com` ama açıklama hâlâ “oto boya/kaplama” (YANLIŞ kimlik) |
| modules | t1in01/t1st01/t1ct01 metinleri boya/kaplama (YANLIŞ) |
| page/kurumsal içerik | BMW yedek parça (DOĞRU yön) |
| İletişim placeholder | `0530 000 00 00` (uydurma — dogrula reddeder) |
| dogrula | **26 hata / 4 uyarı** (R15/R16/DIL ağırlıklı) |
| Slider R16 | tek slayt, `img` boş; semantik dosya adı eksik |
| products.json | kategori listesi yok; tek özet metin |
| pagesetting | page.modulestatus.detail=true (R13 ile çelişki riski) |

## 3. Referans site özellikleri (Geotech → Oto Mavi)

Kaynak: [geotechotomotiv.com](http://www.geotechotomotiv.com/)

### Korunacak / taşınacak

- Kimlik: Gaziantep BMW / oto yedek parça
- Adres: Sanayi mah. 60081 nolu cadde no 43 Şehitkamil Gaziantep
- Telefon: 0544 717 18 28
- Destek: WhatsApp + hızlı iletişim
- Ana kategori grupları: Klima, Kayışlar, Frenler, Gövde, Sönümleme, Elektrik, Filtreler, Ateşleme, İç donanım, Yağlar/sıvılar, Silecekler, Süspansiyon, Aydınlatma, Motor, Bakım kiti, vb.
- Kurumsal: Hakkımızda, (opsiyonel Kariyer/SSS), İletişim
- Değer önerisi: uygun fiyat, 1. sınıf kalite, hızlı teslimat

### WebMaker kapsamı (bu oturum)

WebMaker **kurumsal katalog** üretir; Magento tarzı sepet/ödeme/araç-yıl filtresi native değil.

| Özellik | Karar |
|---------|--------|
| Marka + domain + SEO | ZORUNLU — Oto Mavi / otomavi.com |
| Ana sayfa: slider + kategori grid + tanıtım + CTA + footer | ZORUNLU |
| Ürün kategorileri (products) | ZORUNLU — Geotech departmanları |
| Kurumsal sayfalar + yasal | ZORUNLU |
| Gerçek iletişim + WhatsApp | ZORUNLU |
| Sepet / hesap / araç make-model filtresi | KAPSAM DIŞI (ticaret motoru yok) — ihtiyaç varsa ELO talimat/feature paketi |
| Slider görselleri (ComfyUI, yazısız) | ZORUNLU (R16) |

## 4. Mantık hataları / borç

1. **Çift kimlik:** boya/kaplama vs BMW yedek parça → tek kimlik: BMW/yedek parça Oto Mavi.
2. **R15 ihlali:** `spot`/`desc` üst listede.
3. **R13:** `page.json` modulestatus `detail:false`, `img:false` olmalı; text detay/liste kuralına göre.
4. **R16:** en az 2 slider görseli, `data[].img` dolu, semantik ad, diskte var.
5. **Uydurma veri:** `0530 000 00 00` → 0544 717 18 28.
6. **products:** gerçek kategori satırları + `page/<id>/index.json`.
7. **Menü:** Anasayfa dışı linkler (Ürünler, Hakkımızda, İletişim).

## 5. Paket sırası (bağımlılık)

| # | Paket | cwd | Amaç |
|---|-------|-----|------|
| 01 | `01_elo_feature_gap.md` | `D:\projeler\elo\web` | Eksik talimat/feature var mı? Varsa ekle |
| 02 | `02_kimlik_ve_dogrula.md` | `D:\projeler\otomavi\Web\matrix` | Kimlik + R13/R15/DIL + iletişim |
| 03 | `03_urun_katalog_anasayfa.md` | aynı | products kategorileri + ana sayfa modülleri |
| 04 | `04_slider_gorsel_r16.md` | aynı | ComfyUI + R16 bağlama |
| 05 | `05_final_dogrula_done.md` | aynı | dogrula 0 hata + kapanış kanıtı |

## 6. Doğrulama komutları

```bash
# ELO (port 81)
curl "http://localhost:81/api/talimat/?run=web&path=D:/projeler/otomavi/Web/matrix"

# veya
node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli
```

**DONE şartı:** dogrula hata=0; setting/modules tutarlı Oto Mavi BMW yedek parça; slider ≥2 görsel; iletişim gerçek.

## 7. Riskler

- ComfyUI kapalıysa slider paketi bekler / yeniden dener.
- Araç filtresi talep edilirse ELO feature paketi gerekir (01).
- Ürün stoğu/fiyat canlı değil — katalog tanıtım seviyesinde.
