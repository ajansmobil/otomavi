# Paket 08 — Ürün ağacı (Model B)

Tarih: 2026-07-20 · Marka: Oto Mavi · eticaret: false

## Özet

- Üst kategori (category: ""): **14**
- Ürün (category: <üst-id>): **43**
- Modül: `t1pc03` → path `page-category-3`
- Üst kategori body: `[tp5jo4, t1pc03]`
- Ana sayfa liste: `t1ls01` page-list-3 · page=products · category=""
- Görsel: kategori başına 1 özgün ComfyUI + diğer ürünler üst kategori `index.webp` kopyası
- Doğrulama: `webmaker-analiz.js otomavi` → **hata=0** (PAKET08_OK)

## Üst → Alt

| Üst id | Üst path | Ürün id | Ürün path | Ürün adı |
|--------|----------|---------|-----------|----------|
| omfltr01 | filtreler | omfykt1a | yakit-filtresi | Yakıt Filtresi |
| omfltr01 | filtreler | omfhva1b | hava-filtresi | Hava Filtresi |
| omfltr01 | filtreler | omfyag1c | yag-filtresi | Yağ Filtresi |
| omfltr01 | filtreler | omfpln1d | polen-filtresi | Polen Filtresi |
| omfren02 | frenler | omfdsk2a | fren-diski | Fren Diski |
| omfren02 | frenler | omfblt2b | fren-balatasi | Fren Balatası |
| omfren02 | frenler | omfhyd2c | fren-hidroligi | Fren Hidroliği |
| omgvde03 | govde | omgtmp3a | tampon | Tampon |
| omgvde03 | govde | omgayn3b | yan-ayna | Yan Ayna |
| omgvde03 | govde | omgpnl3c | kaporta-paneli | Kaporta Paneli |
| ommotr04 | motor | ommcta4a | conta-seti | Conta Seti |
| ommotr04 | motor | ommsgt4b | sogutma-parcasi | Soğutma Parçası |
| ommotr04 | motor | ommsns4c | motor-sensoru | Motor Sensörü |
| omelek05 | elektrik | omeaku5a | aku | Akü |
| omelek05 | elektrik | omealt5b | alternator | Alternatör |
| omelek05 | elektrik | omemrs5c | mars-motoru | Marş Motoru |
| omsusp06 | sonumleme | omsamr6a | amortisor | Amortisör |
| omsusp06 | sonumleme | omsyay6b | helezon-yay | Helezon Yay |
| omsusp06 | sonumleme | omsbrc6c | salincak-burcu | Salıncak Burcu |
| omklma07 | klima | omkkmp7a | klima-kompresoru | Klima Kompresörü |
| omklma07 | klima | omkknd7b | kondanser | Kondanser |
| omklma07 | klima | omkkrt7c | kurutucu | Kurutucu |
| omatsg08 | atesleme | omatbj8a | buji | Buji |
| omatsg08 | atesleme | omatbb8b | atesleme-bobini | Ateşleme Bobini |
| omatsg08 | atesleme | omatkz8c | kizdirma-bujisi | Kızdırma Bujisi |
| omsivi09 | yaglar | omsyag9a | motor-yagi | Motor Yağı |
| omsivi09 | yaglar | omsant9b | antifriz | Antifriz |
| omsivi09 | yaglar | omsfrn9c | fren-hidroligi-sivi | Fren Hidroliği (Sıvı) |
| ombkim10 | bakim-kiti | ombper0a | periyodik-bakim-seti | Periyodik Bakım Seti |
| ombkim10 | bakim-kiti | ombflt0b | filtre-seti | Filtre Seti |
| ombkim10 | bakim-kiti | ombcnt0c | conta-kiti | Conta Kiti |
| omicdn11 | ic-donanim | omicps1a | paspas-seti | Paspas Seti |
| omicdn11 | ic-donanim | omictr1b | ic-trim | İç Trim |
| omicdn11 | ic-donanim | omickl1c | kol-dayama | Kol Dayama |
| omaydn12 | aydinlatma | omafr2a | far | Far |
| omaydn12 | aydinlatma | omastp2b | stop-lambasi | Stop Lambası |
| omaydn12 | aydinlatma | omasis2c | sis-fari | Sis Farı |
| omkysi13 | kayislar | omkvky3a | v-kayisi | V Kayışı |
| omkysi13 | kayislar | omktrg3b | triger-seti | Triger Seti |
| omkysi13 | kayislar | omkgrg3c | gergi | Gergi |
| omslck14 | silecekler | omslst4a | silecek-lastigi | Silecek Lastiği |
| omslck14 | silecekler | omslkl4b | silecek-kolu | Silecek Kolu |
| omslck14 | silecekler | omslfs4c | fiskiye-pompasi | Fıskiye Pompası |

## Doğrulama notları

- page-list-* yalnız `category: ""` gösterir → ana sayfa / ürünler grid üst kategoriler
- page-category-3 `category == page.id` → kategori sayfasında ürün kartları
- Sepet / ödeme / Magento YMM yok
