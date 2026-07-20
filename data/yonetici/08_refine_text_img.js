
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = "D:/projeler/otomavi/Web/matrix";
const PAGE = path.join(ROOT, "page");
const TEL = "0544 717 18 28";
const MAIL = "info@otomavi.com";


const TEXTS = {
  omfykt1a: `<h2 style="font-size: 24px;">Yakıt Filtresi</h2><p style="font-size: 16px;">Enjektör ve yüksek basınç pompasını koruyan yakıt filtresi, BMW dizel ve benzin hatlarında kir tutma kapasitesiyle öne çıkar. Oto Mavi stokunda OEM ve eşdeğer seçenekler bulunur.</p><p style="font-size: 16px;">Değişim aralığı yakıt kalitesine göre kısalabilir; tıkanma belirtisinde motor çekiş kaybı yaşanır. Şasi numaranızı iletin, doğru kodu birlikte seçelim.</p><p style="font-size: 16px;">Sipariş: ${TEL} · ${MAIL} — sepet yok, telefon/WhatsApp ile.</p>`,
  omfhva1b: `<h2 style="font-size: 24px;">Hava Filtresi</h2><p style="font-size: 16px;">Motor emiş yolunu toz ve polenden koruyan hava filtresi, yanma verimini doğrudan etkiler. Oto Mavi BMW hava filtrelerinde kağıt medya ve çerçeve kalitesi kontrol edilir.</p><p style="font-size: 16px;">Tozlu bölgelerde daha sık değişim önerilir. Model yılı ve motor koduyla stok sorgulayın.</p><p style="font-size: 16px;">Gaziantep Oto Mavi: ${TEL}</p>`,
  omfyag1c: `<h2 style="font-size: 24px;">Yağ Filtresi</h2><p style="font-size: 16px;">Yağ filtresi, motor yağındaki metalik partikülleri tutarak yatak ve turbo ömrünü uzatır. Oto Mavi’de vida tipi ve kartuş tipi BMW yağ filtreleri bulunur.</p><p style="font-size: 16px;">Yağ değişiminde filtreyi birlikte yenilemek standart bakımdır. Spec’e uygun yağ ile kombinasyon önerilir.</p><p style="font-size: 16px;">Destek: ${TEL} · WhatsApp</p>`,
  omfpln1d: `<h2 style="font-size: 24px;">Polen Filtresi</h2><p style="font-size: 16px;">Kabin / polen filtresi, klima ve ısıtma hattından gelen toz, polen ve kokuyu azaltır. Aktif karbonlu varyantlar Oto Mavi stokunda mevcuttur.</p><p style="font-size: 16px;">Koku veya üfleme gücünde düşüş varsa filtreyi kontrol ettirin. BMW modelinize göre kesim farklıdır.</p><p style="font-size: 16px;">İletişim: ${MAIL} · ${TEL}</p>`,
  omfdsk2a: `<h2 style="font-size: 24px;">Fren Diski</h2><p style="font-size: 16px;">Fren diski ısı dağıtımı ve denge için kritiktir; çarpık disk titreşim ve pedal titreşimi yaratır. Oto Mavi ön/arka BMW disklerinde kalınlık ve delik deseni modele göre seçilir.</p><p style="font-size: 16px;">Balata ile birlikte değişim çoğu zaman daha sağlıklıdır. Aks ve şasi ile stok doğrulayın.</p><p style="font-size: 16px;">Sipariş hattı: ${TEL}</p>`,
  omfblt2b: `<h2 style="font-size: 24px;">Fren Balatası</h2><p style="font-size: 16px;">Balata seti sürtünme malzemesi ve arka plaka kalitesiyle sessiz frenleme sağlar. Oto Mavi BMW balatalarında aşınma sensörü kablolu seçenekler vardır.</p><p style="font-size: 16px;">Disk yüzeyi kontrol edilmeden sadece balata değişimi önerilmez. Set halinde sipariş verin.</p><p style="font-size: 16px;">WhatsApp / ${TEL}</p>`,
  omfhyd2c: `<h2 style="font-size: 24px;">Fren Hidroliği</h2><p style="font-size: 16px;">Fren hidroliği nem aldıkça kaynama noktası düşer; bu da pedal hissini bozar. Oto Mavi DOT sınıfı BMW fren sıvılarını araç kılavuzuna göre önerir.</p><p style="font-size: 16px;">Periyodik değişim ve sistem havası alma atölye prosedürüdür. Sınıfı karıştırmayın.</p><p style="font-size: 16px;">Bilgi: ${TEL}</p>`,
  omgtmp3a: `<h2 style="font-size: 24px;">Tampon</h2><p style="font-size: 16px;">Ön veya arka tampon, park manevrası ve küçük darbelerde ilk koruma katmanıdır. Oto Mavi BMW tamponlarında boyasız gövde veya boyalı seçenekler sunulur.</p><p style="font-size: 16px;">Park sensörü ve sis farı yuvası modele göre değişir; fotoğraf veya şasi ile eşleştirme yapıyoruz.</p><p style="font-size: 16px;">Kaporta siparişi: ${TEL}</p>`,
  omgayn3b: `<h2 style="font-size: 24px;">Yan Ayna</h2><p style="font-size: 16px;">Yan ayna elektrikli katlama, ısıtma ve sinyal entegreli olabilir. Oto Mavi sol/sağ BMW ayna gövdelerini renk koduna göre temin eder.</p><p style="font-size: 16px;">Cam kırığı ile gövde hasarı farklı parçalardır; ihtiyacı netleştirin.</p><p style="font-size: 16px;">${MAIL} · ${TEL}</p>`,
  omgpnl3c: `<h2 style="font-size: 24px;">Kaporta Paneli</h2><p style="font-size: 16px;">Çamurluk ve yan panel onarımında doğru sac kalınlığı ve vida noktaları önemlidir. Oto Mavi BMW kaporta panellerinde OEM / eşdeğer alternatifler bulunur.</p><p style="font-size: 16px;">Hasar bölgesi fotoğrafı ile hızlı teklif alabilirsiniz.</p><p style="font-size: 16px;">Gaziantep stok: ${TEL}</p>`,
  ommcta4a: `<h2 style="font-size: 24px;">Conta Seti</h2><p style="font-size: 16px;">Üst/alt conta setleri yağ ve soğutma kaçaklarını önler. Oto Mavi BMW conta setlerinde motor kodu eşleşmesi zorunludur.</p><p style="font-size: 16px;">Tek conta yerine set kullanmak işçilik tekrarını azaltır. İş tipinizi (kapak, karter, emme) belirtin.</p><p style="font-size: 16px;">Atölye siparişi: ${TEL}</p>`,
  ommsgt4b: `<h2 style="font-size: 24px;">Soğutma Parçası</h2><p style="font-size: 16px;">Termostat, hortum ve radyatör grubu motor ısısını dengede tutar. Oto Mavi BMW soğutma parçalarında sızıntı ve aşırı ısınma şikayetlerine yönelik stok vardır.</p><p style="font-size: 16px;">Antifriz tipi ile birlikte değişim önerilir. Arıza belirtisini yazın.</p><p style="font-size: 16px;">Destek: ${TEL}</p>`,
  ommsns4c: `<h2 style="font-size: 24px;">Motor Sensörü</h2><p style="font-size: 16px;">Oksijen, krank ve sıcaklık sensörleri ECU’ya doğru sinyal gönderir. Oto Mavi’de arıza koduna göre BMW sensör seçimi yapılır.</p><p style="font-size: 16px;">Yanlış sensör yakıt tüketimini bozar; OBD kodunu paylaşın.</p><p style="font-size: 16px;">Teknik hat: ${TEL} · ${MAIL}</p>`,
  omeaku5a: `<h2 style="font-size: 24px;">Akü</h2><p style="font-size: 16px;">Start-stop sistemli BMW’lerde AGM / EFB akü tercih edilir. Oto Mavi Ah kapasitesi ve kutup yönüne göre akü önerir.</p><p style="font-size: 16px;">Kayıt kodlama gerektiren modellerde atölye bilgilendirmesi yapılır. Eski akü boyutunu ölçün.</p><p style="font-size: 16px;">Sipariş: ${TEL}</p>`,
  omealt5b: `<h2 style="font-size: 24px;">Alternatör</h2><p style="font-size: 16px;">Alternatör şarj voltajını stabil tutar; düşük şarj far ve elektronik arızalarına yol açar. Oto Mavi BMW alternatörlerinde amper değeri modele göredir.</p><p style="font-size: 16px;">Kayış ve gergi ile birlikte kontrol edin. Şarj lambası yanıyorsa stok sorgulayın.</p><p style="font-size: 16px;">${TEL} · WhatsApp</p>`,
  omemrs5c: `<h2 style="font-size: 24px;">Marş Motoru</h2><p style="font-size: 16px;">Marş motoru soğukta yüksek tork ister; tıkırtı veya yavaş çevirme aşınma belirtisidir. Oto Mavi BMW marş motorlarında bendiks ve solenoit kalitesi önemlidir.</p><p style="font-size: 16px;">Akü sağlıklı değilse önce şarj/akü kontrolü yapın.</p><p style="font-size: 16px;">İletişim: ${TEL}</p>`,
  omsamr6a: `<h2 style="font-size: 24px;">Amortisör</h2><p style="font-size: 16px;">Amortisör salınımı sönümleyerek lastik temasını korur. Oto Mavi ön/arka BMW amortisörlerinde gazlı seçenekler bulunur.</p><p style="font-size: 16px;">Tek taraflı değişim dengesizlik yaratabilir; çift önerilir. Yay ve takoz durumu da kontrol edilmeli.</p><p style="font-size: 16px;">Süspansiyon: ${TEL}</p>`,
  omsyay6b: `<h2 style="font-size: 24px;">Helezon Yay</h2><p style="font-size: 16px;">Helezon yay oturma yüksekliği ve yük taşıma karakterini belirler. Oto Mavi BMW yaylarında şasi ve motor varyantına göre sertlik seçilir.</p><p style="font-size: 16px;">Kırık veya çökmüş yayda lastik aşınması artar. Sol/sağ aynı partiden alın.</p><p style="font-size: 16px;">${MAIL}</p>`,
  omsbrc6c: `<h2 style="font-size: 24px;">Salıncak Burcu</h2><p style="font-size: 16px;">Salıncak burcu aşınınca direksiyon boşluğu ve lastik iç kenar aşınması görülür. Oto Mavi BMW burçlarında kauçuk sertliği OEM’e yakın tutulur.</p><p style="font-size: 16px;">Rot başı ve salıncak kolu ile birlikte muayene önerilir.</p><p style="font-size: 16px;">Sipariş: ${TEL}</p>`,
  omkkmp7a: `<h2 style="font-size: 24px;">Klima Kompresörü</h2><p style="font-size: 16px;">Klima kompresörü soğutma çevriminin kalbidir; gürültü veya yağ kaçığı arıza işaretidir. Oto Mavi BMW kompresörlerinde kavrama ve yağ tipi modele göredir.</p><p style="font-size: 16px;">Sistem vakum ve gaz dolumu atölye işidir. Eski kompresör kodunu iletin.</p><p style="font-size: 16px;">Klima hattı: ${TEL}</p>`,
  omkknd7b: `<h2 style="font-size: 24px;">Kondanser</h2><p style="font-size: 16px;">Kondanser ön panelde ısıyı dışarı atar; taş darbesi sızıntıya yol açabilir. Oto Mavi BMW kondanserlerinde alüminyum gövde ve fan uyumu kontrol edilir.</p><p style="font-size: 16px;">Radyatör ve intercooler ile birlikte montaj sırası önemlidir.</p><p style="font-size: 16px;">${TEL} · ${MAIL}</p>`,
  omkkrt7c: `<h2 style="font-size: 24px;">Kurutucu</h2><p style="font-size: 16px;">Klima kurutucusu (receiver/drier) nemi tutarak kompresörü korur. Açık sistemde veya kompresör değişiminde kurutucu da yenilenmelidir.</p><p style="font-size: 16px;">Oto Mavi stokunda gaz tipine uygun kurutucular vardır.</p><p style="font-size: 16px;">Sipariş: ${TEL}</p>`,
  omatbj8a: `<h2 style="font-size: 24px;">Buji</h2><p style="font-size: 16px;">Buji ısı değeri yanlış seçilirse rölanti bozulur. Oto Mavi BMW bujilerinde iridyum / platin seçenekler motor koduna göre önerilir.</p><p style="font-size: 16px;">Set halinde değişim silindirler arası farkı önler. Tork değerine dikkat edin.</p><p style="font-size: 16px;">Ateşleme: ${TEL}</p>`,
  omatbb8b: `<h2 style="font-size: 24px;">Ateşleme Bobini</h2><p style="font-size: 16px;">Bobin arızası tek silindir misfire ve titreşim yaratır. Oto Mavi BMW ateşleme bobinlerinde konektör ve izolasyon kalitesi önemlidir.</p><p style="font-size: 16px;">Buji ile birlikte kontrol edin; yağlı buji kuyusu bobini bozar.</p><p style="font-size: 16px;">WhatsApp: ${TEL}</p>`,
  omatkz8c: `<h2 style="font-size: 24px;">Kızdırma Bujisi</h2><p style="font-size: 16px;">Dizel ön ısıtmada kızdırma bujisi soğuk çalıştırmayı kolaylaştırır. Oto Mavi BMW kızdırma bujilerinde süre ve akım değerleri modele göredir.</p><p style="font-size: 16px;">Tek buji yerine set değişimi tercih edilir. Röle ve kablo da kontrol edilmeli.</p><p style="font-size: 16px;">${TEL}</p>`,
  omsyag9a: `<h2 style="font-size: 24px;">Motor Yağı</h2><p style="font-size: 16px;">BMW Longlife ve ACEA sınıfları motor tipine göre değişir. Oto Mavi spec’e uygun motor yağlarını litre seçenekleriyle sunar.</p><p style="font-size: 16px;">Yanlış viskozite yakıt ve turbo ömrünü etkiler. Kılavuzdaki onay kodunu paylaşın.</p><p style="font-size: 16px;">Yağ siparişi: ${TEL} · ${MAIL}</p>`,
  omsant9b: `<h2 style="font-size: 24px;">Antifriz</h2><p style="font-size: 16px;">Antifriz rengi ve kimyası (G11/G12/G13) karıştırılmamalıdır. Oto Mavi BMW soğutma sıvılarında konsantre ve hazır karışım bulunur.</p><p style="font-size: 16px;">Donma ve korozyon koruması için doğru oran kritiktir.</p><p style="font-size: 16px;">Bilgi: ${TEL}</p>`,
  omsfrn9c: `<h2 style="font-size: 24px;">Fren Hidroliği (Sıvı)</h2><p style="font-size: 16px;">DOT 4 ve DOT 5.1 sınıfları farklı kaynama noktalarına sahiptir. Oto Mavi yağlar kategorisinde fren sıvısı bakımı için stok tutar.</p><p style="font-size: 16px;">Açık şişeyi uzun süre saklamayın; nem alır. Değişimde sistem havası alınmalıdır.</p><p style="font-size: 16px;">${TEL}</p>`,
  ombper0a: `<h2 style="font-size: 24px;">Periyodik Bakım Seti</h2><p style="font-size: 16px;">Periyodik bakım seti yağ + filtre kombinasyonunu tek siparişte toplar. Oto Mavi BMW bakım setleri km / yıl aralığına göre paketler.</p><p style="font-size: 16px;">Model ve motor koduyla set içeriğini netleştiriyoruz; eksik parça kalmaz.</p><p style="font-size: 16px;">Set siparişi: ${TEL}</p>`,
  ombflt0b: `<h2 style="font-size: 24px;">Filtre Seti</h2><p style="font-size: 16px;">Yağ, hava ve polen filtresini bir arada alan filtre seti bakım maliyetini düşürür. Oto Mavi üçlü/dörtlü BMW filtre paketleri sunar.</p><p style="font-size: 16px;">Yakıt filtresi dahil varyantlar için stok sorun.</p><p style="font-size: 16px;">${MAIL} · ${TEL}</p>`,
  ombcnt0c: `<h2 style="font-size: 24px;">Conta Kiti</h2><p style="font-size: 16px;">Conta kiti belirli bir motor işi (kapak, emme manifoldu vb.) için gerekli contaları paketler. Oto Mavi atölye siparişlerinde set halinde teslim eder.</p><p style="font-size: 16px;">İş kapsamını yazın; eksik conta kalmasın.</p><p style="font-size: 16px;">${TEL}</p>`,
  omicps1a: `<h2 style="font-size: 24px;">Paspas Seti</h2><p style="font-size: 16px;">Model kesimli paspas seti kabin halısını korur. Oto Mavi havuzlu ve tekstil BMW paspas seçenekleri sunar.</p><p style="font-size: 16px;">Kaymaz taban ve klips uyumu kontrol edilir. Şasi / model yılı ile sipariş verin.</p><p style="font-size: 16px;">İç donanım: ${TEL}</p>`,
  omictr1b: `<h2 style="font-size: 24px;">İç Trim</h2><p style="font-size: 16px;">Kapı ve konsol trim parçaları renk ve doku koduna göre seçilir. Oto Mavi BMW iç trim stokunda çizik ve kırık onarımları için parçalar bulunur.</p><p style="font-size: 16px;">Parça numarası veya net fotoğraf ile eşleştirme yapılır.</p><p style="font-size: 16px;">${TEL} · ${MAIL}</p>`,
  omickl1c: `<h2 style="font-size: 24px;">Kol Dayama</h2><p style="font-size: 16px;">Orta konsol kol dayama konfor ve küçük eşya deposu sağlar. Oto Mavi BMW kol dayama ünitelerinde menteşe ve kilit mekanizması kontrol edilir.</p><p style="font-size: 16px;">Deri / kumaş kaplama model paketine göredir.</p><p style="font-size: 16px;">Sipariş: ${TEL}</p>`,
  omafr2a: `<h2 style="font-size: 24px;">Far</h2><p style="font-size: 16px;">Far ünitesi halojen, xenon veya LED olabilir; adaptif sistemlerde kodlama gerekir. Oto Mavi sol/sağ BMW far gövdelerini homologasyonlu seçeneklerle sunar.</p><p style="font-size: 16px;">Cam çatlağı ile iç reflektör hasarı farklıdır; fotoğraf gönderin.</p><p style="font-size: 16px;">Aydınlatma: ${TEL}</p>`,
  omastp2b: `<h2 style="font-size: 24px;">Stop Lambası</h2><p style="font-size: 16px;">Stop lambası fren ve sinyal görünürlüğünü sağlar. Oto Mavi BMW stop ünitelerinde LED kartlı ve ampullü tipler bulunur.</p><p style="font-size: 16px;">Su girişi elektronik kartı bozar; conta durumunu kontrol ettirin.</p><p style="font-size: 16px;">${TEL}</p>`,
  omasis2c: `<h2 style="font-size: 24px;">Sis Farı</h2><p style="font-size: 16px;">Sis farı alçak ışık demetiyle yağmur ve siste görüşü artırır. Oto Mavi BMW sis farı gövde ve ampul setlerini stoklar.</p><p style="font-size: 16px;">Tampon yuvası modele göre değişir; yan bilgisiyle sipariş verin.</p><p style="font-size: 16px;">WhatsApp / ${TEL}</p>`,
  omkvky3a: `<h2 style="font-size: 24px;">V Kayışı</h2><p style="font-size: 16px;">V / kanallı kayış alternatör ve klima tahriğini taşır. Oto Mavi BMW kayışlarında nervür sayısı ve uzunluk kritiktir.</p><p style="font-size: 16px;">Çatlak veya ses varsa gergi ile birlikte değerlendirin.</p><p style="font-size: 16px;">Kayış: ${TEL}</p>`,
  omktrg3b: `<h2 style="font-size: 24px;">Triger Seti</h2><p style="font-size: 16px;">Triger seti zamanlama kayışı/zinciri ile gergi ve rulmanları kapsar. Oto Mavi BMW triger setlerinde km aralığına göre değişim önerilir.</p><p style="font-size: 16px;">Yalnız kayış almak risklidir; set halinde alın. Motor kodunu yazın.</p><p style="font-size: 16px;">${TEL} · ${MAIL}</p>`,
  omkgrg3c: `<h2 style="font-size: 24px;">Gergi</h2><p style="font-size: 16px;">Kayış gergisi doğru gerilimi korur; arızalı gergi kayışın atlamasına yol açar. Oto Mavi otomatik ve mekanik BMW gergi üniteleri sunar.</p><p style="font-size: 16px;">Kayış değişiminde gergiyi de yenilemek yaygındır.</p><p style="font-size: 16px;">Sipariş: ${TEL}</p>`,
  omslst4a: `<h2 style="font-size: 24px;">Silecek Lastiği</h2><p style="font-size: 16px;">Silecek lastiği cm cinsinden modele özeldir; yanlış uzunluk cam kenarını süpürmez. Oto Mavi BMW silecek lastiklerinde sessiz kauçuk tercih edilir.</p><p style="font-size: 16px;">Mevsim geçişinde lastik yenilemek görüşü netleştirir.</p><p style="font-size: 16px;">${TEL}</p>`,
  omslkl4b: `<h2 style="font-size: 24px;">Silecek Kolu</h2><p style="font-size: 16px;">Silecek kolu menteşe ve yay gerilimiyle lastiği cama bastırır. Oto Mavi ön/arka BMW silecek kollarında bağlantı tipi modele göredir.</p><p style="font-size: 16px;">Kırık kol lastiği doğru açıda tutamaz; sol/sağ belirtin.</p><p style="font-size: 16px;">${MAIL} · ${TEL}</p>`,
  omslfs4c: `<h2 style="font-size: 24px;">Fıskiye Pompası</h2><p style="font-size: 16px;">Fıskiye pompası cam yıkama suyunu püskürtür; tek veya çift çıkışlı olabilir. Oto Mavi BMW yıkama pompalarında elektrik konektörü uyumu kontrol edilir.</p><p style="font-size: 16px;">Depo süzgeci tıkanıklığı pompayı zorlar; birlikte kontrol edin.</p><p style="font-size: 16px;">Sipariş (sepet yok): ${TEL} · WhatsApp</p>`,
};

function pngToWebp(pngPath, webpPath) {
  const helper = path.join(__dirname, "_png2webp.js");
  fs.writeFileSync(
    helper,
    `const sharp=require("D:/matrix/node_modules/sharp");\nsharp(process.argv[2]).webp({quality:82}).toFile(process.argv[3]).then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});\n`
  );
  try {
    execFileSync(process.execPath, [helper, pngPath, webpPath], { stdio: "pipe" });
    try { fs.unlinkSync(helper); } catch (_) {}
    return fs.existsSync(webpPath) && fs.statSync(webpPath).size > 0;
  } catch (e) {
    try { fs.unlinkSync(helper); } catch (_) {}
    console.warn("webp fail", e.message);
    return false;
  }
}

function genOne(id, nameEn) {
  const dir = path.join(PAGE, id);
  const png = path.join(dir, "_tmp.png");
  const webp = path.join(dir, "index.webp");
  const prompt = `professional automotive spare part catalog photo of ${nameEn}, BMW quality spare part, clean studio softbox lighting, cool blue-gray seamless background, realistic metal plastic rubber texture, single centered object, product photography, no text, no typography, no letters, no words, no logo, no watermark, no caption, no signage`;
  try {
    execFileSync(
      "node",
      ["D:/matrix/public/comfyui/scripts/run.js", "generate", "--workflow", "z_image_turbo", "--prompt", prompt, "--out", png, "--width", "1024", "--height", "1024", "--steps", "8"],
      { stdio: "inherit", timeout: 180000 }
    );
    if (pngToWebp(png, webp)) {
      try { fs.unlinkSync(png); } catch (_) {}
      return true;
    }
  } catch (e) {
    console.warn("[gen fail]", id, e.message);
  }
  try { if (fs.existsSync(png)) fs.unlinkSync(png); } catch (_) {}
  return false;
}

const UNIQUE = [
  ["omfykt1a", "fuel filter cartridge"],
  ["omfdsk2a", "brake disc rotor"],
  ["omgtmp3a", "car bumper body panel"],
  ["ommcta4a", "engine gasket set"],
  ["omeaku5a", "car battery AGM"],
  ["omsamr6a", "shock absorber damper"],
  ["omkkmp7a", "air conditioning compressor"],
  ["omatbj8a", "spark plug ignition"],
  ["omsyag9a", "motor oil bottle no label blank"],
  ["ombper0a", "car maintenance filter kit box"],
  ["omicps1a", "car floor mat set"],
  ["omafr2a", "car headlight assembly"],
  ["omkvky3a", "serpentine drive belt"],
  ["omslst4a", "windshield wiper blade"],
];

let textOk = 0;
for (const [id, html] of Object.entries(TEXTS)) {
  const f = path.join(PAGE, id, "index.json");
  if (!fs.existsSync(f)) {
    console.warn("missing", id);
    continue;
  }
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  j.text = { tr: html };
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
  textOk++;
}
console.log("[ok] text güncellendi:", textOk);

const doGen = process.env.SKIP_COMFY !== "1";
let genOk = 0;
if (doGen) {
  for (const [id, en] of UNIQUE) {
    console.log("[gen]", id, en);
    if (genOne(id, en)) {
      genOk++;
      console.log("[ok gen]", id);
    }
  }
}
console.log("[done] genOk=", genOk);
