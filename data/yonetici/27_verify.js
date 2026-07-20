var fs = require("fs");

var h = fs.readFileSync("D:/projeler/otomavi/Web/public/tr/index.html", "utf8");
console.log("top SSS label:", h.indexOf(">SSS<") >= 0);
console.log("Sikca Sorulan:", h.indexOf("Sıkça Sorulan") >= 0);
console.log("/tr/sss:", h.indexOf("/tr/sss") >= 0);

var p = "D:/projeler/otomavi/Web/matrix/page/yvi9dlb59o/index.json";
var raw = fs.readFileSync(p, "utf8");
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
var j = JSON.parse(raw);
if (j.keyword && j.keyword.tr) {
  j.keyword.tr = String(j.keyword.tr)
    .replace(/,?\s*SSS\s*,?/gi, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/^\s*,\s*|\s*,\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
if (j.description && j.description.tr) {
  j.description.tr = String(j.description.tr)
    .replace(/\s*SSS,?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
console.log("yvi fixed:", j.keyword && j.keyword.tr);


var { execSync } = require("child_process");
try {
  var out = execSync(
    "node D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js otomavi --hizli",
    { encoding: "utf8" }
  );
  console.log(out.split("\n").filter(function (l) {
    return /uyarı|warn|⚠|✓|hata/i.test(l);
  }).join("\n"));
} catch (e) {
  console.log(String(e.stdout || e.message).slice(0, 800));
}
