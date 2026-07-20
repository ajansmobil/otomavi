var fs = require("fs");
var pages = [
  "D:/projeler/otomavi/Web/public/tr/filtreler/index.html",
  "D:/projeler/otomavi/Web/public/tr/index.html",
  "D:/projeler/otomavi/Web/public/tr/yakit-filtresi/index.html"
];
pages.forEach(function (p) {
  var h = fs.readFileSync(p, "utf8");
  var name = p.split("/").slice(-2).join("/");
  var wa = h.match(/\.[a-z0-9_-]+-wa[^{]*\{[\s\S]{0,350}?\}/);
  console.log("\n== " + name + " ==");
  console.log(wa ? wa[0].replace(/\s+/g, " ").slice(0, 280) : "no -wa rule");
  console.log("25D366:", h.indexOf("25D366") >= 0 || h.indexOf("#25d366") >= 0);
  console.log("waBtn:", h.indexOf("waBtn") >= 0 || h.indexOf("25D366") >= 0);
});
