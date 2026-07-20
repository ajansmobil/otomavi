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
  var d = m.desing;
  if (m.id === "t1ulo01") {
    d.ctaQuote = {
      tr: "WhatsApp ile Sipariş",
      en: "Order via WhatsApp"
    };
    d.waTextPrefix = {
      tr: "Merhaba Oto Mavi, şu ürün için WhatsApp siparişi oluşturmak istiyorum:",
      en: "Hi Oto Mavi, I'd like to place a WhatsApp order for:"
    };
    n++;
  }
  if (m.id === "t1udo01") {
    d.ctaQuote = {
      tr: "WhatsApp ile Sipariş",
      en: "Order via WhatsApp"
    };
    d.waMessagePrefix = {
      tr: "Merhaba Oto Mavi, şu ürün için WhatsApp siparişi oluşturmak istiyorum:",
      en: "Hi Oto Mavi, I'd like to place a WhatsApp order for:"
    };
    n++;
  }
  if (m.id === "t1pd01") {
    d.ctaWhatsapp = {
      tr: "WhatsApp ile Sipariş",
      en: "Order via WhatsApp"
    };
    d.waMessagePrefix = {
      tr: "Merhaba Oto Mavi, WhatsApp siparişi oluşturmak istiyorum:",
      en: "Hi Oto Mavi, I'd like to place a WhatsApp order about:"
    };
    n++;
  }
  if (m.id === "t1ct01") {
    d.btn2Text = {
      tr: "WhatsApp ile Sipariş",
      en: "Order via WhatsApp"
    };
    d.btn2Url =
      "https://wa.me/905447171828?text=" +
      encodeURIComponent(
        "Merhaba Oto Mavi, WhatsApp ile sipariş oluşturmak istiyorum."
      );
    if (d.description && d.description.tr) {
      d.description.tr =
        "BMW yedek parça stok sorgusu ve uyumluluk için Oto Mavi’ye yazın — Gaziantep deposundan hızlı dönüş. WhatsApp ile sipariş oluşturun veya telefonla arayın.";
    }
    n++;
  }
}
write(modPath, mods);
console.log("modules updated:", n);

var mantik = "D:/matrix/webmodules/mantik/mantik.md";
var md = fs.readFileSync(mantik, "utf8");
if (md.indexOf("WhatsApp ile Sipariş (Paket 25)") < 0) {
  md +=
    "\n\n**Oto Mavi sipariş dili (2026-07-20, Paket 25):** Sepet yok. CTA = **WhatsApp ile Sipariş** (liste/detay/CTA/kurumsal). wa.me hazır metin sipariş oluşturma; ürün CTA’da Teklif Al / Sepete Ekle kullanılmaz.\n";
  fs.writeFileSync(mantik, md, "utf8");
  console.log("mantik updated");
}
