
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const PAGE = path.join(ROOT, "page");
const TODAY = "2026-07-20";
const TEL = "0544 717 18 28";
const MAIL = "info@otomavi.com";


const CATS = [
  {
    id: "omfltr01",
    path: "filtreler",
    name: "Filtreler",
    icon: "filter_alt",
    desc: "Yakıt, hava, yağ ve polen filtreleri — BMW motor ve kabin koruması için Oto Mavi stokları.",
    keyword: "filtre, yakıt filtresi, hava filtresi, yağ filtresi, polen filtresi, BMW, Oto Mavi",
    title: "Filtreler | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Filtreler</h2><p style=\"font-size: 16px;\">Oto Mavi olarak BMW araçlarınız için yakıt, hava, yağ ve polen filtrelerini orijinal ve eşdeğer seçeneklerle sunuyoruz. Temiz yakıt hattı, sağlıklı yanma ve kabin hava kalitesi için doğru filtre kritiktir.</p><p style=\"font-size: 16px;\">Periyodik bakımlarda filtre değişimini ihmal etmeyin; tıkanmış filtre yakıt tüketimini artırır ve motor ömrünü kısaltır. Stok ve uyumluluk için " + TEL + " veya " + MAIL + " üzerinden Oto Mavi’ye ulaşın.</p>",
  },
  {
    id: "omfren02",
    path: "frenler",
    name: "Frenler",
    icon: "disc_full",
    desc: "Balata, disk, kaliper ve fren hidroliği — güvenli duruş için Oto Mavi fren parçaları.",
    keyword: "fren, fren diski, fren balatası, fren hidroliği, BMW fren, Oto Mavi",
    title: "Frenler | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Frenler</h2><p style=\"font-size: 16px;\">Oto Mavi fren parçaları: disk, balata ve hidrolik bileşenlerle BMW araçlarınızda güvenli duruş. Orijinal ve eşdeğer seçeneklerle stoktan hızlı tedarik.</p><p style=\"font-size: 16px;\">Sipariş ve uyumluluk için " + TEL + " veya WhatsApp üzerinden bize yazın.</p>",
  },
  {
    id: "omgvde03",
    path: "govde",
    name: "Gövde",
    icon: "directions_car",
    desc: "Kaporta, tampon, çamurluk ve panel parçaları — BMW gövde onarımı için Oto Mavi.",
    keyword: "gövde, tampon, yan ayna, kaporta, BMW kaporta, Oto Mavi",
    title: "Gövde | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Gövde</h2><p style=\"font-size: 16px;\">Tampon, ayna ve kaporta panelleri için Oto Mavi stokları. BMW gövde onarımında doğru parça, doğru renk ve hızlı sevkiyat.</p><p style=\"font-size: 16px;\">Teknik destek: " + TEL + " · " + MAIL + "</p>",
  },
  {
    id: "ommotr04",
    path: "motor",
    name: "Motor",
    icon: "settings",
    desc: "Motor parçaları, conta, kayış seti ve soğutma bileşenleri — Oto Mavi BMW motor çözümleri.",
    keyword: "motor parçası, conta seti, soğutma, motor sensörü, BMW motor, Oto Mavi",
    title: "Motor | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Motor</h2><p style=\"font-size: 16px;\">Conta, soğutma ve sensör grubunda Oto Mavi BMW motor çözümleri. Atölye ve araç sahipleri için güvenilir stok.</p><p style=\"font-size: 16px;\">Sipariş: " + TEL + "</p>",
  },
  {
    id: "omelek05",
    path: "elektrik",
    name: "Elektrik",
    icon: "bolt",
    desc: "Akü, sensör, alternatör ve kablo demeti — BMW elektrik sistemi için Oto Mavi.",
    keyword: "akü, alternatör, marş motoru, BMW elektrik, Oto Mavi",
    title: "Elektrik | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Elektrik</h2><p style=\"font-size: 16px;\">Akü, alternatör ve marş motoru başta olmak üzere BMW elektrik sistemi parçaları Oto Mavi’de.</p><p style=\"font-size: 16px;\">İletişim: " + TEL + " · " + MAIL + "</p>",
  },
  {
    id: "omsusp06",
    path: "sonumleme",
    name: "Sönümleme / Süspansiyon",
    icon: "tire_repair",
    desc: "Amortisör, yay, salıncak ve burç — konforlu yol tutuş için Oto Mavi süspansiyon.",
    keyword: "amortisör, helezon yay, salıncak burcu, süspansiyon, BMW, Oto Mavi",
    title: "Sönümleme / Süspansiyon | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Sönümleme / Süspansiyon</h2><p style=\"font-size: 16px;\">Amortisör, yay ve burçlarla konforlu yol tutuş. BMW süspansiyon bakımı için Oto Mavi stokları.</p><p style=\"font-size: 16px;\">Destek: " + TEL + "</p>",
  },
  {
    id: "omklma07",
    path: "klima",
    name: "Klima",
    icon: "ac_unit",
    desc: "Kompresör, kondanser, fan ve klima gazı ekipmanı — BMW klima için Oto Mavi.",
    keyword: "klima kompresörü, kondanser, kurutucu, BMW klima, Oto Mavi",
    title: "Klima | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Klima</h2><p style=\"font-size: 16px;\">Kompresör, kondanser ve kurutucu ile BMW klima sistemi parçaları. Yaz konforu için doğru ürün, hızlı tedarik.</p><p style=\"font-size: 16px;\">Sipariş: " + TEL + "</p>",
  },
  {
    id: "omatsg08",
    path: "atesleme",
    name: "Ateşleme ve Ön Isıtma",
    icon: "local_fire_department",
    desc: "Buji, bobin, kızdırma bujisi ve ateşleme kablosu — soğuk çalıştırma için Oto Mavi.",
    keyword: "buji, ateşleme bobini, kızdırma bujisi, BMW ateşleme, Oto Mavi",
    title: "Ateşleme ve Ön Isıtma | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Ateşleme ve Ön Isıtma</h2><p style=\"font-size: 16px;\">Buji, bobin ve kızdırma bujisi ile sağlıklı ateşleme. Soğuk çalıştırma sorunlarında Oto Mavi stoklarına bakın.</p><p style=\"font-size: 16px;\">İletişim: " + TEL + "</p>",
  },
  {
    id: "omsivi09",
    path: "yaglar",
    name: "Yağlar ve Sıvılar",
    icon: "water_drop",
    desc: "Motor yağı, antifriz, fren ve direksiyon sıvıları — BMW bakım sıvıları Oto Mavi’de.",
    keyword: "motor yağı, antifriz, fren hidroliği, BMW yağ, Oto Mavi",
    title: "Yağlar ve Sıvılar | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Yağlar ve Sıvılar</h2><p style=\"font-size: 16px;\">Motor yağı, antifriz ve fren hidroliği dahil BMW bakım sıvıları. Spec uyumlu ürünlerle periyodik bakım.</p><p style=\"font-size: 16px;\">Sipariş: " + TEL + " · " + MAIL + "</p>",
  },
  {
    id: "ombkim10",
    path: "bakim-kiti",
    name: "Bakım Kiti",
    icon: "build",
    desc: "Periyodik bakım setleri: filtre + yağ + conta kombinasyonları — Oto Mavi bakım kiti.",
    keyword: "bakım kiti, periyodik bakım, filtre seti, conta kiti, BMW, Oto Mavi",
    title: "Bakım Kiti | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Bakım Kiti</h2><p style=\"font-size: 16px;\">Periyodik bakım setleri, filtre setleri ve conta kitleri ile tek seferde doğru kombinasyon. Oto Mavi bakım çözümleri.</p><p style=\"font-size: 16px;\">Destek: " + TEL + "</p>",
  },
  {
    id: "omicdn11",
    path: "ic-donanim",
    name: "İç Donanım",
    icon: "airline_seat_recline_extra",
    desc: "Koltuk, panel, kol dayama ve iç trim parçaları — BMW iç donanım Oto Mavi.",
    keyword: "paspas, iç trim, kol dayama, BMW iç donanım, Oto Mavi",
    title: "İç Donanım | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">İç Donanım</h2><p style=\"font-size: 16px;\">Paspas, trim ve kol dayama ile kabin konforu. BMW iç donanım parçaları Oto Mavi stoklarında.</p><p style=\"font-size: 16px;\">İletişim: " + TEL + "</p>",
  },
  {
    id: "omaydn12",
    path: "aydinlatma",
    name: "Aydınlatma",
    icon: "lightbulb",
    desc: "Far, stop, sis ve LED ampul — görünürlük ve güvenlik için Oto Mavi aydınlatma.",
    keyword: "far, stop lambası, sis farı, BMW aydınlatma, Oto Mavi",
    title: "Aydınlatma | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Aydınlatma</h2><p style=\"font-size: 16px;\">Far, stop ve sis farı ile güvenli görünürlük. BMW aydınlatma parçaları Oto Mavi’de.</p><p style=\"font-size: 16px;\">Sipariş: " + TEL + "</p>",
  },
  {
    id: "omkysi13",
    path: "kayislar",
    name: "Kayışlar ve Zincirler",
    icon: "sync",
    desc: "Triger, V kayışı, zincir ve gergi setleri — motor zamanlaması için Oto Mavi.",
    keyword: "V kayışı, triger seti, gergi, BMW kayış, Oto Mavi",
    title: "Kayışlar ve Zincirler | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Kayışlar ve Zincirler</h2><p style=\"font-size: 16px;\">V kayışı, triger seti ve gergi ile motor zamanlaması. BMW kayış/zincir bakımı için Oto Mavi.</p><p style=\"font-size: 16px;\">Destek: " + TEL + "</p>",
  },
  {
    id: "omslck14",
    path: "silecekler",
    name: "Silecekler",
    icon: "water",
    desc: "Silecek lastiği, kol ve su pompası — net görüş için Oto Mavi silecek ürünleri.",
    keyword: "silecek lastiği, silecek kolu, fıskiye pompası, BMW silecek, Oto Mavi",
    title: "Silecekler | Oto Mavi",
    text: "<h2 style=\"font-size: 24px;\">Silecekler</h2><p style=\"font-size: 16px;\">Silecek lastiği, kol ve fıskiye pompası ile net görüş. BMW silecek ürünleri Oto Mavi stoklarında.</p><p style=\"font-size: 16px;\">Sipariş: " + TEL + " · " + MAIL + "</p>",
  },
];


const PRODUCTS = [
  { id: "omfykt1a", cat: "omfltr01", path: "yakit-filtresi", name: "Yakıt Filtresi", icon: "filter_alt",
    desc: "BMW yakıt filtresi — temiz yakıt hattı ve sağlıklı enjeksiyon için Oto Mavi stoku.",
    oem: "OEM / eşdeğer yakıt filtresi; motor koduna göre seçim önerilir.",
    feats: ["Yakıt hattı koruması", "Enjektör ömrünü destekler", "Periyodik bakımda değişim"] },
  { id: "omfhva1b", cat: "omfltr01", path: "hava-filtresi", name: "Hava Filtresi", icon: "air",
    desc: "BMW hava filtresi — motor emiş yolu temizliği ve performans için Oto Mavi.",
    oem: "OEM / eşdeğer hava filtresi; model yılına göre uyumluluk kontrol edin.",
    feats: ["Temiz emiş", "Yanma verimi", "Kolay montaj"] },
  { id: "omfyag1c", cat: "omfltr01", path: "yag-filtresi", name: "Yağ Filtresi", icon: "opacity",
    desc: "BMW yağ filtresi — motor yağının temiz kalması için Oto Mavi yağ filtresi.",
    oem: "OEM / eşdeğer yağ filtresi; yağ değişimiyle birlikte önerilir.",
    feats: ["Yağ temizliği", "Motor koruması", "Bakım setine uygun"] },
  { id: "omfpln1d", cat: "omfltr01", path: "polen-filtresi", name: "Polen Filtresi", icon: "spa",
    desc: "BMW polen / kabin filtresi — iç hava kalitesi için Oto Mavi.",
    oem: "Kabin / polen filtresi; aktif karbonlu seçenekler mevcuttur.",
    feats: ["Kabin hava kalitesi", "Toz ve polen tutma", "Klima konforu"] },
  { id: "omfdsk2a", cat: "omfren02", path: "fren-diski", name: "Fren Diski", icon: "disc_full",
    desc: "BMW fren diski — güvenli duruş için Oto Mavi fren diski seçenekleri.",
    oem: "Ön/arka disk; aks ve model koduna göre seçim.",
    feats: ["Isı dayanımı", "Dengeli frenleme", "OEM / eşdeğer"] },
  { id: "omfblt2b", cat: "omfren02", path: "fren-balatasi", name: "Fren Balatası", icon: "horizontal_rule",
    desc: "BMW fren balatası — disk ile uyumlu Oto Mavi balata setleri.",
    oem: "Balata seti; disk kalınlığı ve sensör kablosu kontrol edilmeli.",
    feats: ["Sessiz sürüş", "Tutuş performansı", "Set halinde"] },
  { id: "omfhyd2c", cat: "omfren02", path: "fren-hidroligi", name: "Fren Hidroliği", icon: "water_drop",
    desc: "BMW fren hidroliği — DOT uyumlu Oto Mavi fren sıvısı.",
    oem: "DOT sınıfı araç kılavuzuna göre seçilir.",
    feats: ["DOT uyumlu", "Nem direnci", "Periyodik değişim"] },
  { id: "omgtmp3a", cat: "omgvde03", path: "tampon", name: "Tampon", icon: "directions_car",
    desc: "BMW tampon — ön/arka gövde onarımı için Oto Mavi tampon parçaları.",
    oem: "Ön veya arka tampon; boyasız / boyalı seçenekler.",
    feats: ["Kaporta uyumu", "Montaj hazır", "OEM / eşdeğer"] },
  { id: "omgayn3b", cat: "omgvde03", path: "yan-ayna", name: "Yan Ayna", icon: "flip",
    desc: "BMW yan ayna — elektrikli / ısıtmalı seçeneklerle Oto Mavi stoku.",
    oem: "Sol/sağ ayna; katlanır ve ısıtmalı varyantlar.",
    feats: ["Elektrikli seçenek", "Isıtmalı cam", "Renk uyumu"] },
  { id: "omgpnl3c", cat: "omgvde03", path: "kaporta-paneli", name: "Kaporta Paneli", icon: "crop_square",
    desc: "BMW kaporta paneli — çamurluk ve panel onarımı için Oto Mavi.",
    oem: "Panel tipi araç modeline göre seçilir.",
    feats: ["Gövde onarımı", "Montaj noktaları", "Hızlı tedarik"] },
  { id: "ommcta4a", cat: "ommotr04", path: "conta-seti", name: "Conta Seti", icon: "layers",
    desc: "BMW conta seti — sızdırmazlık ve motor bakımı için Oto Mavi.",
    oem: "Üst/alt conta seti; motor koduna göre.",
    feats: ["Sızdırmazlık", "Set halinde", "OEM kalite"] },
  { id: "ommsgt4b", cat: "ommotr04", path: "sogutma-parcasi", name: "Soğutma Parçası", icon: "thermostat",
    desc: "BMW soğutma parçası — termostat, hortum ve radyatör grubu Oto Mavi’de.",
    oem: "Soğutma hattı bileşeni; model spesifik.",
    feats: ["Isı kontrolü", "Sızıntı önleme", "Hızlı sevkiyat"] },
  { id: "ommsns4c", cat: "ommotr04", path: "motor-sensoru", name: "Motor Sensörü", icon: "sensors",
    desc: "BMW motor sensörü — oksijen, krank ve sıcaklık sensörleri Oto Mavi.",
    oem: "Sensör tipi arıza koduna göre seçilir.",
    feats: ["Doğru ölçüm", "Plug & play", "OEM / eşdeğer"] },
  { id: "omeaku5a", cat: "omelek05", path: "aku", name: "Akü", icon: "battery_full",
    desc: "BMW uyumlu akü — start-stop ve standart seçeneklerle Oto Mavi.",
    oem: "Ah / AGM tipi araç ihtiyacına göre.",
    feats: ["Start-stop uyumlu seçenek", "Yüksek CCA", "Garanti seçenekleri"] },
  { id: "omealt5b", cat: "omelek05", path: "alternator", name: "Alternatör", icon: "bolt",
    desc: "BMW alternatör — şarj sistemi için Oto Mavi alternatör stoku.",
    oem: "Amper ve kayış tipi modele göre.",
    feats: ["Stabil şarj", "OEM / eşdeğer", "Atölye montajına uygun"] },
  { id: "omemrs5c", cat: "omelek05", path: "mars-motoru", name: "Marş Motoru", icon: "power",
    desc: "BMW marş motoru — güvenilir çalıştırma için Oto Mavi.",
    oem: "Marş tipi motor koduna göre.",
    feats: ["Güçlü tork", "Uzun ömür", "Hızlı tedarik"] },
  { id: "omsamr6a", cat: "omsusp06", path: "amortisor", name: "Amortisör", icon: "height",
    desc: "BMW amortisör — ön/arka süspansiyon için Oto Mavi amortisör.",
    oem: "Gazlı / yağlı; aks konumuna göre.",
    feats: ["Konfor", "Yol tutuş", "OEM / eşdeğer"] },
  { id: "omsyay6b", cat: "omsusp06", path: "helezon-yay", name: "Helezon Yay", icon: "compress",
    desc: "BMW helezon yay — doğru oturma yüksekliği için Oto Mavi yay.",
    oem: "Yay sertliği model/şasiye göre.",
    feats: ["Doğru yükseklik", "Dayanıklı çelik", "Çift taraflı satış"] },
  { id: "omsbrc6c", cat: "omsusp06", path: "salincak-burcu", name: "Salıncak Burcu", icon: "settings_input_component",
    desc: "BMW salıncak burcu — sessiz ve dengeli süspansiyon için Oto Mavi.",
    oem: "Burç çapı ve salıncak tipine göre.",
    feats: ["Titreşim azaltma", "Sessiz sürüş", "Kolay değişim"] },
  { id: "omkkmp7a", cat: "omklma07", path: "klima-kompresoru", name: "Klima Kompresörü", icon: "ac_unit",
    desc: "BMW klima kompresörü — soğutma performansı için Oto Mavi.",
    oem: "Kompresör tipi klima sistemine göre.",
    feats: ["Güçlü soğutma", "OEM / eşdeğer", "Montaj kiti opsiyon"] },
  { id: "omkknd7b", cat: "omklma07", path: "kondanser", name: "Kondanser", icon: "device_thermostat",
    desc: "BMW klima kondanseri — ısı değişimi için Oto Mavi kondanser.",
    oem: "Ön panel kondanser; araç tipine göre.",
    feats: ["Isı değişimi", "Korozyon direnci", "Hızlı sevkiyat"] },
  { id: "omkkrt7c", cat: "omklma07", path: "kurutucu", name: "Kurutucu", icon: "invert_colors",
    desc: "BMW klima kurutucusu — nem tutma ve sistem koruması Oto Mavi’de.",
    oem: "Receiver/drier; gaz tipi ile uyumlu.",
    feats: ["Nem tutma", "Sistem koruması", "Bakımda değişim"] },
  { id: "omatbj8a", cat: "omatsg08", path: "buji", name: "Buji", icon: "local_fire_department",
    desc: "BMW buji — stabil ateşleme için Oto Mavi buji seçenekleri.",
    oem: "Isı değeri motor koduna göre.",
    feats: ["Stabil ateşleme", "Yakıt verimi", "Set halinde"] },
  { id: "omatbb8b", cat: "omatsg08", path: "atesleme-bobini", name: "Ateşleme Bobini", icon: "flash_on",
    desc: "BMW ateşleme bobini — silindir başına güçlü kıvılcım Oto Mavi’de.",
    oem: "Bobin tipi ateşleme sistemine göre.",
    feats: ["Güçlü kıvılcım", "Titreşim direnci", "OEM / eşdeğer"] },
  { id: "omatkz8c", cat: "omatsg08", path: "kizdirma-bujisi", name: "Kızdırma Bujisi", icon: "whatshot",
    desc: "BMW kızdırma bujisi — dizel soğuk çalıştırma için Oto Mavi.",
    oem: "Dizel ön ısıtma; silindir sayısı seti.",
    feats: ["Soğuk çalıştırma", "Hızlı ısınma", "Set önerisi"] },
  { id: "omsyag9a", cat: "omsivi09", path: "motor-yagi", name: "Motor Yağı", icon: "water_drop",
    desc: "BMW uyumlu motor yağı — spec’e uygun Oto Mavi motor yağları.",
    oem: "LL / ACEA / SAE sınıfı araç kılavuzuna göre.",
    feats: ["Spec uyumlu", "Motor koruması", "Litre seçenekleri"] },
  { id: "omsant9b", cat: "omsivi09", path: "antifriz", name: "Antifriz", icon: "ac_unit",
    desc: "BMW uyumlu antifriz — soğutma sistemi için Oto Mavi antifriz.",
    oem: "G11/G12/G13 tipi araç spesifikasyonuna göre.",
    feats: ["Donma koruması", "Korozyon önleme", "Hazır karışım seçenek"] },
  { id: "omsfrn9c", cat: "omsivi09", path: "fren-hidroligi-sivi", name: "Fren Hidroliği (Sıvı)", icon: "science",
    desc: "BMW fren hidroliği sıvısı — DOT sınıfı Oto Mavi fren sıvısı.",
    oem: "DOT 4 / DOT 5.1 araç kılavuzuna göre.",
    feats: ["Yüksek kaynama", "Nem direnci", "Periyodik değişim"] },
  { id: "ombper0a", cat: "ombkim10", path: "periyodik-bakim-seti", name: "Periyodik Bakım Seti", icon: "build",
    desc: "BMW periyodik bakım seti — filtre + yağ kombinasyonu Oto Mavi.",
    oem: "Km / yıl aralığına göre set içeriği değişir.",
    feats: ["Filtre + yağ", "Tek seferde sipariş", "Model uyumlu"] },
  { id: "ombflt0b", cat: "ombkim10", path: "filtre-seti", name: "Filtre Seti", icon: "filter_list",
    desc: "BMW filtre seti — yağ, hava ve polen filtresi paketi Oto Mavi’de.",
    oem: "Üçlü / dörtlü filtre seti.",
    feats: ["Çoklu filtre", "Bakım kolaylığı", "Uygun fiyat"] },
  { id: "ombcnt0c", cat: "ombkim10", path: "conta-kiti", name: "Conta Kiti", icon: "category",
    desc: "BMW conta kiti — sızdırmazlık bakımı için Oto Mavi conta kiti.",
    oem: "Conta grubu iş tipine göre seçilir.",
    feats: ["Sızdırmazlık", "Set halinde", "Atölye kullanımı"] },
  { id: "omicps1a", cat: "omicdn11", path: "paspas-seti", name: "Paspas Seti", icon: "grid_on",
    desc: "BMW paspas seti — kabin koruması için Oto Mavi paspas.",
    oem: "Havuzlu / tekstil; model tabanlı kesim.",
    feats: ["Model uyumlu", "Kaymaz taban", "Kolay temizlik"] },
  { id: "omictr1b", cat: "omicdn11", path: "ic-trim", name: "İç Trim", icon: "dashboard",
    desc: "BMW iç trim — panel ve kapı kaplamaları Oto Mavi stoklarında.",
    oem: "Trim parçası renk/kod ile seçilir.",
    feats: ["Renk uyumu", "OEM / eşdeğer", "Hızlı tedarik"] },
  { id: "omickl1c", cat: "omicdn11", path: "kol-dayama", name: "Kol Dayama", icon: "airline_seat_recline_extra",
    desc: "BMW kol dayama — konfor ve depolama için Oto Mavi kol dayama.",
    oem: "Orta konsol kol dayama; model spesifik.",
    feats: ["Konfor", "Depolama", "Montaj hazır"] },
  { id: "omafr2a", cat: "omaydn12", path: "far", name: "Far", icon: "lightbulb",
    desc: "BMW far — LED / halojen seçeneklerle Oto Mavi aydınlatma.",
    oem: "Sol/sağ far; adaptif varyantlar mevcuttur.",
    feats: ["Görünürlük", "OEM / eşdeğer", "Homologasyon"] },
  { id: "omastp2b", cat: "omaydn12", path: "stop-lambasi", name: "Stop Lambası", icon: "traffic",
    desc: "BMW stop lambası — arka güvenlik aydınlatması Oto Mavi’de.",
    oem: "Sol/sağ stop; LED kartlı seçenekler.",
    feats: ["Güvenlik", "LED seçenek", "Kolay montaj"] },
  { id: "omasis2c", cat: "omaydn12", path: "sis-fari", name: "Sis Farı", icon: "foggy",
    desc: "BMW sis farı — sis ve yağmurda görüş için Oto Mavi sis farı.",
    oem: "Ön sis farı; ampul tipi ile birlikte.",
    feats: ["Sis görüşü", "Dayanıklı gövde", "OEM / eşdeğer"] },
  { id: "omkvky3a", cat: "omkysi13", path: "v-kayisi", name: "V Kayışı", icon: "sync",
    desc: "BMW V kayışı — aksesuar tahriki için Oto Mavi kayış.",
    oem: "Uzunluk ve nervür sayısı modele göre.",
    feats: ["Aksesuar tahriki", "Düşük gürültü", "Uzun ömür"] },
  { id: "omktrg3b", cat: "omkysi13", path: "triger-seti", name: "Triger Seti", icon: "schedule",
    desc: "BMW triger seti — zamanlama kayışı/zincir seti Oto Mavi’de.",
    oem: "Kayış + gergi + rulman seti önerilir.",
    feats: ["Zamanlama", "Set halinde", "Km aralığı kritik"] },
  { id: "omkgrg3c", cat: "omkysi13", path: "gergi", name: "Gergi", icon: "tune",
    desc: "BMW kayış gergisi — doğru gerilim için Oto Mavi gergi.",
    oem: "Otomatik / manuel gergi tipi.",
    feats: ["Doğru gerilim", "Titreşim azaltma", "Kayışla birlikte değişim"] },
  { id: "omslst4a", cat: "omslck14", path: "silecek-lastigi", name: "Silecek Lastiği", icon: "water",
    desc: "BMW silecek lastiği — net görüş için Oto Mavi silecek lastiği.",
    oem: "Uzunluk cm cinsinden model tablosuna göre.",
    feats: ["Net görüş", "Sessiz silme", "Kolay değişim"] },
  { id: "omslkl4b", cat: "omslck14", path: "silecek-kolu", name: "Silecek Kolu", icon: "swipe",
    desc: "BMW silecek kolu — ön/arka silecek kolu Oto Mavi stoklarında.",
    oem: "Sol/sağ / arka kol; menteşe tipi.",
    feats: ["Sağlam menteşe", "OEM uyum", "Hızlı tedarik"] },
  { id: "omslfs4c", cat: "omslck14", path: "fiskiye-pompasi", name: "Fıskiye Pompası", icon: "water_drop",
    desc: "BMW fıskiye pompası — cam yıkama sistemi için Oto Mavi pompa.",
    oem: "Tek / çift çıkışlı pompa.",
    feats: ["Güçlü püskürtme", "Kolay bağlantı", "OEM / eşdeğer"] },
];

function catDesing() {
  return { header: [], body: ["tp5jo4", "t1pc03"], footer: [] };
}

function productText(p, catName) {
  const feats = (p.feats || []).map((f) => `<li>${f}</li>`).join("");
  return (
    `<h2 style="font-size: 24px;">${p.name}</h2>` +
    `<p style="font-size: 16px;">Oto Mavi <strong>${p.name}</strong> — ${catName} kategorisinde BMW yedek parça. Gaziantep stokundan orijinal ve eşdeğer seçeneklerle hızlı tedarik.</p>` +
    `<p style="font-size: 16px;"><strong>OEM / uyumluluk notu:</strong> ${p.oem} Araç şasi / motor kodunuzu iletin; doğru parçayı birlikte seçelim.</p>` +
    `<ul style="font-size: 16px;">${feats}</ul>` +
    `<p style="font-size: 16px;"><strong>Sipariş (sepet yok):</strong> Telefon ${TEL} · WhatsApp · ${MAIL}. Oto Mavi — Gaziantep BMW yedek parça.</p>`
  );
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function copyImg(srcId, destId) {
  const src = path.join(PAGE, srcId, "index.webp");
  const destDir = path.join(PAGE, destId);
  ensureDir(destDir);
  const dest = path.join(destDir, "index.webp");
  if (!fs.existsSync(src)) {
    console.warn("[warn] kaynak görsel yok:", src);
    return false;
  }
  fs.copyFileSync(src, dest);
  return true;
}


function pngToWebp(pngPath, webpPath) {
  const helper = path.join(__dirname, "_png2webp.js");
  const sharpMod = "D:/matrix/node_modules/sharp";
  try {
    fs.writeFileSync(
      helper,
      `const sharp=require(${JSON.stringify(sharpMod)});\nsharp(process.argv[2]).webp({quality:82}).toFile(process.argv[3]).then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});\n`,
      "utf8"
    );
    execFileSync(process.execPath, [helper, pngPath, webpPath], { stdio: "pipe" });
    try { fs.unlinkSync(helper); } catch (_) {}
    return fs.existsSync(webpPath) && fs.statSync(webpPath).size > 0;
  } catch (e) {
    try { fs.unlinkSync(helper); } catch (_) {}
    console.warn("[warn] pngToWebp:", e.message);
    return false;
  }
}

function generateUnique(destId, prompt) {
  const destDir = path.join(PAGE, destId);
  ensureDir(destDir);
  const outPng = path.join(destDir, "_tmp.png");
  const outWebp = path.join(destDir, "index.webp");
  const runJs = "D:/matrix/public/comfyui/scripts/run.js";
  try {
    execFileSync(
      "node",
      [
        runJs,
        "generate",
        "--workflow",
        "z_image_turbo",
        "--prompt",
        prompt,
        "--out",
        outPng,
        "--width",
        "1024",
        "--height",
        "1024",
        "--steps",
        "8",
      ],
      { stdio: "inherit", timeout: 180000 }
    );
    if (fs.existsSync(outPng) && pngToWebp(outPng, outWebp)) {
      try { fs.unlinkSync(outPng); } catch (_) {}
      return true;
    }
    console.warn("[warn] webp dönüşüm başarısız:", destId);
  } catch (e) {
    console.warn("[warn] ComfyUI üretim hatası:", destId, e.message);
  }
  try { if (fs.existsSync(outPng)) fs.unlinkSync(outPng); } catch (_) {}
  return false;
}

function main() {
  const log = [];
  const logLine = (s) => { console.log(s); log.push(s); };

  logLine("=== Paket 08 build başlıyor ===");
  logLine("ROOT=" + ROOT);
  const modulesPath = path.join(ROOT, "modules.json");
  const modules = JSON.parse(fs.readFileSync(modulesPath, "utf8"));
  const hasPc = modules.data.some((m) => m.id === "t1pc03" || m.path === "page-category-3");
  if (!hasPc) {
    const maxIdx = Math.max(...modules.data.map((m) => m.index || 0));
    modules.data.push({
      id: "t1pc03",
      name: "Alt Kategori Ürün Kartları",
      path: "page-category-3",
      local: "body",
      category: "page-category",
      version: "1.0.0",
      icon: "category",
      desing: {
        page: "products",
        size: 4,
        bgcolor: "#ffffff",
        color: "#0B3A6E",
        colortitle: "#0B3A6E",
        coloractive: "#02427A",
        border_radius: "12px",
        card_shadow: "0 4px 20px rgba(11, 58, 110, 0.12)",
        max: "1200px",
        margin: "24px 0px 40px 0px",
      },
      index: maxIdx + 1,
    });
    writeJson(modulesPath, modules);
    logLine("[ok] modules.json ← t1pc03 (page-category-3)");
  } else {
    logLine("[skip] t1pc03 zaten var");
  }
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));
  const data = [];
  let idx = 0;

  for (const c of CATS) {
    data.push({
      id: c.id,
      path: c.path,
      name: { tr: c.name },
      status: "play",
      index: idx++,
      category: "",
      url: "",
      icon: c.icon,
      description: { tr: c.desc },
      img: "index.webp",
      desing: catDesing(),
    });
  }

  for (const p of PRODUCTS) {
    data.push({
      id: p.id,
      path: p.path,
      name: { tr: p.name },
      status: "play",
      index: idx++,
      category: p.cat,
      url: "",
      icon: p.icon,
      description: { tr: p.desc },
      img: "index.webp",
    });
  }

  const productsRoot = {
    name: "Ürünler",
    path: "products",
    description: {
      tr: "Oto Mavi ürün kataloğu — Gaziantep BMW oto yedek parçaları: filtre, fren, gövde, motor, elektrik, sönümleme, klima ve daha fazlası.",
    },
    keyword: {
      tr: "BMW yedek parça, Oto Mavi, Gaziantep, ürün kategorileri, orijinal parça, eşdeğer parça",
    },
    desc: [],
    data,
    index: 1,
    desing: {
      header: [],
      body: ["tp5jo4"],
      footer: [],
    },
    modulestatus: {
      page: true,
      body: true,
      detail: true,
      img: true,
      bgimg: false,
      icon: true,
    },
  };
  writeJson(path.join(ROOT, "products.json"), productsRoot);
  logLine(`[ok] products.json — üst=${CATS.length} ürün=${PRODUCTS.length} toplam=${data.length}`);
  const psPath = path.join(ROOT, "pagesetting.json");
  const ps = JSON.parse(fs.readFileSync(psPath, "utf8"));
  const prodPs = ps.data.find((x) => x.path === "products");
  if (prodPs) {
    prodPs.desing = { header: [], body: ["tp5jo4"], footer: [] };
    writeJson(psPath, ps);
    logLine("[ok] pagesetting products desing = [tp5jo4]");
  }
  for (const c of CATS) {
    const dir = path.join(PAGE, c.id);
    ensureDir(dir);
    writeJson(path.join(dir, "index.json"), {
      id: c.id,
      path: c.path,
      name: { tr: c.name },
      status: "play",
      category: "",
      description: { tr: c.desc.replace("—", "—").slice(0, 160) },
      keyword: { tr: c.keyword },
      title: { tr: c.title },
      text: { tr: c.text },
      icon: c.icon,
      update: TODAY,
      date: TODAY,
      img: "index.webp",
    });
  }
  logLine("[ok] üst kategori page/*/index.json güncellendi");
  const uniquePerCat = new Set();
  let copied = 0;
  let generated = 0;
  let failedGen = 0;

  for (const p of PRODUCTS) {
    const cat = catById[p.cat];
    const dir = path.join(PAGE, p.id);
    ensureDir(dir);
    writeJson(path.join(dir, "index.json"), {
      id: p.id,
      path: p.path,
      name: { tr: p.name },
      status: "play",
      category: p.cat,
      description: { tr: p.desc },
      keyword: {
        tr: `${p.name}, ${cat.name}, BMW yedek parça, Oto Mavi, Gaziantep`,
      },
      title: { tr: `${p.name} | Oto Mavi` },
      text: { tr: productText(p, cat.name) },
      icon: p.icon,
      update: TODAY,
      date: TODAY,
      img: "index.webp",
    });

    const wantUnique = !uniquePerCat.has(p.cat) && process.env.SKIP_COMFY !== "1";
    let ok = false;
    if (wantUnique) {
      const prompt =
        `professional automotive spare part product photo of ${p.name} for BMW car, clean studio lighting, blue-gray background, realistic metal and plastic textures, catalog style, centered object, no text, no typography, no letters, no words, no logo, no watermark, no caption, no signage`;
      ok = generateUnique(p.id, prompt);
      if (ok) {
        uniquePerCat.add(p.cat);
        generated++;
        logLine(`[gen] ${p.id} ${p.path}`);
      } else {
        failedGen++;
      }
    }
    if (!ok) {
      if (copyImg(p.cat, p.id)) {
        copied++;
      }
    }
  }

  logLine(`[ok] görsel: üretilen=${generated} kopya=${copied} gen_fail=${failedGen}`);
  const treeLines = [
    "# Paket 08 — Ürün ağacı (Model B)",
    "",
    `Tarih: ${TODAY} · Marka: Oto Mavi · eticaret: false`,
    "",
    "## Özet",
    "",
    `- Üst kategori (category: \"\"): **${CATS.length}**`,
    `- Ürün (category: <üst-id>): **${PRODUCTS.length}**`,
    `- Modül: \`t1pc03\` → path \`page-category-3\``,
    `- Üst kategori body: \`[tp5jo4, t1pc03]\``,
    `- Ana sayfa liste: \`t1ls01\` page-list-3 · page=products · category=\"\"`,
    "",
    "## Üst → Alt",
    "",
    "| Üst id | Üst path | Ürün id | Ürün path | Ürün adı |",
    "|--------|----------|---------|-----------|----------|",
  ];
  for (const p of PRODUCTS) {
    const c = catById[p.cat];
    treeLines.push(`| ${c.id} | ${c.path} | ${p.id} | ${p.path} | ${p.name} |`);
  }
  treeLines.push("");
  treeLines.push("## Doğrulama notları");
  treeLines.push("");
  treeLines.push("- page-list-* yalnız `category: \"\"` gösterir → ana sayfa / ürünler grid üst kategoriler");
  treeLines.push("- page-category-3 `category == page.id` → kategori sayfasında ürün kartları");
  treeLines.push("- Sepet / ödeme / Magento YMM yok");
  treeLines.push("");
  fs.writeFileSync(path.join(__dirname, "08_urun_agaci.md"), treeLines.join("\n"), "utf8");
  logLine("[ok] 08_urun_agaci.md yazıldı");

  const logPath = path.join(__dirname, "08_run.log");
  fs.writeFileSync(logPath, log.join("\n") + "\n", "utf8");
  logLine("=== build bitti → 08_run.log ===");
}

main();
