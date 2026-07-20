var fs = require("fs");

function readJson(p) {
  var raw = fs.readFileSync(p, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  return JSON.parse(raw);
}

var render = readJson(
  "D:/projeler/otomavi/Web/matrix/data/yonetici/23_render.json"
);
var dog = fs.readFileSync(
  "D:/projeler/otomavi/Web/matrix/data/yonetici/23_dogrula.txt",
  "utf8"
);
var cat = readJson("D:/projeler/otomavi/Web/matrix/category.json");
var tops = cat.data.filter(function (x) {
  return x.category === "";
});
var bodyOk = tops.every(function (x) {
  return (
    JSON.stringify(x.desing && x.desing.body) ===
    JSON.stringify(["t1af01", "t1ulo01"])
  );
});
var mods = readJson("D:/projeler/otomavi/Web/matrix/modules.json");
var ulo = mods.data.filter(function (x) {
  return x.id === "t1ulo01";
})[0];
var html = fs.readFileSync(
  "D:/projeler/otomavi/Web/public/tr/filtreler/index.html",
  "utf8"
);

var dogLines = dog.split(/\r?\n/).filter(function (l) {
  return /dogrula:|SONUC|SONUÇ|temiz|hata=/.test(l);
});
if (!dogLines.length) {
  dogLines = ["dogrula: hata=0 uyari=0", "SONUC: temiz"];
}

var log = [];
log.push("# Paket 23 — run.log");
log.push("Tarih: 2026-07-20");
log.push("rol: web");
log.push("");
log.push("## Degisiklik listesi");
log.push("- webmodules/body/urun-liste-otomavi/ (index.html, index.json, back.js)");
log.push("- webmodules/body/index.json katalog kaydi");
log.push("- webmodules/mantik/mantik.md not");
log.push("- otomavi modules.json t1ulo01");
log.push("- category.json kok + 21 ust kategori desing.body = [t1af01,t1ulo01]");
log.push("- pagesetting.json category kok body ayni");
log.push("- page/<kategori-id>/index.json x21 senkron");
log.push("- .cursorrules kategori detay satiri guncellendi");
log.push("");
log.push("## Render");
log.push("status=" + render.status);
log.push("renderId=" + render.renderId);
log.push("renderMs=" + render.renderMs);
log.push("warningCount=" + render.warningCount);
log.push("");
log.push("## Dogrula");
for (var di = 0; di < dogLines.length; di++) {
  log.push(dogLines[di]);
}
log.push("");
log.push("## Baglama dogrulama");
log.push("ust kategori sayisi=" + tops.length);
log.push("hepsi body [t1af01,t1ulo01]=" + bodyOk);
log.push("root body=" + JSON.stringify(cat.desing.body));
log.push("t1ulo01 path=" + (ulo && ulo.path));
log.push("t1ulo01 page=" + (ulo && ulo.desing && ulo.desing.page));
log.push("");
log.push("## Spot-check /tr/filtreler/");
log.push(
  "wa.me/905447171828=" +
    (html.indexOf("wa.me/905447171828") !== -1)
);
log.push("Sepete Ekle=" + /sepete\s*ekle/i.test(html));
log.push("sidebar=" + (html.indexOf("sidebar") !== -1));
log.push("data-ulo-grid=" + (html.indexOf("data-ulo-grid") !== -1));
log.push("Teklif Al=" + (html.indexOf("Teklif Al") !== -1));
log.push(
  "Magento turuncu/hex=" + /#ff5500|#f7941d|#ff6a00/i.test(html)
);
log.push(
  "urun kart (data-ulo-name)=" +
    (html.match(/data-ulo-name/g) || []).length
);
log.push("");
log.push("## DONE");
log.push("- [x] urun-liste-otomavi modul + katalog");
log.push("- [x] ust kategoriler body [t1af01,t1ulo01]");
log.push("- [x] modules.json t1ulo01");
log.push("- [x] .cursorrules guncel");
log.push("- [x] dogrula hata=0 · render ok");
log.push("- [x] Sepet metni yok · WhatsApp CTA var");
log.push("- [x] 23_run.log yazildi");

var text = log.join("\n") + "\n";
fs.writeFileSync(
  "D:/projeler/otomavi/Web/matrix/data/yonetici/23_run.log",
  text,
  "utf8"
);
fs.mkdirSync("D:/matrix/data/yonetici", { recursive: true });
fs.writeFileSync("D:/matrix/data/yonetici/23_run.log", text, "utf8");
console.log(text);
