
var assert = require("assert");
var path = require("path");
var ops = require("../../../scripts/test-operations-utils");

var PAGE_DIR = path.resolve(__dirname, "..");

var OPERATIONS = [
  { id: "admin-sayfa-ekle", file: "admin.js", fn: "mxAdminAddPage" },
  { id: "admin-sayfa-kaydet", file: "admin.js", fn: "mxAdminHandlePageFormSubmit" },
  { id: "admin-sayfa-sil", file: "admin.js", fn: "mxAdminDeletePage", deleteOp: true },
  { id: "admin-sayfa-kopyala", file: "admin.js", fn: "mxAdminClonePage" },
  { id: "admin-sayfa-toplu-sil", file: "admin.js", fn: "mxAdminBulkDeletePages", deleteOp: true },
  { id: "admin-sayfa-toplu-status", file: "admin.js", fn: "mxAdminBulkSetPageStatus" },
  { id: "admin-sayfa-toplu-tasi", file: "admin.js", fn: "mxAdminBulkMovePages" },
  { id: "admin-logo-guncelle", file: "admin.js", fn: "mxAdminHandleSettingLogoUploadInput" },
  { id: "admin-modul-kaydet", file: "admin.js", fn: "mxAdminHandleModuleFormSubmit" },
  { id: "admin-kategori-kaydet", file: "admin.js", fn: "mxAdminHandleCategoryAddSubmit" },
  { id: "admin-ayarlar-kaydet", file: "admin.js", fn: "mxAdminHandleSettingsFormSubmit" },
  { id: "admin-tasarim-kaydet", file: "admin.js", fn: "mxAdminHandleDesignFormSubmit" },
  { id: "admin-sifre-degistir", file: "admin.js", fn: "mxAdminHandleMustResetSubmit" },
  {
    id: "mxadmin-siparis-durum",
    file: "modules/siparisler/siparisler-admin.js",
    fn: "mxAdminSiparislerSiparisDetayKaydet"
  },
  {
    id: "mxadmin-eticaret-ayar-kaydet",
    file: "modules/eticaret/eticaret-admin.js",
    fn: "mxAdminEticaretAyarKaydet"
  },
  {
    id: "mxadmin-odeme-ayar-kaydet",
    file: "modules/odeme/odeme-admin.js",
    fn: "mxAdminOdemeAyarKaydet"
  },
  {
    id: "mxadmin-kargo-ayar-kaydet",
    file: "modules/kargo/kargo-admin.js",
    fn: "mxAdminKargoAyarKaydet"
  },
  {
    id: "mxadmin-sepet-ayar-kaydet",
    file: "modules/sepet/sepet-admin.js",
    fn: "mxAdminSepetKaydet"
  }
];

describe("webmodules/admin operations registry", function() {
  it("OPERATIONS dizisi tanimli", function() {
    assert.ok(Array.isArray(OPERATIONS), "OPERATIONS dizisi olmali");
  });

  if (OPERATIONS.length === 0) {
    it.skip("OPERATIONS bos — sayfa islemleri eklendikce doldurun (pending)", function() {});
    return;
  }

  OPERATIONS.forEach(function(op) {
    it(op.id + " — " + op.fn + " tanimli", function() {
      ops.assertFunctionExists(PAGE_DIR, op.file, op.fn);
    });
    if (op.deleteOp) {
      it(op.id + " — Global_confirmDelete kullanir", function() {
        var src = ops.readFileUtf8(path.join(PAGE_DIR, op.file));
        var fnRe = new RegExp(
          "function\\s+" + op.fn + "\\s*\\([\\s\\S]*?(?=\\nfunction\\s|$)"
        );
        var block = fnRe.exec(src);
        assert.ok(block, op.fn + " fonksiyon govdesi bulunamadi");
        ops.assertUsesGlobalConfirmDelete(block[0], op.file + " :: " + op.fn);
        ops.assertNoBrowserConfirmForDelete(block[0], op.file + " :: " + op.fn);
      });
    }
  });
});
