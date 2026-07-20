
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PRODUCTS = path.join(ROOT, 'products.json');
const PAGE_DIR = path.join(ROOT, 'page');


function kelimeKumesi(s) {
  const lowered = String(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
  return new Set(lowered.split(/\s+/).filter(Boolean));
}

function jaccardYuzde(a, b) {
  const A = kelimeKumesi(a);
  const B = kelimeKumesi(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  A.forEach((w) => {
    if (B.has(w)) inter++;
  });
  const union = A.size + B.size - inter;
  return union > 0 ? Math.round((100 * inter) / union) : 0;
}


const SEO = {
  
  omfltr01: {
    desc:
      'Yakıt süzgeci, emiş paneli, yağ kartuşu ve kabin elemanını aynı reyon altında toplayın; Gaziantep deposunda filtre kodları şasiye göre ayrılır.',
    kw: 'filtre reyonu kataloğu, emiş yakıt süzgeç listesi, kabin elemanı grubu, bakım süzgeç reyonu, filtre kod eşlemesi'
  },
  omfren02: {
    desc:
      'Durma mesafesini kısaltan rotor, pad ve hidrolik hat parçaları burada; pedal hissi ve ABS uyumu için doğru fren kodunu birlikte seçin.',
    kw: 'durma sistemi reyonu, rotor pad hidrolik, pedal güvenlik parçası, ABS hat ekipmanı, fren kod seçimi'
  },
  omgvde03: {
    desc:
      'Çarpışma sonrası tampon kapağı, ayna gövdesi ve sac panel onarımında kontur uyumu kritik; boyasız gövde stoku şasi ölçüsüyle doğrulanır.',
    kw: 'kaporta onarım reyonu, tampon ayna sac, boyasız gövde stoku, kontur uyum paneli, çarpışma onarım parçası'
  },
  ommotr04: {
    desc:
      'Sızdırmazlık conta grubu, soğutma elemanı ve algılayıcı sensörlerle motor sağlığını toparlayın; hararet ve kaçak şikayetlerinde teknik parça reyonu.',
    kw: 'motor teknik reyonu, conta soğutma algılayıcı, kaçak önleme parçası, hararet teknik seti, ECU sinyal elemanı'
  },
  omelek05: {
    desc:
      'Start-stop batarya, şarj ünitesi ve çalıştırma motoru voltaj sürekliliği sağlar; kutup ve amper etiketine göre elektrik reyonundan seçin.',
    kw: 'elektrik reyonu batarya, şarj ünitesi marş, voltaj süreklilik parçası, kutup amper seçimi, start devresi ekipmanı'
  },
  omsusp06: {
    desc:
      'Damper gövdesi, helezon teli ve pivot burcu ile yol tutuşu toparlanır; vuruntu ve çökme şikayetinde sönümleme reyonu doğru sertliği verir.',
    kw: 'sönümleme reyonu damper, helezon pivot burç, yol tutuş kiti, vuruntu azaltma parçası, oturma yüksekliği seti'
  },
  omklma07: {
    desc:
      'Gaz sıkıştırma ünitesi, ısı atım çekirdeği ve nem tutucu ile kabin soğutması yenilenir; R134a hattına göre klima çevrim reyonu kurulur.',
    kw: 'klima çevrim reyonu, gaz sıkıştırma ünitesi, ısı atım çekirdeği, nem tutucu drier, R134a hat ekipmanı'
  },
  omatsg08: {
    desc:
      'Kıvılcım ucu, yüksek voltaj bobini ve dizel ısıtıcı soğuk çalıştırmayı düzeltir; misfire ve glow arızasında ateşleme reyonundan ilerleyin.',
    kw: 'ateşleme reyonu kıvılcım, yüksek voltaj bobin, dizel glow ısıtıcı, misfire çözüm parçası, soğuk start seti'
  },
  omsivi09: {
    desc:
      'Longlife yağ, alüminyum korumalı soğutucu ve yüksek kaynama fren sıvısı litre litre ayrılır; onay kodu ve DOT sınıfı etiketle netleşir.',
    kw: 'yağ sıvı reyonu, longlife litre yağ, alüminyum soğutucu sıvı, DOT kaynama sıvısı, onay kodu etiket'
  },
  ombkim10: {
    desc:
      'Kilometre servisinde yağ+süzgeç paketi veya conta tadilat kiti tek siparişte toplanır; şasi listesine göre bakım kiti reyonu hazırlanır.',
    kw: 'bakım kiti reyonu, kilometre servis paketi, süzgeç yağ kutusu, conta tadilat kiti, şasi servis listesi'
  },
  omicdn11: {
    desc:
      'Kabin zemin örtüsü, kapı kaplama çerçevesi ve konsol dayaması konforu yeniler; renk kodlu iç mekân parçaları klips tipine göre seçilir.',
    kw: 'iç mekân reyonu, zemin örtü paspas, kapı kaplama çerçevesi, konsol dayama ünitesi, renk kodlu trim'
  },
  omaydn12: {
    desc:
      'Projektör far, LED stop ve tampon sis ünitesi gece görüşünü güçlendirir; sol/sağ optik kodları lamba reyonunda ayrı tutulur.',
    kw: 'lamba reyonu optik, projektör far ünitesi, LED stop lambası, tampon sis ünitesi, sol sağ optik kod'
  },
  omkysi13: {
    desc:
      'Aksesuar poly-V, eksantrik zamanlama kiti ve otomatik tensioner tahrik hattını korur; çatlak sesinde kayış reyonundan ölçü alın.',
    kw: 'tahrik reyonu kayış, poly-V aksesuar, eksantrik zamanlama kiti, otomatik tensioner, oluk boy ölçümü'
  },
  omslck14: {
    desc:
      'Cam süpürme lastiği, metal kol ve yıkama pompası görüşü netleştirir; beam tipi ve hortum çapı silecek reyonunda eşleşir.',
    kw: 'silecek reyonu lastik, metal wiper kol, yıkama pompası, beam tip lastik, hortum çap eşlemesi'
  },

  
  omfykt1a: {
    desc:
      'Yüksek basınç hattını koruyan yakıt süzgeci enjektör tıkanmasını azaltır; şasi numarasıyla OEM veya eşdeğer kod Oto Mavi deposunda seçilir.',
    kw: 'yakıt süzgeci OEM, enjektör koruma elemanı, yüksek basınç hat filtresi, dizel fuel filter, E90 yakıt süzgeci'
  },
  omfhva1b: {
    desc:
      'Emiş kutusundaki panel hava elemanı toz partikülünü tutarak yanmayı dengeler; N serisi motorlarda kuru tip süzgeç stokta ayrılır.',
    kw: 'panel emiş elemanı, kuru tip hava süzgeci, motor intake filter, N47 hava elemanı, emiş kutusu paneli'
  },
  omfyag1c: {
    desc:
      'Karter dolaşımındaki metal talaşı tutan yağ kartuşu yağ değişiminde yenilenir; vida ve conta tipine göre spin-on veya kartuş ayrılır.',
    kw: 'yağ kartuşu süzgeci, spin-on oil filter, karter talaş tutucu, LL01 yağ elemanı, vida conta tipi filtre'
  },
  omfpln1d: {
    desc:
      'Menfezden gelen tozu kesen aktif karbonlu kabin filtresi alerjen ve egzoz kokusunu azaltır; pollen cabin elemanı stokta bulunur.',
    kw: 'aktif karbon kabin, pollen cabin elemanı, menfez hava filtresi, alerjen kesici filtre, iç hava kabin süzgeci'
  },

  
  omfdsk2a: {
    desc:
      'Isıyı dağıtan havalandırmalı fren rotorunda kalınlık ve run-out ölçümü şarttır; ön/arka disk delik deseni şasiye göre ayrılır.',
    kw: 'havalandırmalı fren rotoru, disk kalınlık ölçümü, run-out brake disc, ön arka rotor, OEM disk delik deseni'
  },
  omfblt2b: {
    desc:
      'Sessiz sürtünmeli seramik pad seti aşınma kablolu veya kablosuz gelir; aks tarafına göre paketlenir, rotor yüzeyiyle birlikte değerlendirilir.',
    kw: 'seramik pad seti, aşınma kablolu balata, pedal hissi pad, brake pad kit F30, aks tarafı balata'
  },
  omfhyd2c: {
    desc:
      'Ana merkez silindirinden kalipere basınç taşıyan hidrolik hat parçası DOT sınıfı hortum ve rezervuar uyumuyla doğrulanır.',
    kw: 'ana merkez silindiri, kaliper basınç hortumu, ABS valf bağlantısı, DOT4 hat ekipmanı, hidrolik rezervuar parçası'
  },

  
  omgtmp3a: {
    desc:
      'Park sensörü ve sis yuvası delikli tampon kapağı darbede ezilir; boyasız veya astarlı bumper cover modele özel konturla gelir.',
    kw: 'park sensörlü tampon, sis yuvası bumper, boyasız tampon kapağı, ön arka bumper cover, astarlı tampon gövdesi'
  },
  omgayn3b: {
    desc:
      'Katlanır motorlu ısıtmalı yan ayna ünitesinde cam, gövde ve sinyalli kapak ayrı satılabilir; sol/sağ ayna kodu net ayrılır.',
    kw: 'katlanır ayna ünitesi, ısıtmalı ayna camı, sinyalli ayna kapağı, mirror assembly sol, elektrikli ayna motoru'
  },
  omgpnl3c: {
    desc:
      'Çamurluk ve kapı dışı sac panelde kaynak flanşı şasiye özgüdür; orijinal konturlu fender panel vida noktasıyla hizalanır.',
    kw: 'çamurluk fender panel, kapı dışı sac, kaynak flanşlı panel, kontur uyumlu sac, vida noktalı kaporta'
  },

  
  ommcta4a: {
    desc:
      'Üst kapak ve manifold sızdırmazlığını sağlayan gasket seti yağ kaçaklarını keser; silindir kapağı ile karter contası ayrı kitlenir.',
    kw: 'silindir kapağı gasket, manifold conta seti, karter yağ seal, üst kapak sızdırmazlık, yağ kaçak gasket'
  },
  ommsgt4b: {
    desc:
      'Termostat gövdesi, radyatör hortumu ve soğutma ağzı harareti düşürür; debimetre uyumlu cooling part Oto Mavi stokundan seçilir.',
    kw: 'termostat gövdesi hortum, radyatör soğutma ağzı, cooling system part, hararet düşürücü eleman, debimetre uyumlu soğutma'
  },
  ommsns4c: {
    desc:
      'Lambda, krank pozisyon ve ECT algılayıcı OBD kodunda pin sayısına göre eşleşir; konnektör şekilli sensör stokta ayrılır.',
    kw: 'lambda oksijen algılayıcı, krank pozisyon sensörü, ECT sıcaklık sensörü, OBD pin sayılı, konnektör şekilli sensör'
  },

  
  omeaku5a: {
    desc:
      'AGM veya EFB tip start-stop bataryada soğuk crank amperi ve kutup yerleşimi ah etiketine göre seçilir; kutup polaritesi kontrol edilir.',
    kw: 'AGM start-stop batarya, EFB ah etiket, soğuk crank CCA, kutup yerleşimli akü, polarite kontrollü batarya'
  },
  omealt5b: {
    desc:
      'Şarj voltajını sabitleyen alternatörde kasnak oluğu ve regülatör tipi modele göredir; reman veya yeni ampere rating ayrılır.',
    kw: 'şarj alternatör kasnak, regülatör tipi ünitesi, ampere rating reman, voltaj sabitleyici, oluklu kasnak alternatör'
  },
  omemrs5c: {
    desc:
      'Volana diş geçen marş ünitesinde bendix ve solenoid kW gücüne göre değişir; yavaş çevirme şikayetinde starter motor seçilir.',
    kw: 'marş bendix solenoid, starter motor kW, volan dişli marş, yavaş çevirme starter, solenoid bobin ünitesi'
  },

  
  omsamr6a: {
    desc:
      'Yağlı veya gazlı MacPherson damper gövdesi ön/arka aks tipine göre ayrılır; kaçak varsa çift değişim önerilir, sürüş yüksekliği korunur.',
    kw: 'MacPherson damper gövdesi, gazlı shock absorber, ön arka aks damper, kaçak çift değişim, sürüş yüksekliği shock'
  },
  omsyay6b: {
    desc:
      'Oturma yüksekliğini belirleyen helezon telinde kırık tur ve çökme kontrol edilir; sol/sağ coil spring sertlik koduyla seçilir.',
    kw: 'helezon tel yayı, coil spring sertlik, kırık tur yay, oturma yüksekliği coil, sol sağ yay kodu'
  },
  omsbrc6c: {
    desc:
      'Salıncak pivotundaki kauçuk burç vuruntu ve lastik aşınmasını azaltır; hidrolik veya katı control arm bush seçenekleri vardır.',
    kw: 'salıncak pivot burcu, control arm bush, hidrolik kauçuk burç, sessiz pivot yatak, lastik aşınma burcu'
  },

  
  omkkmp7a: {
    desc:
      'Soğutucu gazı sıkan kompresör debriyajlı veya debriyajsız gelir; R134a hattı ve kasnak oluğuna göre A/C compressor seçilir.',
    kw: 'debriyajlı klima kompresör, R134a A/C compressor, kasnak oluk kompresör, gaz sıkıştırma ünitesi, debriyajsız compressor'
  },
  omkknd7b: {
    desc:
      'Ön panelde ısı atan alüminyum kondanser çekirdeği taş çarpmasında delinir; kurutucuyla birlikte condenser core değişimi önerilir.',
    kw: 'alüminyum kondanser çekirdek, ön panel heat exchanger, A/C condenser core, taş delik kondanser, ısı atım çekirdeği'
  },
  omkkrt7c: {
    desc:
      'Sistem nemini tutan receiver-drier kompresör değişiminde mutlaka yenilenir; o-ring setli desiccant bag ile birlikte teslim edilir.',
    kw: 'receiver drier nem, desiccant bag kurutucu, klima o-ring seti, A/C accumulator drier, nem tutucu filtre'
  },

  
  omatbj8a: {
    desc:
      'Iridyum veya platin kıvılcım ucu rölanti titremesini keser; ısı değeri ve diş boyu katalogdan spark plug koduyla seçilir.',
    kw: 'iridyum kıvılcım ucu, platin spark plug, ısı değeri buji, diş boyu plug, rölanti titreme buji'
  },
  omatbb8b: {
    desc:
      'Silindir başına yüksek voltaj üreten coil pack misfire kodunda konnektör şekline göre eşleşir; ignition coil stokta ayrılır.',
    kw: 'silindir coil pack, misfire ignition coil, yüksek voltaj bobin, konnektör şekilli coil, ateşleme bobin OEM'
  },
  omatkz8c: {
    desc:
      'Dizel yanma odasını ısıtan glow plug soğuk sabah çalıştırmayı kolaylaştırır; voltaj ve ısınma süresi motor koduna göredir.',
    kw: 'dizel glow plug, kızdırma voltaj ucu, soğuk start ısıtıcı, yanma odası glow, ısınma süre kodu'
  },

  
  omsyag9a: {
    desc:
      'Longlife onaylı sentetik 5W-30 / 5W-40 litre litre satılır; yağ onay kodu etiketle netleşir, süzgeçle birlikte önerilir.',
    kw: 'Longlife 5W30 yağ, sentetik 5W40 litre, BMW LL onay kodu, viskozite etiket yağ, süzgeçle yağ paketi'
  },
  omsant9b: {
    desc:
      'Alüminyum radyatore uyumlu G12/G13 konsantre soğutucu korozyonu önler; renk ve karışım oranı antifreeze şişesinde yazar.',
    kw: 'G12 konsantre soğutucu, G13 alüminyum antifreeze, karışım oranı antifriz, renk kodlu soğutucu, korozyon önleyici sıvı'
  },
  omsfrn9c: {
    desc:
      'Yüksek kaynama noktalı DOT4 / DOT5.1 brake fluid periyodik flush ile nemden arındırılır; litre şişe yağlar reyonundadır.',
    kw: 'DOT4 brake fluid, DOT5.1 kaynama sıvısı, fren flush litre, nem arındırma sıvısı, hidrolik yağ şişesi'
  },

  
  ombper0a: {
    desc:
      'Servis kilometresine göre yağ ve seçili süzgeçleri tek kutuda toplayan inspection package şasi listesiyle hazırlanıp sunulur.',
    kw: 'inspection package kutu, kilometre servis seti, yağ süzgeç bakımı, şasi servis listesi, periyodik kutu paketi'
  },
  ombflt0b: {
    desc:
      'Yağ kartuşu, emiş paneli ve kabin elemanını bir arada sunan filter service kit yağsız sadece süzgeç değişiminde kullanılır.',
    kw: 'filter service kit, üçlü süzgeç paketi, yağ hava kabin seti, yağsız filtre grubu, süzgeç paket kodu'
  },
  ombcnt0c: {
    desc:
      'Üst kapak ve yağ yuvası gasket grubunu içeren valve cover kit sızıntı tadilatında cıvata setiyle birlikte eksiksiz tamamlanır.',
    kw: 'valve cover kit, yağ yuvası gasket, sızıntı tadilat contası, cıvatalı conta seti, üst kapak gasket kit'
  },

  
  omicps1a: {
    desc:
      'Kauçuk veya halı floor mat seti tünel ve pedalı örter; 4 parça zemin + bagaj örtüsü ayrı satılır, klips delikleri modele göredir.',
    kw: 'kauçuk floor mat, halı paspas seti, 4 parça zemin örtü, bagaj örtü paspas, tünel pedal mat'
  },
  omictr1b: {
    desc:
      'Kapı ve gösterge çevresi interior trim clip kırılınca renk kodlu panel ve çerçeve gerekir; klips tipi stokta ayrı tutulur.',
    kw: 'interior trim clip, kapı kaplama paneli, gösterge çerçeve trim, renk kodlu iç panel, klips tipi trim'
  },
  omickl1c: {
    desc:
      'Orta konsolda depolama sunan armrest storage unit menteşe ve kapak derisiyle gelir; konsol tipine göre stoktan seçim yapılır.',
    kw: 'armrest storage unit, orta konsol dayama, menteşeli dayama kapağı, deri konsol armrest, depolamalı kol dayama'
  },

  
  omafr2a: {
    desc:
      'Projektör veya LED matris headlight ünitesinde mercek ve Xenon balast sol/sağ koda göre ayrılır; çizik camda komple değişim gerekir.',
    kw: 'LED matris headlight, projektör far ünitesi, Xenon balast far, sol sağ far kodu, mercekli headlight'
  },
  omastp2b: {
    desc:
      'Fren ve sinyal LED’li tail light bagaj kapağı veya çamurluk tipinde gelir; su girişi olan stop ünitesinde conta yenilenir.',
    kw: 'LED tail light, bagaj kapağı stop, çamurluk stop lambası, fren sinyal LED, conta yenilemeli stop'
  },
  omasis2c: {
    desc:
      'Düşük görüşte yolu aydınlatan fog lamp tampon yuvasına oturur; yuvarlak veya köşeli tip ampul soketiyle birlikte teslim edilir.',
    kw: 'tampon fog lamp, düşük görüş sis, yuvarlak sis ünitesi, ampul soketli fog, köşeli sis farı'
  },

  
  omkvky3a: {
    desc:
      'Alternatör ve klima kasnağını döndüren poly-V drive belt çatlak sesinde oluk sayısı ile boy ölçüsü alınarak doğru seçilir.',
    kw: 'poly-V drive belt, oluk sayılı aksesuar kayış, alternatör kasnak belt, klima drive kayış, kayış boy ölçümü'
  },
  omktrg3b: {
    desc:
      'Eksantrik zamanlamasını koruyan timing belt/chain set gergi ve makarayla kit halinde sunulur; atlama riskinde komple değişir.',
    kw: 'timing belt set, zincir zamanlama kiti, eksantrik timing kit, gergi makaralı triger, atlama önleme seti'
  },
  omkgrg3c: {
    desc:
      'Kayış gerginliğini ayarlayan tensioner bearing rulman sesinde kayışla aynı anda değişir; idler pulley ayrıca satılabilir.',
    kw: 'tensioner bearing gergi, rulmanlı otomatik gergi, idler pulley makara, kayış gergi rulmanı, sesli tensioner'
  },

  
  omslst4a: {
    desc:
      'Camı çizmeden süpüren beam wiper blade sürücü ve yolcu uzunluğuna göre çift satılır; rubber uç tipi stokta ayrı tutulur.',
    kw: 'beam wiper blade, çizmesiz rubber uç, sürücü yolcu lastik, wiper blade pair, cam süpürme lastiği'
  },
  omslkl4b: {
    desc:
      'Lastiği taşıyan metal wiper arm yay zayıflayınca ön veya arka somun ölçüsüne göre değişir; zayıf baskı camda iz bırakır.',
    kw: 'metal wiper arm, yaylı silecek kolu, ön arka arm, somun ölçülü kol, zayıf yay wiper'
  },
  omslfs4c: {
    desc:
      'Depodaki suyu memelere basan washer pump tek veya çift çıkışlıdır; hortum çapına göre meme besleme motoru stoktan seçilir.',
    kw: 'washer pump dual, cam yıkama motoru, fıskiye su pompası, hortum çaplı pump, meme besleme motoru'
  }
};

function assertLengths() {
  const bad = [];
  for (const [id, v] of Object.entries(SEO)) {
    
    const L = v.desc.length;
    if (L < 120 || L > 160) bad.push(`${id} desc=${L}`);
    if (v.kw.length > 160) bad.push(`${id} kw=${v.kw.length}`);
  }
  if (bad.length) {
    console.error('UZUNLUK HATALARI:', bad);
    process.exit(1);
  }
}

function assertJaccard() {
  const ids = Object.keys(SEO);
  const kwHigh = [];
  const descHigh = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const jk = jaccardYuzde(SEO[ids[i]].kw, SEO[ids[j]].kw);
      const jd = jaccardYuzde(SEO[ids[i]].desc, SEO[ids[j]].desc);
      if (jk >= 65) kwHigh.push(`${jk}% ${ids[i]}~${ids[j]}`);
      if (jd >= 65) descHigh.push(`${jd}% ${ids[i]}~${ids[j]}`);
    }
  }
  if (kwHigh.length || descHigh.length) {
    console.error('JACCARD >=65 kw:', kwHigh);
    console.error('JACCARD >=65 desc:', descHigh);
    process.exit(1);
  }
  console.log('Ön-kontrol OK: uzunluk + iç Jaccard <65 (' + ids.length + ' kayıt)');
}

function apply() {
  assertLengths();
  assertJaccard();

  const products = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8'));
  let prodUpdated = 0;
  let pageUpdated = 0;
  const missing = [];

  for (const row of products.data) {
    const seo = SEO[row.id];
    if (!seo) continue;
    if (!row.description) row.description = {};
    row.description.tr = seo.desc;
    prodUpdated++;

    const pagePath = path.join(PAGE_DIR, row.id, 'index.json');
    if (!fs.existsSync(pagePath)) {
      missing.push(row.id);
      continue;
    }
    const page = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
    if (!page.description) page.description = {};
    page.description.tr = seo.desc;
    if (!page.keyword) page.keyword = {};
    page.keyword.tr = seo.kw;
    
    if (!page.title) page.title = {};
    if (page.name && page.name.tr) {
      page.title.tr = page.name.tr + ' | Oto Mavi';
    }
    fs.writeFileSync(pagePath, JSON.stringify(page, null, 2) + '\n', 'utf8');
    pageUpdated++;
  }

  fs.writeFileSync(PRODUCTS, JSON.stringify(products, null, 2) + '\n', 'utf8');
  console.log('products.json satır güncellendi:', prodUpdated);
  console.log('page/*/index.json güncellendi:', pageUpdated);
  if (missing.length) console.warn('page eksik:', missing);
}

apply();
