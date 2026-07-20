
"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "../..");
var PRODUCTS = path.join(ROOT, "products.json");
var PAGE_DIR = path.join(ROOT, "page");
var MODULES = path.join(ROOT, "modules.json");
var TODAY = "2026-07-20";


var IDS = [
  "dnhgnxo0hg", "9s2gesnrvb", "lo65qlydcr", "s3nk6qkyzy", "pmbqcljbet",
  "ry99uefxh8", "7bvaq99dkp", "dzq4tnm96q", "pky10wfvei", "3ifpnx1zn2",
  "knzebtecct", "dn9pzwbacw", "a831pe03ct", "8yf87dw95o", "rkhqhabbns",
  "yut4w6lws1", "cnzfr4vihd", "c0ne7aa17j", "c4zezz86gb", "7j56u803i4",
  "t3uqlrk7uh", "q99uza8w5v", "7fr22wss57", "7512zyrusk", "l9iga15ped",
  "upq7zjks3k", "vz22y35tfi", "y6l04cyvsg", "blaw0o0nq9", "d6eksr83a6",
  "joh4ngy8qk", "rz336w09cr", "k01d2cqsgr", "l3pah7xqy4", "cmc6a6rqa3",
  "vflv4907nw", "z61o8tyuub", "iopprqo3wr", "57w8jl01ph", "7ghzidgxaz",
  "9rwa82diyh", "iv3mwgh27w", "3flq48i5oy", "p868dr3e2c", "o6y7tc63zi",
  "2pal25nyga", "fd8zen2pom", "pir7d4kref", "o870xzst25", "ucfe2ni7ya",
  "gpsprl0aax", "rapa1jpfm8", "1zvs97tk5x"
];

var idIdx = 0;
function nextId() {
  if (idIdx >= IDS.length) throw new Error("ID havuzu bitti");
  return IDS[idIdx++];
}


function makeUst(o) {
  return {
    id: o.id,
    path: o.path,
    name: { tr: o.name },
    status: "play",
    index: o.index,
    category: "",
    url: "",
    icon: o.icon,
    description: { tr: o.description },
    img: "index.webp",
    desing: { header: [], body: ["t1pd01", "t1pc03"], footer: [] }
  };
}


function makeUrun(o) {
  return {
    id: o.id,
    path: o.path,
    name: { tr: o.name },
    status: "play",
    index: o.index,
    category: o.category,
    url: "",
    icon: o.icon,
    description: { tr: o.description },
    img: "index.webp",
    desing: { header: [], body: ["t1pd01"], footer: [] }
  };
}


function makePage(o, isUst) {
  var page = {
    id: o.id,
    path: o.path,
    name: { tr: o.name },
    status: "play",
    category: isUst ? "" : o.category,
    description: { tr: o.description },
    keyword: { tr: o.keyword },
    title: { tr: o.name + " | Oto Mavi" },
    text: { tr: o.text },
    icon: o.icon,
    update: TODAY,
    date: TODAY,
    img: "index.webp",
    desing: {
      header: [],
      body: isUst ? ["t1pd01", "t1pc03"] : ["t1pd01"],
      footer: []
    }
  };
  return page;
}

function htmlText(title, p1, p2) {
  return (
    '<h2 style="font-size: 24px;">' + title + "</h2>" +
    '<p style="font-size: 16px;">' + p1 + "</p>" +
    '<p style="font-size: 16px;">' + p2 + "</p>" +
    '<p style="font-size: 16px;">Sipariş ve stok: 0544 717 18 28 · WhatsApp ile hızlı teklif.</p>'
  );
}


var IMG_SRC = {
  omfltr01: "omfltr01", omfren02: "omfren02", omgvde03: "omgvde03",
  ommotr04: "ommotr04", omelek05: "omelek05", omsusp06: "omsusp06",
  omklma07: "omklma07", omatsg08: "omatsg08", omsivi09: "omsivi09",
  ombkim10: "ombkim10", omicdn11: "omicdn11", omaydn12: "omaydn12",
  omkysi13: "omkysi13", omslck14: "omslck14"
};

var logLines = [];
function log(msg) {
  logLines.push(msg);
  console.log(msg);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyWebp(srcId, destId) {
  var src = path.join(PAGE_DIR, srcId, "index.webp");
  var destDir = path.join(PAGE_DIR, destId);
  var dest = path.join(destDir, "index.webp");
  ensureDir(destDir);
  if (!fs.existsSync(src)) {
    log("WARN webp kaynak yok: " + srcId + " → " + destId);
    return false;
  }
  fs.copyFileSync(src, dest);
  log("IMG kopya: " + srcId + " → " + destId + "/index.webp");
  return true;
}

function writePage(meta, isUst, imgFrom) {
  var dir = path.join(PAGE_DIR, meta.id);
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, "index.json"),
    JSON.stringify(makePage(meta, isUst), null, 2),
    "utf8"
  );
  copyWebp(imgFrom, meta.id);
}



var newUst = [];
var newUrun = [];
var pageMeta = []; // { meta, isUst, imgFrom }

function addUst(def) {
  var id = nextId();
  var row = {
    id: id,
    path: def.path,
    name: def.name,
    icon: def.icon,
    description: def.description,
    keyword: def.keyword,
    text: def.text,
    index: 0,
    imgFrom: def.imgFrom
  };
  newUst.push(row);
  pageMeta.push({ meta: row, isUst: true, imgFrom: def.imgFrom });
  return id;
}

function addUrun(catId, def, imgFrom) {
  var id = nextId();
  var row = {
    id: id,
    path: def.path,
    name: def.name,
    icon: def.icon,
    description: def.description,
    keyword: def.keyword,
    text: def.text,
    category: catId,
    index: 0,
    imgFrom: imgFrom
  };
  newUrun.push(row);
  pageMeta.push({ meta: row, isUst: false, imgFrom: imgFrom });
  return id;
}



var idTurbo = addUst({
  path: "turbo-zorlamali-emme",
  name: "Turbo / Zorlamalı Emme",
  icon: "air",
  imgFrom: "ommotr04",
  description: "Turboşarj, ara soğutucu, conta ve basınç dönüştürücü ile zorlamalı emme hattını Oto Mavi deposundan şasi koduna göre tamamlayın; boost kaçaklarında doğru ünite seçilir.",
  keyword: "turboşarj BMW, ara soğutucu intercooler, turbo conta, basınç dönüştürücü, zorlamalı emme",
  text: htmlText(
    "Turbo / Zorlamalı Emme",
    "BMW motorlarında turbo ünitesi, intercooler ve sızdırmazlık contaları performans ve yakıt dengesi için kritiktir. Oto Mavi Gaziantep deposunda zorlamalı emme parçaları şasi ve motor koduna göre ayrılır.",
    "Yağ kaçakı, ıslık sesi veya düşük basınç şikayetinde turboyu tek başına değil conta ve basınç hattıyla birlikte değerlendirin. Teklif için WhatsApp veya telefon hattımızı kullanın."
  )
});
addUrun(idTurbo, {
  path: "turbosarj",
  name: "Turboşarj",
  icon: "air",
  description: "Kompresör çarkı ve turbine gövdesiyle egzoz enerjisini emiş basıncına çeviren turboşarj ünitesi; şaft yatak ve VNT tipine göre BMW motor kodunda seçilir.",
  keyword: "turboşarj ünitesi, VNT turbo, kompresör çarkı, egzoz turbine, BMW turbo kodu",
  text: htmlText("Turboşarj", "Turboşarj arızası güç kaybı, mavi duman veya metal sesiyle kendini gösterir. Oto Mavi orijinal ve yenilenmiş turbo seçeneklerini motor koduna göre listeler.", "Montajda yağ hattı temizliği ve conta seti şarttır; aksi halde yeni ünite kısa sürede zarar görür.")
}, "ommotr04");
addUrun(idTurbo, {
  path: "ara-sogutucu",
  name: "Ara Soğutucu",
  icon: "ac_unit",
  description: "Sıkıştırılmış havayı soğutan intercooler çekirdeği yanmayı stabilize eder; tıkanmış veya delik ara soğutucu boost kaybı üretir, hortum flanşıyla birlikte kontrol edilir.",
  keyword: "intercooler ara soğutucu, boost hortumu, emiş soğutma, charge air cooler, BMW intercooler",
  text: htmlText("Ara Soğutucu", "Ara soğutucu (intercooler) turbo çıkışındaki sıcak havayı düşürerek dolum verimini artırır. Çatlak çekirdek veya gevşek kelepçe basınç kaçırır.", "Oto Mavi stokunda model bazlı intercooler ve bağlantı hortumları bulunur; şasi ile doğrulayın.")
}, "omklma07");
addUrun(idTurbo, {
  path: "turbo-contasi",
  name: "Turbo Contası",
  icon: "hexagon",
  description: "Turbo flanş ve yağ dönüş contası egzoz ile yağ sızıntısını keser; yeniden kullanım çoğu zaman kaçak yaratır, her demontajda yeni conta seti önerilir.",
  keyword: "turbo flanş conta, yağ dönüş contası, egzoz conta seti, turbo sızdırmazlık, gasket kit",
  text: htmlText("Turbo Contası", "Turbo contası ince ama kritik bir parçadır; yanlış tork veya eski conta egzoz dumanı ve yağ sızıntısı bırakır.", "Oto Mavi turbo conta setlerini ünite tipine göre ayırır; montaj sırasında yüzey temizliği şarttır.")
}, "ommotr04");
addUrun(idTurbo, {
  path: "basinc-donusturucu",
  name: "Basınç Dönüştürücü",
  icon: "speed",
  description: "Wastegate veya VNT aktüatörünü yöneten basınç dönüştürücü solenoidi boost haritasını korur; arızada aşırı veya düşük basınç ve hata kodu görülür.",
  keyword: "basınç dönüştürücü, boost solenoid, wastegate vana, VNT aktüatör, N75 benzeri",
  text: htmlText("Basınç Dönüştürücü", "Basınç dönüştürücü (boost solenoid) turbo kontrol hattındaki elektrik-pnömatik köprüdür. Tıkalı hortum veya arızalı bobin düzensiz boost üretir.", "Kod okuma sonrası Oto Mavi deposundan doğru pin ve hortum çıkışlı üniti seçin.")
}, "omelek05");

var idDir = addUst({
  path: "direksiyon",
  name: "Direksiyon",
  icon: "steering",
  imgFrom: "omsusp06",
  description: "Rot başı, bağlantı çubuğu, onarım kiti ve kremayer kapağı ile direksiyon hassasiyetini toparlayın; boşluk ve vuruntu şikayetinde Oto Mavi direksiyon reyonu.",
  keyword: "direksiyon rot başı, bağlantı çubuğu, kremayer, direksiyon onarım kiti, BMW direksiyon",
  text: htmlText(
    "Direksiyon",
    "Direksiyon sistemi yol tutuşu ve lastik aşınmasını doğrudan etkiler. Rot ucu, ara çubuk ve kremayer contaları aşındığında direksiyonda boşluk ve düzensiz lastik izi oluşur.",
    "Oto Mavi Gaziantep stokunda BMW direksiyon parçaları şasi ölçüsüyle eşleştirilir; teklif için arayın."
  )
});
addUrun(idDir, {
  path: "rot-basi",
  name: "Rot Başı / Çubuk Ucu",
  icon: "build",
  description: "Direksiyon çubuğu ucundaki rot başı tekerlek kamberini korur; aşınmış mafsal titreşim ve düzensiz lastik aşınması yaratır, sol/sağ uç ayrı kodlanır.",
  keyword: "rot başı, çubuk ucu, tie rod end, direksiyon mafsalı, BMW rot",
  text: htmlText("Rot Başı / Çubuk Ucu", "Rot başı aşınması direksiyonda tıkırtı ve savrulma hissi verir. Değişimden sonra rot ayarı (alignment) şarttır.", "Oto Mavi sol/sağ rot başlarını aks tipine göre stoklar.")
}, "omsusp06");
addUrun(idDir, {
  path: "baglanti-cubugu",
  name: "Bağlantı Çubuğu",
  icon: "linear_scale",
  description: "Kremayer ile rot başı arasını bağlayan bağlantı çubuğu boy ayarıyla toe değerini taşır; eğilmiş çubuk lastik iç kenar aşınması üretir.",
  keyword: "bağlantı çubuğu, inner tie rod, direksiyon mili, toe ayarı, BMW çubuk",
  text: htmlText("Bağlantı Çubuğu", "İç bağlantı çubuğu (inner tie rod) kremayer dişlisinden tekerleğe kuvvet iletir. Körük yırtığı yağsız kalıp erken aşınma yapar.", "Körük ve somun ile birlikte Oto Mavi’den temin edin.")
}, "omsusp06");
addUrun(idDir, {
  path: "direksiyon-onarim-kiti",
  name: "Direksiyon Onarım Kiti",
  icon: "handyman",
  description: "Kremayer conta, rulman ve körükleri içeren onarım kiti hidrolik kaçak ve dişli gürültüsünü gidermeye yardım eder; komple ünite yerine ekonomik tadilat yoludur.",
  keyword: "direksiyon onarım kiti, kremayer conta, rack seal kit, körük seti, hidrolik direksiyon",
  text: htmlText("Direksiyon Onarım Kiti", "Hidrolik kremayer kaçaklarında onarım kiti çoğu zaman komple kutu değişiminden ekonomiktir. Conta ölçüsü şasiye özeldir.", "Oto Mavi kit içeriğini pompa tipi ve kremayer koduna göre ayırır.")
}, "omsusp06");
addUrun(idDir, {
  path: "kremayer-kapagi",
  name: "Kremayer Kapağı",
  icon: "crop_square",
  description: "Kremayer uç ve gövde kapağı dişli yağının kaçmasını önler; çatlak kapak toz girişi ve erken diş aşınması yaratır, conta ile birlikte değiştirilir.",
  keyword: "kremayer kapağı, rack end cover, direksiyon gövde kapak, conta flanş, BMW kremayer",
  text: htmlText("Kremayer Kapağı", "Kremayer kapağı küçük görünür ama yağ sızdırmazlığı için kritiktir. Çatlak veya ezik kapakta toz içeri girer.", "Montaj yüzeyini temizleyip Oto Mavi contalı kapakla yenileyin.")
}, "omsusp06");

var idSanz = addUst({
  path: "sanizman",
  name: "Şanzıman",
  icon: "settings_input_component",
  imgFrom: "ommotr04",
  description: "Şanzıman montaj takozu, hız sensörü, ters ışık anahtarı ve dişli/çark grubuyla vites aktarımını destekleyin; sarsıntı ve sinyal arızasında Oto Mavi şanzıman reyonu.",
  keyword: "şanzıman montajı, hız sensörü, ters ışık anahtarı, dişli çark, BMW şanzıman",
  text: htmlText(
    "Şanzıman",
    "Manuel ve otomatik şanzımanlarda montaj takozu, sensör ve dişli elemanları vites konforunu belirler. Ters vites lambası veya hız sinyali arızası çoğu zaman küçük bir anahtar/sensör kaynaklıdır.",
    "Oto Mavi şanzıman yan ürünlerini kutu koduna göre listeler; ATF ve conta ile birlikte planlayın."
  )
});
addUrun(idSanz, {
  path: "sanizman-montaji",
  name: "Şanzıman Montajı",
  icon: "foundation",
  description: "Şanzıman-motor arası lastik takoz montajı titreşimi emer; çatlamış takoz vites kolunda sarsıntı ve metal teması sesi üretir, tork koluyla birlikte kontrol edilir.",
  keyword: "şanzıman takozu, transmission mount, motor şanzıman montaj, titreşim takozu, BMW mount",
  text: htmlText("Şanzıman Montajı", "Şanzıman montaj takozu çürüdüğünde vites geçişleri sertleşir ve kabinde titreşim artar. Görsel çatlak kontrolü yeterlidir.", "Oto Mavi sol/sağ ve arka takozları kutu tipine göre stoklar.")
}, "omsusp06");
addUrun(idSanz, {
  path: "hiz-sensoru",
  name: "Hız Sensörü",
  icon: "speed",
  description: "Şanzıman çıkış veya tekerlek hız sensörü ABS ve gösterge hızını besler; arızada hız göstergesi sıfırlanır veya vites adaptasyonu bozulur.",
  keyword: "hız sensörü, VSS, şanzıman hız algılayıcı, ABS tekerlek sensörü, BMW speed sensor",
  text: htmlText("Hız Sensörü", "Hız sensörü manyetik halka üzerinden sinyal üretir. Kirli uç veya kopuk kablo hata kodu bırakır.", "Pin sayısı ve konnektör yönü Oto Mavi’de şasiyle doğrulanır.")
}, "omelek05");
addUrun(idSanz, {
  path: "ters-isik-anahtari",
  name: "Ters Işık Anahtarı",
  icon: "light_mode",
  description: "Geri vites konumunda stop lambasını yakan ters ışık anahtarı şanzıman gövdesine vidalanır; arızada geri lamba yanmaz veya sürekli yanar.",
  keyword: "ters ışık anahtarı, reverse switch, geri vites müşürü, şanzıman anahtarı, BMW reverse",
  text: htmlText("Ters Işık Anahtarı", "Ters ışık anahtarı küçük bir müşürdür ama güvenlik için şarttır. Yağ sızıntılı şanzımanda anahtar da etkilenebilir.", "Diş adımı ve pin tipini Oto Mavi katalogundan seçin.")
}, "omaydn12");
addUrun(idSanz, {
  path: "disli-cark",
  name: "Dişli / Çark",
  icon: "settings",
  description: "Senkronize dişli ve ara çark grubu vites geçişini sessizleştirir; kırık diş metal sesi ve vites atlaması yaratır, kutu açılımıyla OEM ölçü doğrulanır.",
  keyword: "şanzıman dişlisi, senkronize çark, gear set, ara dişli, BMW şanzıman parçası",
  text: htmlText("Dişli / Çark", "Dişli ve çark değişimi çoğu zaman profesyonel kutu revizyonu gerektirir. Parça numarası kutu koduna bağlıdır.", "Oto Mavi tedarik zinciriyle doğru dişliyi temin eder; teklif için kutu kodunu iletin.")
}, "ommotr04");

var idLastik = addUst({
  path: "lastik-jant",
  name: "Lastik ve Jant",
  icon: "tire_repair",
  imgFrom: "omsusp06",
  description: "Lastik, jant kapağı, tamir kiti ve ara parça ile tekerlek çevresini tamamlayın; ebat ve PCD bilgisini Oto Mavi’ye ileterek doğru lastik-jant uyumunu sağlayın.",
  keyword: "BMW lastik, jant kapağı, lastik tamir kiti, tekerlek ara parça, PCD ebat",
  text: htmlText(
    "Lastik ve Jant",
    "Lastik ebatı, yük indeksi ve jant PCD değeri yanlış seçilirse ABS ve sürüş güvenliği bozulur. Oto Mavi lastik ve jant yan ürünlerinde ebat doğrulaması yapar.",
    "Mevsimlik değişim ve acil tamir kitleri için stok sorgusu yapabilirsiniz."
  )
});
addUrun(idLastik, {
  path: "lastik",
  name: "Lastik",
  icon: "tire_repair",
  description: "Yaz/kış ve dört mevsim lastik seçenekleri yük ve hız indeksine göre ayrılır; yanlış ebat gösterge ve ESP kalibrasyonunu bozabilir, DOT tarihi kontrol edilir.",
  keyword: "oto lastik, yaz kış lastik, hız indeksi, yük indeksi, BMW lastik ebat",
  text: htmlText("Lastik", "Doğru lastik ebatı hem konfor hem güvenlik demektir. Yanakta yazan ölçü ve DOT tarihi Oto Mavi danışmanlığıyla netleşir.", "Montaj ve balans için yerel iş ortaklarımızla yönlendirebiliriz.")
}, "omsusp06");
addUrun(idLastik, {
  path: "jant-kapagi",
  name: "Jant Kapağı",
  icon: "circle",
  description: "Çelik jantı örten plastik jant kapağı vida veya klips tutuculu gelir; kırık kapak balans ağırlığını düşürebilir, göbek çapı modele özeldir.",
  keyword: "jant kapağı, hubcap, çelik jant örtü, klipsli kapak, BMW jant kapak",
  text: htmlText("Jant Kapağı", "Jant kapağı görünümü tamamlar ve çelik jantı korur. Yanlış göbek çapı yolda uçmasına yol açar.", "Oto Mavi stokunda inç ve logo tipine göre kapak bulunur.")
}, "omsusp06");
addUrun(idLastik, {
  path: "lastik-tamir-kiti",
  name: "Lastik Tamir Kiti",
  icon: "healing",
  description: "Acil yol kenarı için fitil, macun veya sprey tip lastik tamir kiti kısa süreli sızdırmazlık sağlar; yanak yırtığında kullanılmaz, kalıcı tamir lastikçi işidir.",
  keyword: "lastik tamir kiti, fitil seti, lastik spreyi, acil tamir, puncture kit",
  text: htmlText("Lastik Tamir Kiti", "Lastik tamir kiti geçici çözümdür; özellikle yanak hasarında güvenli değildir. Kompresörlü setler yol kenarında işe yarar.", "Oto Mavi araç ekipmanları reyonunda kit seçenekleri sunar.")
}, "ombkim10");
addUrun(idLastik, {
  path: "lastik-ara-parca",
  name: "Ara Parça",
  icon: "extension",
  description: "Sibop, balans ağırlığı ve jant cıvata ara parçaları tekerlek montajını tamamlar; yanlış sibop basınç kaybı, yanlış cıvata göbek hasarı üretir.",
  keyword: "lastik sibop, balans ağırlığı, jant cıvatası, tekerlek ara parça, valve stem",
  text: htmlText("Ara Parça", "Sibop, balans ve bağlantı elemanları küçük ama kritiktir. Alüminyum jantta doğru cıvata uzunluğu şarttır.", "Oto Mavi tekerlek sarf ve ara parçalarını ebatla birlikte verir.")
}, "omsusp06");

var idPoyra = addUst({
  path: "suspansiyon-poyra",
  name: "Süspansiyon / Poyra",
  icon: "settings_suggest",
  imgFrom: "omsusp06",
  description: "Tekerlek göbeği, yatak, bijon/saplama ve mil contası ile poyra grubunu yenileyin; uğultu ve titreşimde Oto Mavi süspansiyon-poyra reyonundan şasiye uygun seçim yapın.",
  keyword: "tekerlek göbeği, tekerlek yatağı, bijon saplama, mil contası, poyra BMW",
  text: htmlText(
    "Süspansiyon / Poyra",
    "Poyra ve tekerlek yatağı uğultusu hızla artan bir arızadır; gecikirse ABS halkası da zarar görür. Oto Mavi göbek, yatak ve conta setlerini aks tipine göre ayırır.",
    "Sönümleme (amortisör/yay) reyonundan ayrı tutulan bu kategori hub ve rulman odaklıdır."
  )
});
addUrun(idPoyra, {
  path: "tekerlek-gobegi",
  name: "Tekerlek Göbeği",
  icon: "trip_origin",
  description: "ABS ringli tekerlek göbeği poyrayı taşıır; aşınmış göbek uğultu ve direksiyon titreşimi yapar, flanş delik sayısı modele özeldir.",
  keyword: "tekerlek göbeği, wheel hub, ABS ring göbek, poyra flanş, BMW hub",
  text: htmlText("Tekerlek Göbeği", "Tekerlek göbeği rulmanla entegre veya ayrı olabilir. Entegre tipte komple göbek değişimi gerekir.", "Oto Mavi ön/arka göbekleri şasi ve ABS tipine göre listeler.")
}, "omsusp06");
addUrun(idPoyra, {
  path: "tekerlek-yatagi",
  name: "Tekerlek Yatağı",
  icon: "radio_button_checked",
  description: "Konik veya bilyalı tekerlek yatağı göbek içinde döner; yağsız veya oynamış yatak metal sesi üretir, pres ölçüsü OEM değerde tutulmalıdır.",
  keyword: "tekerlek yatağı, wheel bearing, poyra rulmanı, hub bearing, BMW rulman",
  text: htmlText("Tekerlek Yatağı", "Tekerlek yatağı uğultusu virajda değişen tonda duyulur. Yanlış pres göbeği ezer.", "Oto Mavi yatak ve gerektiğinde göbek setini birlikte önerir.")
}, "omsusp06");
addUrun(idPoyra, {
  path: "bijon-saplama",
  name: "Bijon / Saplama",
  icon: "push_pin",
  description: "Jantı göbeğe bağlayan bijon veya saplama doğru tork ve diş boyu ister; uzatılmış saplama spacer ile gelir, çapraz sıkım şarttır.",
  keyword: "bijon, jant saplama, wheel stud, lug bolt, BMW bijon",
  text: htmlText("Bijon / Saplama", "Bijon ve saplama diş formu M12/M14 gibi modellere göre değişir. Yanlış boy fren diski temasına yol açabilir.", "Oto Mavi orijinal diş ve anahtar ağzı ölçüsünde stok tutar.")
}, "omsusp06");
addUrun(idPoyra, {
  path: "mil-contasi",
  name: "Mil Contası",
  icon: "contrast",
  description: "Aks mil contası diferansiyel veya şanzıman yağının dışarı sızmasını keser; yırtık conta lastik yanaklarında yağ lekesi ve kavrama kaybı bırakır.",
  keyword: "mil contası, aks keçe, drive shaft seal, yağ keçe, BMW mil conta",
  text: htmlText("Mil Contası", "Mil contası (keçe) sızdırmazlık elemanıdır. Montajda mil yüzeyinin çiziksiz olması gerekir.", "Oto Mavi iç/dış çap ölçülü keçeleri aks tipine göre verir.")
}, "ommotr04");

var idPark = addUst({
  path: "park-elektronik",
  name: "Park ve Elektronik",
  icon: "sensors",
  imgFrom: "omelek05",
  description: "Park sensörü, motor beyni (ECU) ve röle/kontrol üniteleriyle elektronik yardımcılar burada; hata kodu ve konnektör tipine göre Oto Mavi elektronik reyonundan ilerleyin.",
  keyword: "park sensörü, motor beyni ECU, röle kontrol ünitesi, kablo demeti, BMW elektronik",
  text: htmlText(
    "Park ve Elektronik",
    "Park yardım sensörleri, motor kontrol beyni ve röle üniteleri sürüş güvenliğini destekler. Yanlış kodlanmış ECU veya arızalı sensör sürekli uyarı üretir.",
    "Oto Mavi elektronik parçalarında pin, frekans ve yazılım notunu şasiyle doğrular; sepet yok, teklif hattı açıktır."
  )
});
addUrun(idPark, {
  path: "park-sensoru",
  name: "Park Sensörü",
  icon: "sensors",
  description: "Tampona gömülen ultrasonik park sensörü mesafe bipini üretir; boya kalınlığı ve frekans uyumu kritiktir, sol/sağ/merkez konumları ayrıdır.",
  keyword: "park sensörü, PDC sensör, ultrasonik park, tampon sensörü, BMW park yardımı",
  text: htmlText("Park Sensörü", "Park sensörü sürekli öter veya hiç çalışmazsa konnektör nemi veya membran delinmesi sık sebeptir.", "Oto Mavi frekans ve renk halkasına göre sensör seçer.")
}, "omelek05");
addUrun(idPark, {
  path: "motor-beyni-ecu",
  name: "Motor Beyni (ECU)",
  icon: "memory",
  description: "Motor kontrol ünitesi enjektör ve ateşleme haritasını yönetir; su hasarlı veya hatalı ECU rölanti ve çekiş bozar, kodlama/immobilizer notu şarttır.",
  keyword: "motor beyni, ECU DME, motor kontrol ünitesi, immobilizer kodlama, BMW ECU",
  text: htmlText("Motor Beyni (ECU)", "ECU değişiminde immobilizer ve kodlama adımları atlanmamalıdır. Su girişi en sık fiziksel hasardır.", "Oto Mavi tedarik ve teknik yönlendirme ile doğru beyin numarasını bulur.")
}, "omelek05");
addUrun(idPark, {
  path: "role-kontrol-unitesi",
  name: "Röle / Kontrol Ünitesi",
  icon: "electrical_services",
  description: "Fan, yakıt pompası veya far rölesi ile küçük kontrol kutuları akım anahtarlar; yanık kontak aralıklı arıza üretir, amper ve pin haritası etiketle doğrulanır.",
  keyword: "röle, kontrol ünitesi, fan rölesi, yakıt pompası röle, BMW röle kutusu",
  text: htmlText("Röle / Kontrol Ünitesi", "Röle arızası çoğu zaman ‘arada bir’ çalışan sistemlerle kendini gösterir. Soket yanığı kontrol edilmelidir.", "Oto Mavi röle ve mini kontrol ünitelerini numara ve ayak düzenine göre verir.")
}, "omelek05");
addUrun(idPark, {
  path: "elektronik-kablo-demeti",
  name: "Elektronik Kablo Demeti",
  icon: "cable",
  description: "Sensör ve ünite arası onarım demeti kopuk pinleri giderir; su giren konnektörlerde korozyon yaygındır, kesit ve fiş kilidi OEM uyumlu seçilir.",
  keyword: "kablo demeti, wiring repair, konnektör pin, sensör kablosu, BMW elektrik tesisat",
  text: htmlText("Elektronik Kablo Demeti", "Onarım demetleri kısa devre ve kopuk sinyal hatlarında ekonomik çözümdür. Yanlış kesit ısınma yaratır.", "Oto Mavi pin ve fiş tipine göre demet önerir.")
}, "omelek05");

var idEkip = addUst({
  path: "arac-ekipmanlari",
  name: "Araç Ekipmanları",
  icon: "home_repair_service",
  imgFrom: "omicdn11",
  description: "Genel ekipman, aksesuar seti ve atölye sarf malzemeleriyle yol ve servis ihtiyacını tamamlayın; Oto Mavi araç ekipmanları reyonu katalog dışı pratik parçaları toplar.",
  keyword: "araç ekipmanları, aksesuar seti, atölye sarf, taşıma destek, BMW aksesuar",
  text: htmlText(
    "Araç Ekipmanları",
    "Yedek parça dışında kalan pratik ekipman ve sarf malzemeleri bu reyon altında toplanır. Servis ve yol hazırlığı için hızlı erişim hedeflenir.",
    "Stok ve uyumluluk için Oto Mavi ile iletişime geçin; sepet yok, teklif odaklıdır."
  )
});
addUrun(idEkip, {
  path: "genel-ekipman",
  name: "Genel Ekipman",
  icon: "handyman",
  description: "Kriko adaptörü, akü kutup başı ve temel yol ekipmanı acil durumda işe yarar; araç tipine göre kaldırma noktası uyarısıyla birlikte değerlendirilir.",
  keyword: "genel araç ekipmanı, kriko adaptör, akü kutup, yol seti, BMW ekipman",
  text: htmlText("Genel Ekipman", "Genel ekipman listesi modelden modele değişir. Yanlış kriko noktası şasiye zarar verebilir.", "Oto Mavi danışmanlığıyla doğru aparatı seçin.")
}, "ombkim10");
addUrun(idEkip, {
  path: "aksesuar-seti",
  name: "Aksesuar Seti",
  icon: "widgets",
  description: "Bagaj file, telefon tutucu ve kabin düzen aksesuarları günlük kullanımı kolaylaştırır; yapışkanlı ürünlerde torpido yüzeyi uyumu kontrol edilir.",
  keyword: "araç aksesuar seti, bagaj file, kabin düzen, telefon tutucu, BMW aksesuar",
  text: htmlText("Aksesuar Seti", "Aksesuar setleri konfor odaklıdır; güvenlik ekipmanının yerini tutmaz. Montaj yüzeyi temiz olmalıdır.", "Oto Mavi stokundan modele uygun seçenek isteyin.")
}, "omicdn11");
addUrun(idEkip, {
  path: "atolye-sarf",
  name: "Atölye Sarf",
  icon: "science",
  description: "Conta macunu, temizleyici sprey ve eldiven gibi atölye sarfı montaj kalitesini etkiler; yanlış kimyasal plastik ve boyaya zarar verebilir.",
  keyword: "atölye sarf, conta macunu, fren temizleyici, montaj yağı, servis sarf",
  text: htmlText("Atölye Sarf", "Doğru sarf malzemesi conta ve hortum ömrünü uzatır. Silikon tipi contaya göre seçilmelidir.", "Oto Mavi bakım ve montaj sarflarını kitlerle birlikte sunar.")
}, "ombkim10");
addUrun(idEkip, {
  path: "tasima-destek",
  name: "Taşıma / Destek",
  icon: "luggage",
  description: "Bagaj sabitleme kayışı ve taşıma destek aparatları yük güvenliğini artırır; aşırı yük şasi ve lastik limitini aşmamalıdır.",
  keyword: "taşıma kayışı, bagaj sabitleme, yük destek, araç taşıma aparatı, BMW bagaj",
  text: htmlText("Taşıma / Destek", "Yük taşırken sabitleme kayışı kaymayı önler. Araç üretici ağırlık limitine uyun.", "Oto Mavi ekipman reyonundan pratik taşıma aparatları talep edin.")
}, "omicdn11");



addUrun("omfren02", {
  path: "asinma-sensoru",
  name: "Aşınma Sensörü",
  icon: "sensors",
  description: "Balata kalınlığını izleyen aşınma sensörü uyarı lambasını yakar; kablolu pad setlerinde sensör ayrı satılır, sol/sağ uzunluk aksa göre değişir.",
  keyword: "balata aşınma sensörü, brake wear sensor, pad uyarı kablosu, fren sensörü, BMW aşınma",
  text: htmlText("Aşınma Sensörü", "Aşınma sensörü balata bitmeden uyarı verir. Kopuk kablo sürekli lamba yakabilir.", "Oto Mavi ön/arka sensör uzunluklarını aks koduna göre ayırır.")
}, "omfren02");
addUrun("omfren02", {
  path: "tambur-fren",
  name: "Tambur Fren",
  icon: "album",
  description: "Arka tambur, pabuç ve yay seti kampana fren sistemini yeniler; el freni teliyle birlikte ayarlanır, çatlak tambur titreşim üretir.",
  keyword: "tambur fren, kampana, fren pabucu, drum brake, BMW arka fren",
  text: htmlText("Tambur Fren", "Bazı BMW arka aks uygulamalarında tambur/pabuç sistemi kullanılır. Yay seti olmadan montaj eksik kalır.", "Oto Mavi tambur çapı ve pabuç genişliğine göre set sunar.")
}, "omfren02");

addUrun("omgvde03", {
  path: "kapilar",
  name: "Kapılar",
  icon: "door_front",
  description: "Kapı sacı, menteşe ve kilit karşılığı çarpışma sonrası değişir; boyasız kapıda cam rayı ve fitil kanalları kontrol edilir, sol/sağ net ayrılır.",
  keyword: "araç kapısı, kapı sacı, menteşe kilit, BMW kapı, door shell",
  text: htmlText("Kapılar", "Kapı değişiminde menteşe ayarı ve kilit karşılığı kritiktir. Cam ve ayna donanımı ayrıca planlanır.", "Oto Mavi boyasız veya astarlı kapı seçeneklerini şasiyle doğrular.")
}, "omgvde03");
addUrun("omgvde03", {
  path: "yakit-deposu",
  name: "Yakıt Deposu",
  icon: "local_gas_station",
  description: "Plastik veya sac yakıt deposu çatlak ve paslanma durumunda değişir; pompa flanşı ve şamandıra contası birlikte değerlendirilir, emniyet kurallarına uyulur.",
  keyword: "yakıt deposu, fuel tank, şamandıra flanş, depo conta, BMW yakıt tankı",
  text: htmlText("Yakıt Deposu", "Yakıt deposu çalışması uzmanlık ve güvenlik gerektirir. Çatlak koku ve sızıntıyla anlaşılır.", "Oto Mavi depo ve flanş conta setlerini model yılına göre listeler.")
}, "omgvde03");

addUrun("omklma07", {
  path: "isi-esanjoru",
  name: "Isı Eşanjörü",
  icon: "device_thermostat",
  description: "Kabin ısıtma radyatörü (ısı eşanjörü) sıcak suyu havaya aktarır; tıkanmış çekirdek üşüyen kabin ve ıslak halı bırakır, kutu içinde değişir.",
  keyword: "ısı eşanjörü, heater core, kalorifer radyatörü, kabin ısıtıcı, BMW ısıtma",
  text: htmlText("Isı Eşanjörü", "Isı eşanjörü tıkanınca kalorifer üflemesi soğuk kalır. Kaçak halıyı ıslatır.", "Oto Mavi çekirdek ölçülerini klima/kalorifer kutusuna göre verir.")
}, "omklma07");

addUrun("omkysi13", {
  path: "titresim-sonumleyici",
  name: "Titreşim Sönümleyici",
  icon: "vibration",
  description: "Krank kasnağı damper (titreşim sönümleyici) kayış hattındaki titreşimi emer; çatlamış elastomer squeal ve krank hasarı riski yaratır.",
  keyword: "titreşim sönümleyici, krank damper, harmonic balancer, kasnak damper, BMW kayış",
  text: htmlText("Titreşim Sönümleyici", "Harmonic balancer aşınması kayış ömrünü kısaltır. Görsel çatlak ve salgı kontrolü yapılmalıdır.", "Oto Mavi damper kasnaklarını triger/aksesuar setiyle birlikte önerir.")
}, "omkysi13");

addUrun("omsusp06", {
  path: "yaprak-yay",
  name: "Yaprak Yay",
  icon: "view_agenda",
  description: "Çok katmanlı yaprak yay arka yük taşımasını dengeler; kırık katman çökme ve yanal savrulma yapar, burç ve kelepçeyle birlikte kontrol edilir.",
  keyword: "yaprak yay, leaf spring, arka yay paketi, yay kelepçe, BMW yay",
  text: htmlText("Yaprak Yay", "Bazı ticari/üstyapı uygulamalarında yaprak yay kullanılır. Katman sayısı yük kapasitesini belirler.", "Oto Mavi yaprak ve burç setlerini aks tipine göre tedarik eder.")
}, "omsusp06");

addUrun("omelek05", {
  path: "role-baslatici",
  name: "Röle Başlatıcı",
  icon: "power",
  description: "Marş devresini anahtarlayan başlatıcı röle yüksek akımı yönetir; yapışkan kontak sürekli çalıştırma veya hiç çalışmama üretir, soket amperi etiketle eşleşir.",
  keyword: "başlatıcı röle, starter relay, marş rölesi, ana kontak röle, BMW start röle",
  text: htmlText("Röle Başlatıcı", "Marş rölesi arızası akü ve marş motoru sağlamken bile start engeller. Soket ısısı ipucudur.", "Oto Mavi amper ve ayak düzenine göre röle seçer.")
}, "omelek05");

addUrun("ommotr04", {
  path: "lambda-sensoru",
  name: "Lambda Sensörü",
  icon: "science",
  description: "Egzoz oksijen (lambda) sensörü karışım oranını ECU’ya bildirir; yaşlanan sensör yakıt sarfiyatı ve rölanti bozar, ön/arka bank konumları ayrıdır.",
  keyword: "lambda sensörü, oksijen sensörü, O2 sensor, egzoz lambda, BMW sonda",
  text: htmlText("Lambda Sensörü", "Lambda sensörü zengin/fakir karışım uyarısının sık sebebidir. Konum (pre/post cat) karıştırılmamalıdır.", "Oto Mavi konnektör ve ısıtıcı tipine göre sonda verir.")
}, "ommotr04");
addUrun("ommotr04", {
  path: "oil-cooler",
  name: "Oil Cooler / Yağ Soğutucu",
  icon: "water_drop",
  description: "Motor yağ soğutucusu (oil cooler) yüksek sıcaklıkta viskoziteyi korur; tıkanmış veya delik soğutucu hararet ve yağ-su karışımı riski taşır.",
  keyword: "oil cooler, yağ soğutucu, motor yağ radyatörü, oil heat exchanger, BMW yağ soğutma",
  text: htmlText("Oil Cooler / Yağ Soğutucu", "Yağ soğutucu kaçaklarında hem yağ hem antifriz kaybı görülebilir. Conta seti şarttır.", "Oto Mavi cooler ve hortum bağlantılarını motor koduna göre listeler.")
}, "ommotr04");

addUrun("omatsg08", {
  path: "atesleme-kablosu",
  name: "Ateşleme Kablosu",
  icon: "cable",
  description: "Bobin ile buji arasını bağlayan ateşleme kablosu yüksek voltaj taşır; çatlamış izolasyon misfire ve radyo paraziti üretir, ohm değeri kontrol edilir.",
  keyword: "ateşleme kablosu, buji kablosu, ignition wire, HT kablo, BMW ateşleme",
  text: htmlText("Ateşleme Kablosu", "Kablo tipi ateşleme hâlâ bazı motorlarda kullanılır. Nemli havada kaçak artar.", "Oto Mavi set halinde direnç uyumlu kablo sunar.")
}, "omatsg08");

addUrun("omsivi09", {
  path: "hidrolik-yagi",
  name: "Hidrolik Yağı",
  icon: "water_drop",
  description: "Direksiyon veya üst yapı hidroliği için CHF/ATF sınıfı yağlar ayrılır; yanlış spesifikasyon pompa uğultusu ve conta şişmesi yaratır, litre litre satılır.",
  keyword: "hidrolik yağı, CHF 11S, direksiyon hidroliği, hydraulic fluid, BMW hidrolik",
  text: htmlText("Hidrolik Yağı", "Hidrolik yağ spesifikasyonu araç etiketinde yazar. Karışım yapmayın.", "Oto Mavi onaylı hidrolik yağları litre olarak temin eder.")
}, "omsivi09");
addUrun("omsivi09", {
  path: "atf",
  name: "ATF",
  icon: "opacity",
  description: "Otomatik şanzıman ATF yağı sürtünme ve soğutma sağlar; yanlış ATF vites savrulması yapar, değişimde filtre ve conta ile birlikte planlanır.",
  keyword: "ATF, otomatik şanzıman yağı, transmission fluid, Dexron, BMW ATF",
  text: htmlText("ATF", "ATF tipi kutu koduna göre değişir. Renk ve koku yağ durumu hakkında fikir verir ama tek başına yeterli değildir.", "Oto Mavi doğru spesifikasyonu şasiyle doğrular.")
}, "omsivi09");
addUrun("omsivi09", {
  path: "yag-katkisi",
  name: "Yağ Katkısı",
  icon: "science",
  description: "Motor veya şanzıman katkıları sızdırmazlık ve sürtünme düzenlemesi için kullanılır; aşırı doz filtre tıkanması riski taşır, üretici uyarısına uyulur.",
  keyword: "yağ katkısı, oil additive, sızdırmazlık katkısı, motor katkı, BMW katkı",
  text: htmlText("Yağ Katkısı", "Katkı ürünleri bakımın yerini tutmaz; bilinçli ve dozunda kullanılmalıdır.", "Oto Mavi katkı seçiminde yağ tipi ve şikayeti birlikte değerlendirir.")
}, "omsivi09");

addUrun("omicdn11", {
  path: "vites-topuzu",
  name: "Vites Topuzu",
  icon: "sports_esports",
  description: "Vites kolu topuzu vida veya klips tutuculu gelir; aşınmış deri/plastik tutuşu bozar, geri vites körüğüyle birlikte değişim sık tercih edilir.",
  keyword: "vites topuzu, shift knob, vites topu, BMW vites kolu, gear knob",
  text: htmlText("Vites Topuzu", "Vites topuzu hem konfor hem görünüm parçasıdır. Diş tipi modele özeldir.", "Oto Mavi orijinal ve eşdeğer topuz seçeneklerini listeler.")
}, "omicdn11");
addUrun("omicdn11", {
  path: "cam-kolu",
  name: "Cam Kolu",
  icon: "window",
  description: "Manuel cam çevirme kolu veya elektrikli cam düğme paneli kapı kartına oturur; kırık klips boşluk yapar, sol/sağ ve ön/arka ayrı kodlanır.",
  keyword: "cam kolu, window crank, cam düğmesi, kapı cam kolu, BMW cam açma",
  text: htmlText("Cam Kolu", "Manuel kol veya elektrik düğme paneli araç donanımına göre değişir. Klips kırığı sık görülür.", "Oto Mavi kapı tarafına göre doğru parçayı ayırır.")
}, "omicdn11");

addUrun("omaydn12", {
  path: "sinyal-lambasi",
  name: "Sinyal Lambası",
  icon: "swipe_right_alt",
  description: "Ön/arka sinyal lambası veya ampül/LED ünitesi dönüş uyarısını verir; su alan duyda buhar oluşur, sol/sağ cam ve far tipi uyumu kontrol edilir.",
  keyword: "sinyal lambası, dönüş lambası, indicator light, flasher, BMW sinyal",
  text: htmlText("Sinyal Lambası", "Sinyal lambası hızlı yanıp sönüyorsa ampül veya LED uyumsuzluğu sık sebeptir.", "Oto Mavi duy tipi ve renk camına göre lamba seçer.")
}, "omaydn12");

addUrun("omslck14", {
  path: "silecek-motoru",
  name: "Silecek Motoru",
  icon: "settings",
  description: "Cam silecek motoru ve redüktör kolu park konumuna getirir; yavaş çalışan motor fırça aşınması veya dişli kırığı işaretidir, bağlantı koluyla birlikte bakılır.",
  keyword: "silecek motoru, wiper motor, silecek redüktör, cam silme motoru, BMW silecek",
  text: htmlText("Silecek Motoru", "Silecek motoru park etmiyorsa park anahtarı veya dişli aşınması olabilir.", "Oto Mavi motor ve kol bağlantısını şasiye göre temin eder.")
}, "omslck14");



function main() {
  var products = JSON.parse(fs.readFileSync(PRODUCTS, "utf8"));
  var startIndex = products.data.length;
  products.description = {
    tr: "Oto Mavi ürün kataloğu — Gaziantep BMW oto yedek parçaları: filtre, fren, gövde, motor, elektrik, sönümleme, klima, turbo, direksiyon, şanzıman, lastik, poyra, park elektroniği ve araç ekipmanları."
  };
  products.keyword = {
    tr: "BMW yedek parça, Oto Mavi, Gaziantep, ürün kategorileri, turbo, direksiyon, şanzıman, lastik, orijinal parça"
  };

  var i;
  for (i = 0; i < newUst.length; i++) {
    newUst[i].index = startIndex + i;
    products.data.push(makeUst(newUst[i]));
  }
  var afterUst = startIndex + newUst.length;
  for (i = 0; i < newUrun.length; i++) {
    newUrun[i].index = afterUst + i;
    products.data.push(makeUrun(newUrun[i]));
  }

  fs.writeFileSync(PRODUCTS, JSON.stringify(products, null, 2), "utf8");
  log("products.json yazıldı: +" + newUst.length + " üst, +" + newUrun.length + " ürün");

  for (i = 0; i < pageMeta.length; i++) {
    var pm = pageMeta[i];
    writePage(pm.meta, pm.isUst, pm.imgFrom);
  }
  log("page klasörleri yazıldı: " + pageMeta.length);
  var hubPath = path.join(PAGE_DIR, "hs54qzyeyo", "index.json");
  if (fs.existsSync(hubPath)) {
    var hub = JSON.parse(fs.readFileSync(hubPath, "utf8"));
    hub.description = {
      tr: "Oto Mavi ürün kataloğu: filtre, fren, gövde, motor, elektrik, sönümleme, klima, ateşleme, yağlar, bakım, iç donanım, aydınlatma, kayış, silecek, turbo, direksiyon, şanzıman, lastik, poyra, park elektroniği, araç ekipmanları."
    };
    hub.keyword = {
      tr: "Oto Mavi ürünler, BMW yedek parça, turbo, direksiyon, şanzıman, lastik, Gaziantep katalog"
    };
    hub.update = TODAY;
    fs.writeFileSync(hubPath, JSON.stringify(hub, null, 2), "utf8");
    log("hs54qzyeyo hub description güncellendi");
  }
  var modules = JSON.parse(fs.readFileSync(MODULES, "utf8"));
  var mi;
  for (mi = 0; mi < modules.data.length; mi++) {
    var m = modules.data[mi];
    if (m.id === "t1ls01" && m.desing) {
      m.desing.max = 24;
      m.desing.size = 4;
      log("t1ls01 max=24 (yeni üstler ana sayfada)");
    }
    if (m.id === "t1plpr" && m.desing) {
      m.desing.size = 24;
      log("t1plpr size=24 (ürünler hub tüm üstler)");
    }
  }
  fs.writeFileSync(MODULES, JSON.stringify(modules, null, 2), "utf8");

  var ustCount = products.data.filter(function (r) { return r.category === ""; }).length;
  var urunCount = products.data.filter(function (r) { return r.category !== ""; }).length;
  log("SONUÇ üst=" + ustCount + " ürün=" + urunCount + " kalanID=" + (IDS.length - idIdx));

  var summary = {
    ust: ustCount,
    urun: urunCount,
    newUst: newUst.map(function (u) { return u.id + ":" + u.path; }),
    newUrunCount: newUrun.length,
    imgMode: "kopya (ComfyUI workflow listesi boş)",
    usedIds: idIdx
  };
  fs.writeFileSync(
    path.join(__dirname, "15_build_summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(__dirname, "15_build_console.log"),
    logLines.join("\n"),
    "utf8"
  );
}

main();
