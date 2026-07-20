
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = "D:/projeler/otomavi/Web/matrix";
const YON = path.join(ROOT, "data/yonetici");

const p = require(path.join(ROOT, "products.json"));
const m = require(path.join(ROOT, "modules.json"));
const setting = require(path.join(ROOT, "setting.json"));

const top = p.data.filter((x) => x.category === "");
const kids = p.data.filter((x) => x.category !== "");
const pc = m.data.find((x) => x.id === "t1pc03");
const ls = m.data.find((x) => x.id === "t1ls01");

const uniq = [
  "omfykt1a", "omfdsk2a", "omgtmp3a", "ommcta4a", "omeaku5a", "omsamr6a",
  "omkkmp7a", "omatbj8a", "omsyag9a", "ombper0a", "omicps1a", "omafr2a",
  "omkvky3a", "omslst4a",
];
let uniqOk = 0;
for (const id of uniq) {
  const f = path.join(ROOT, "page", id, "index.webp");
  if (fs.existsSync(f) && fs.statSync(f).size > 0) uniqOk++;
}

const by = {};
for (const k of kids) by[k.category] = (by[k.category] || 0) + 1;
let min = 99;
const rows = [];
for (const t of top) {
  const n = by[t.id] || 0;
  if (n < min) min = n;
  rows.push(`  ${t.id} ${t.path} urun=${n} body=${JSON.stringify(t.desing && t.desing.body)}`);
}

let analiz = "";
try {
  analiz = execFileSync(
    process.execPath,
    ["D:/projeler/elo/web/talimatlar/web/webmaker-analiz.js", "otomavi"],
    { encoding: "utf8" }
  );
} catch (e) {
  analiz = (e.stdout || "") + (e.stderr || "") + String(e);
}

const log = [
  "=== Paket 08 — Ürün kategori + ürün yapısı ===",
  "Tarih: 2026-07-20",
  "cwd: D:\\projeler\\otomavi\\Web\\matrix",
  "Marka: Oto Mavi · eticaret: false · sepet yok",
  "",
  "## Yapılanlar",
  "1. modules.json ← t1pc03 (page-category-3, katalog R7/R12)",
  "2. products.json Model B: 14 üst (category:\"\") + 43 ürün (category:<üst-id>)",
  "3. Üst kategori desing.body = [tp5jo4, t1pc03]",
  "4. Her ürün için page/{id}/index.json (R14/R15) + index.webp",
  "5. 14 özgün ComfyUI görsel (kategori başına 1) + kalanlar kategori kopyası",
  "6. Ürün metinleri benzersizleştirildi (BENZERLIK)",
  "7. pagesetting products desing = [tp5jo4]",
  "8. Menü: page.json Ürünler → t1plpr; ana sayfa t1ls01 page-list-3 category:\"\"",
  "9. ELO karar-agaci J. Model B nesting zaten mevcut — talimat eklenmedi",
  "",
  "## Hiyerarşi kanıtı",
  `ust_kategori=${top.length} (category===\"\")`,
  `urun=${kids.length} (>=42 şart)`,
  `modul_t1pc03=${pc ? pc.path : "YOK"}`,
  `ust_body_ornek=${JSON.stringify(top[0] && top[0].desing && top[0].desing.body)}`,
  `ana_sayfa_t1ls01_category_bos=${ls && ls.desing.category === ""}`,
  `eticaret=${setting.eticaret}`,
  `ozgun_gorsel=${uniqOk}/14`,
  `min_urun_per_cat=${min}`,
  ...rows,
  "",
  "## webmaker-analiz.js",
  analiz.trim(),
  "",
  "## Çıktı dosyaları",
  "- data/yonetici/08_urun_agaci.md",
  "- data/yonetici/08_run.log",
  "- data/yonetici/08_build_urun_agaci.js",
  "- data/yonetici/08_refine_text_img.js",
  "",
].join("\n");

fs.writeFileSync(path.join(YON, "08_run.log"), log, "utf8");
console.log(log.split("\n").slice(0, 45).join("\n"));
console.log("...");
const ok = /hata=0/.test(analiz) && top.length === 14 && kids.length >= 42 && pc;
console.log(ok ? "PAKET08_OK" : "PAKET08_FAIL");
