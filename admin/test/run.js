/**
 * webmodules/admin — test calistirici.
 * node webmodules/admin/test/run.js
 * Opsiyonel E2E: ADMIN_E2E=1 node webmodules/admin/test/run.js
 */
var path = require("path");
var Mocha = require("mocha");

var mocha = new Mocha({ timeout: 60000, reporter: "spec" });
var dir = __dirname;
mocha.addFile(path.join(dir, "admin-api.test.js"));
mocha.addFile(path.join(dir, "admin-structure.test.js"));
mocha.addFile(path.join(dir, "operations.test.js"));
mocha.addFile(path.join(dir, "backend.test.js"));
mocha.addFile(path.join(dir, "rust-compliance.test.js"));

mocha.run(function(failures) {
  if (process.env.ADMIN_E2E !== "1") {
    process.exit(failures ? 1 : 0);
    return;
  }
  var cp = require("child_process");
  var e2ePath = path.join(dir, "e2e-playwright.js");
  var child = cp.spawn(process.execPath, [e2ePath], {
    stdio: "inherit",
    env: process.env,
    cwd: path.resolve(dir, "../../..")
  });
  child.on("close", function(code) {
    process.exit(failures || code ? 1 : 0);
  });
  child.on("error", function(err) {
    console.error("ADMIN_E2E spawn hatasi:", err.message || err);
    process.exit(1);
  });
});
