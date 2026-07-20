var fs = require("fs");

function read(p) {
  var r = fs.readFileSync(p, "utf8");
  if (r.charCodeAt(0) === 0xfeff) r = r.slice(1);
  return JSON.parse(r);
}

function write(p, o) {
  fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n", "utf8");
}

var modPath = "D:/projeler/otomavi/Web/matrix/modules.json";
var mods = read(modPath);
var n = 0;
var i;
for (i = 0; i < mods.data.length; i++) {
  var m = mods.data[i];
  if (!m.desing) continue;
  if (m.id === "t1af01") {
    m.desing.btncolor = "#ffffff";
    m.desing.btnbg = "#02427A";
    m.desing.btnhover = "#0B3A6E";
    m.desing.waBtnBg = "#25D366";
    m.desing.waBtnColor = "#ffffff";
    n++;
  }
  if (m.id === "t1ct01") {
    
    m.desing.btnbg = "#FFFFFF";
    m.desing.btncolor = "#0B3A6E";
    n++;
  }
  if (m.id === "t1udo01" || m.id === "t1ulo01") {
    m.desing.waBtnBg = "#25D366";
    n++;
  }
}
write(modPath, mods);
console.log("modules contrast tokens:", n);

var cursors = "D:/projeler/otomavi/Web/matrix/.cursorrules";
var cr = fs.readFileSync(cursors, "utf8");
if (cr.indexOf("kontrast") < 0 && cr.indexOf("waBtnColor") < 0) {
  cr +=
    "\n\n## UI kontrast (Paket 26)\n- Koyu zemin (#0B3A6E / #02427A) üzerine koyu yazı **yasak**\n- WhatsApp butonları: `waBtnBg=#25D366` + `waBtnColor/#ffffff` (veya buton/span’larda açıkça beyaz)\n- Sonuç paneli `resultcolor` (lacivert) WA/CTA butonuna miras vermemeli — çocuk `span`/ikon rengi ayrı set edilir\n";
  fs.writeFileSync(cursors, cr, "utf8");
  console.log("cursorrules contrast note added");
}

var mantik = "D:/matrix/webmodules/mantik/mantik.md";
var md = fs.readFileSync(mantik, "utf8");
if (md.indexOf("Paket 26") < 0) {
  md +=
    "\n\n**Kontrast (2026-07-20, Paket 26):** `arac-parca-arama(-otomavi)` boş sonuç WA butonu lacivert zemin + lacivert miras yazı sorununu giderir — `waBtnBg=#25D366` + `waBtnColor=#ffffff`; buton çocuklarına açık renk. Aynı kural liste/detay/CTA/page-desing WA butonlarında.\n";
  fs.writeFileSync(mantik, md, "utf8");
  console.log("mantik updated");
}
