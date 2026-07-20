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

function swapBody(arr) {
  if (!Array.isArray(arr)) return { arr: arr, n: 0 };
  var n = 0;
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === "t1pd01") {
      out.push("tp5jo4");
      n++;
    } else {
      out.push(arr[i]);
    }
  }
  return { arr: out, n: n };
}

var root = "D:/projeler/otomavi/Web/matrix";
var total = 0;


var kurPath = path.join(root, "kurumsal.json");
var kur = read(kurPath);
if (kur.desing && kur.desing.body) {
  var r0 = swapBody(kur.desing.body);
  kur.desing.body = r0.arr;
  total += r0.n;
}
for (var i = 0; i < kur.data.length; i++) {
  if (kur.data[i].desing && kur.data[i].desing.body) {
    var r = swapBody(kur.data[i].desing.body);
    kur.data[i].desing.body = r.arr;
    total += r.n;
  }
}
write(kurPath, kur);
console.log("kurumsal swapped");


var pagePath = path.join(root, "page.json");
var page = read(pagePath);
for (var p = 0; p < page.data.length; p++) {
  if (page.data[p].desing && page.data[p].desing.body) {
    var r2 = swapBody(page.data[p].desing.body);
    page.data[p].desing.body = r2.arr;
    total += r2.n;
  }
}
write(pagePath, page);
console.log("page.json swapped");


var psPath = path.join(root, "pagesetting.json");
var ps = read(psPath);
for (var s = 0; s < ps.data.length; s++) {
  if (ps.data[s].path === "kurumsal" && ps.data[s].desing && ps.data[s].desing.body) {
    var r3 = swapBody(ps.data[s].desing.body);
    ps.data[s].desing.body = r3.arr;
    total += r3.n;
  }
}
write(psPath, ps);
console.log("pagesetting swapped");


var pageRoot = path.join(root, "page");
var dirs = fs.readdirSync(pageRoot);
var pageFiles = 0;
for (var d = 0; d < dirs.length; d++) {
  var idx = path.join(pageRoot, dirs[d], "index.json");
  if (!fs.existsSync(idx)) continue;
  var pj = read(idx);
  if (!pj.desing || !pj.desing.body) continue;
  var r4 = swapBody(pj.desing.body);
  if (r4.n) {
    pj.desing.body = r4.arr;
    write(idx, pj);
    total += r4.n;
    pageFiles++;
  }
}
console.log("page folders updated:", pageFiles);
console.log("total t1pd01→tp5jo4:", total);


var crPath = path.join(root, ".cursorrules");
var cr = fs.readFileSync(crPath, "utf8");
cr = cr.replace(
  /\*\*Ürün detay body \(Paket 24\):\*\* `t1udo01` \(path=`urun-detay-otomavi`\)[^\n]+/,
  "**Ürün detay body (Paket 24):** `t1udo01` (path=`urun-detay-otomavi`). **Kurumsal / iç sayfa (Paket 29):** `tp5jo4` (path=`page-desing-5`) — `t1pd01` / `page-desing-otomavi` kullanılmaz."
);
if (cr.indexOf("Paket 29") < 0) {
  cr +=
    "\n\n## İç sayfa (Paket 29)\n- Kurumsal / Hakkımızda / İletişim / yasal: body’de **`tp5jo4` = page-desing-5**\n- `page-desing-otomavi` (`t1pd01`) Oto Mavi’de **kullanılmaz** (kötü iç sayfa UX; silindi/değiştirildi)\n- Ürün detay ayrı: `t1udo01`\n";
}
fs.writeFileSync(crPath, cr, "utf8");
console.log("cursorrules ok");
console.log("DONE");
