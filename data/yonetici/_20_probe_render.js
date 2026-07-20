var path = require("path");
var fs = require("fs");
process.chdir("D:/matrix");
var serviceUtils = require("D:/matrix/public/webmaker/services/serviceUtils");
var webDir = serviceUtils.getWebDir("otomavi");
console.log("webDir", webDir);
var modules = JSON.parse(fs.readFileSync(path.join(webDir, "modules.json"), "utf8"));
var desing = JSON.parse(fs.readFileSync(path.join(webDir, "desing.json"), "utf8"));
var setting = JSON.parse(fs.readFileSync(path.join(webDir, "setting.json"), "utf8"));
var category = JSON.parse(fs.readFileSync(path.join(webDir, "category.json"), "utf8"));
var products = JSON.parse(fs.readFileSync(path.join(webDir, "products.json"), "utf8"));
var modulerender = require("D:/matrix/public/webmaker/services/webmaker/moduleRender").modulerender;
var ctx = {
  webmakerdata: {
    modules: modules,
    desing: desing,
    setting: setting,
    category: category,
    products: products,
    pagesetting: { data: [] }
  },
  projePath: "otomavi",
  webmodulepath: "webmodules",
  fileCache: {},
  translate: {}
};
(async function () {
  try {
    var html = await modulerender(ctx, desing.header, "tr", setting, "header");
    console.log("header len", html.length);
    console.log(html.slice(0, 200).replace(/\n/g, " "));
    var html2 = await modulerender(ctx, ["t1ls02"], "tr", setting, "body");
    console.log("t1ls02 len", html2.length);
    console.log(html2.slice(0, 200).replace(/\n/g, " "));
    var html3 = await modulerender(ctx, ["t1af01"], "tr", setting, "body");
    console.log("t1af01 len", html3.length);
  } catch (e) {
    console.error("ERR", e && e.stack ? e.stack : e);
  }
})();
