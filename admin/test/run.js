
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
  process.exit(failures ? 1 : 0);
});
