var fs = require("fs");
var path = require("path");

var catPath = "D:/matrix/webmodules/body/index.json";
var catalog = JSON.parse(fs.readFileSync(catPath, "utf8"));
var exists = catalog.some(function (x) {
  return x.path === "urun-liste-otomavi";
});
if (!exists) {
  catalog.push({
    name: "Oto Mavi Ürün Liste (sidebar+grid)",
    description:
      "Oto Mavi kategori detay: sol sidebar kategori linkleri + sağ ürün kart grid. Sepet yok; CTA İncele + WhatsApp Teklif Al.",
    path: "urun-liste-otomavi",
    category: "page-category",
    subCategory: "otomavi-liste",
    version: "1.0.0",
    update: new Date().toISOString(),
    img: "/webmodules/logo.webp",
    private: false,
    author: "Matrix",
    tags: ["otomavi", "liste", "sidebar", "grid"],
    demo: "",
    payment: false,
    github: "",
    website: "",
    video: "",
    docs: "",
    proje: [{ proje: "otomavi", index: [0] }]
  });
  fs.writeFileSync(catPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  console.log("catalog: added urun-liste-otomavi");
} else {
  console.log("catalog: already exists");
}

var modPath = "D:/projeler/otomavi/Web/matrix/modules.json";
var mods = JSON.parse(fs.readFileSync(modPath, "utf8"));
var arr = mods.data;
var has = arr.some(function (x) {
  return x.id === "t1ulo01";
});
var uloDesing = {
  page: "products",
  sidebarTitle: { tr: "Kategorilere Göre", en: "Shop by Category" },
  allCategoriesLabel: { tr: "Tüm kategoriler", en: "All categories" },
  allCategoriesUrl: "/tr/urunler/",
  resultsLabel: { tr: "Sonuç:", en: "Results:" },
  sortLabel: { tr: "Sırala", en: "Sort" },
  sortAz: { tr: "Ada göre A-Z", en: "Name A-Z" },
  sortZa: { tr: "Ada göre Z-A", en: "Name Z-A" },
  ctaView: { tr: "İncele", en: "View" },
  ctaQuote: { tr: "Teklif Al", en: "Get Quote" },
  emptyText: {
    tr: "Bu kategoride ürün bulunamadı.",
    en: "No products in this category."
  },
  waTextPrefix: {
    tr: "Merhaba Oto Mavi, şu ürün için teklif almak istiyorum:",
    en: "Hi Oto Mavi, I'd like a quote for:"
  },
  whatsapp: "905447171828",
  bg: "#F5F8FC",
  sidebarBg: "#FFFFFF",
  accent: "#02427A",
  titlecolor: "#0B3A6E",
  textcolor: "#1e3046",
  cardbg: "#FFFFFF",
  bordercolor: "rgba(11,58,110,0.12)",
  cardRadius: "14px",
  waBtnBg: "#25D366",
  max: "1200px",
  margin: "16px 0px 40px 0px"
};
if (!has) {
  var maxIdx = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].index > maxIdx) maxIdx = arr[i].index;
  }
  arr.push({
    id: "t1ulo01",
    name: "Oto Mavi Ürün Liste (sidebar+grid)",
    path: "urun-liste-otomavi",
    local: "body",
    category: "page-category",
    version: "1.0.0",
    icon: "view_list",
    desing: uloDesing,
    index: maxIdx + 1
  });
  console.log("modules: added t1ulo01 index", maxIdx + 1);
} else {
  for (var j = 0; j < arr.length; j++) {
    if (arr[j].id === "t1ulo01") {
      arr[j].desing = uloDesing;
      arr[j].path = "urun-liste-otomavi";
      arr[j].local = "body";
      arr[j].category = "page-category";
      console.log("modules: updated t1ulo01");
    }
  }
}
fs.writeFileSync(modPath, JSON.stringify(mods, null, 2) + "\n", "utf8");

var newBody = ["t1af01", "t1ulo01"];
var catJ = JSON.parse(
  fs.readFileSync("D:/projeler/otomavi/Web/matrix/category.json", "utf8")
);
if (!catJ.desing) catJ.desing = {};
catJ.desing.body = newBody.slice();
var updatedTops = 0;
for (var k = 0; k < catJ.data.length; k++) {
  var row = catJ.data[k];
  if (row.category === "") {
    if (!row.desing) row.desing = {};
    row.desing.body = newBody.slice();
    updatedTops++;
  }
}
fs.writeFileSync(
  "D:/projeler/otomavi/Web/matrix/category.json",
  JSON.stringify(catJ, null, 2) + "\n",
  "utf8"
);
console.log("category: root body + tops", updatedTops);

var ps = JSON.parse(
  fs.readFileSync("D:/projeler/otomavi/Web/matrix/pagesetting.json", "utf8")
);
var psUpdated = 0;
for (var p = 0; p < ps.data.length; p++) {
  if (ps.data[p].path === "category") {
    if (!ps.data[p].desing) ps.data[p].desing = {};
    ps.data[p].desing.body = newBody.slice();
    psUpdated++;
  }
}
fs.writeFileSync(
  "D:/projeler/otomavi/Web/matrix/pagesetting.json",
  JSON.stringify(ps, null, 2) + "\n",
  "utf8"
);
console.log("pagesetting category body updated", psUpdated);

var pageDir = "D:/projeler/otomavi/Web/matrix/page";
var synced = 0;
var skipped = 0;
for (var t = 0; t < catJ.data.length; t++) {
  var top = catJ.data[t];
  if (top.category !== "") continue;
  var ip = path.join(pageDir, top.id, "index.json");
  if (!fs.existsSync(ip)) {
    skipped++;
    continue;
  }
  var pj = JSON.parse(fs.readFileSync(ip, "utf8"));
  if (!pj.desing) pj.desing = {};
  pj.desing.body = newBody.slice();
  fs.writeFileSync(ip, JSON.stringify(pj, null, 2) + "\n", "utf8");
  synced++;
}
console.log("page sync:", synced, "skipped", skipped);
