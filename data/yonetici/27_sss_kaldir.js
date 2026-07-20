var fs = require("fs");
var path = require("path");

function read(p) {
  var r = fs.readFileSync(p, "utf8");
  if (r.charCodeAt(0) === 0xfeff) r = r.slice(1);
  return JSON.parse(r);
}

function write(p, o) {
  fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n", "utf8");
}

var root = "D:/projeler/otomavi/Web/matrix";


var pagePath = path.join(root, "page.json");
var page = read(pagePath);
var before = page.data.length;
page.data = page.data.filter(function (row) {
  if (!row) return false;
  if (row.id === "1ol7p3rfpv") return false;
  if (row.pathnext === "sss") return false;
  var n = row.name && (row.name.tr || row.name);
  if (n === "SSS" || n === "Sıkça Sorulan Sorular") return false;
  return true;
});

for (var i = 0; i < page.data.length; i++) {
  var row = page.data[i];
  if (row.id === "yvi9dlb59o") {
    if (row.description && row.description.tr) {
      row.description.tr =
        "Oto Mavi kurumsal sayfaları: hakkımızda, misyon, vizyon, kalite, kariyer ve yasal metinler. Gaziantep BMW oto yedek parçaları.";
    }
    if (row.text && row.text.tr) {
      row.text.tr =
        "<p style=\"font-size: 16px;\">Oto Mavi — Gaziantep BMW oto yedek parçaları. Kurumsal bilgiler, kariyer ve politikalar için alt sayfalarımızı inceleyebilirsiniz.</p>";
    }
  }
}
write(pagePath, page);
console.log("page.json:", before, "->", page.data.length);


var kurPath = path.join(root, "kurumsal.json");
var kur = read(kurPath);
var kb = kur.data.length;
kur.data = kur.data.filter(function (row) {
  if (!row) return false;
  if (row.id === "sss" || row.path === "sss") return false;
  var n = row.name && (row.name.tr || row.name);
  if (n === "Sıkça Sorulan Sorular" || n === "SSS") return false;
  return true;
});

for (var k = 0; k < kur.data.length; k++) {
  kur.data[k].index = k;
}
write(kurPath, kur);
console.log("kurumsal.json:", kb, "->", kur.data.length);


function stopPage(id) {
  var pp = path.join(root, "page", id, "index.json");
  if (!fs.existsSync(pp)) {
    console.log("skip missing", id);
    return;
  }
  var pj = read(pp);
  pj.status = "stop";
  write(pp, pj);
  console.log("stopped", id);
}
stopPage("sss");
stopPage("1ol7p3rfpv");


var modPath = path.join(root, "modules.json");
var mods = read(modPath);
var removed = 0;
for (var m = 0; m < mods.data.length; m++) {
  var mod = mods.data[m];
  if (mod.id !== "txt39m" || !mod.data || !mod.data.corporate_links) continue;
  var links = mod.data.corporate_links;
  var nl = [];
  for (var L = 0; L < links.length; L++) {
    var link = links[L];
    var url = String(link.url || "");
    var ln = link.name && (link.name.tr || link.name);
    if (url.indexOf("/sss") >= 0 || ln === "SSS" || ln === "Sıkça Sorulan Sorular") {
      removed++;
      continue;
    }
    nl.push(link);
  }
  mod.data.corporate_links = nl;
}
write(modPath, mods);
console.log("footer SSS links removed:", removed);


var crPath = path.join(root, ".cursorrules");
var cr = fs.readFileSync(crPath, "utf8");
cr = cr.replace(
  /- Kurumsal: `sss` \+ `kariyer` \(`kurumsal\.json`\); menü: Anasayfa\(@home\) · Ürünler · Hakkımızda · İletişim · SSS/,
  "- Kurumsal: `kariyer` + yasal sayfalar (`kurumsal.json`); menü: Anasayfa(@home) · Ürünler · Hakkımızda · İletişim — **SSS / Sıkça Sorulan Sorular YOK** (Paket 27)"
);
if (cr.indexOf("SSS / FAQ yasak") < 0 && cr.indexOf("Sıkça Sorulan Sorular YOK") < 0) {
  
}
if (cr.indexOf("Paket 27") < 0) {
  cr +=
    "\n\n## SSS / FAQ (Paket 27 — KATI)\n- Oto Mavi’de **SSS / Sıkça Sorulan Sorular / FAQ sayfası ve menü maddesi YASAK**\n- `page.json` üst menüye SSS ekleme; `kurumsal.json` altına Sıkça Sorulan Sorular ekleme; footer `corporate_links` içine `/sss` koyma\n- Sorular WhatsApp / telefon ile karşılanır — ayrı SSS içeriği üretilmez\n- Bu kuralı bilerek bozma; ihtiyaç doğarsa kullanıcı açıkça ister\n";
}
fs.writeFileSync(crPath, cr, "utf8");
console.log("cursorrules updated");

console.log("DONE");
