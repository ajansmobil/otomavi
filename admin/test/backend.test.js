
var assert = require("assert");
var h = require("./helpers");

var TEST_CATEGORY = "kurumsal";

function buildPath(yol) {
  var p = yol.charAt(0) === "/" ? yol : "/" + yol;
  return p;
}

function categoryHasPageId(body, pageId) {
  if (!body || !body.data || typeof body.data !== "object") {
    return false;
  }
  var rows = Array.isArray(body.data.data) ? body.data.data : [];
  var i;
  for (i = 0; i < rows.length; i++) {
    if (rows[i] && String(rows[i].id) === String(pageId)) {
      return true;
    }
  }
  return false;
}


describe("webmodules/admin backend auth proxy (Worker)", function() {
  this.timeout(30000);

  var serverUp = false;
  var workerReachable = false;
  var authMeStatus = 0;

  before(async function() {
    try {
      var meRes = await h.httpGet("/auth/me", 8000);
      serverUp = meRes.status >= 200 && meRes.status < 600;
      authMeStatus = meRes.status;
      workerReachable = meRes.status === 401 || meRes.status === 403;
    } catch (err) {
      if (h.isServerUnreachable(err)) {
        serverUp = false;
        return;
      }
      throw err;
    }
  });

  it("cookie olmadan GET /auth/me en az 401 veya 403 (Worker proxy)", async function() {
    if (!serverUp) {
      console.log(
        "[skip] webtest-live-server yok — node scripts/webtest-live-server.js"
      );
      return this.skip();
    }
    if (authMeStatus === 502) {
      console.log(
        "[skip] Worker proxy 502 — WEBMAKER_ADMIN_API_URL (.env) tanimli olmali"
      );
      return this.skip();
    }
    assert.ok(
      authMeStatus === 401 || authMeStatus === 403,
      "auth/me cookie yokken reddedilmeli, alindi: " + authMeStatus
    );
  });

  it("cookie olmadan POST /auth/login reddedilir (401/403)", async function() {
    if (!serverUp) {
      return this.skip();
    }
    if (!workerReachable) {
      console.log("[skip] Worker ulasilamadi — auth login proxy atlandi");
      return this.skip();
    }
    var loginRes;
    try {
      loginRes = await h.httpPost(
        "/auth/login",
        { username: "invalid-e2e-user", password: "invalid-e2e-pass" },
        15000
      );
    } catch (err) {
      if (h.isServerUnreachable(err)) {
        return this.skip();
      }
      throw err;
    }
    assert.ok(
      loginRes.status === 401 || loginRes.status === 403,
      "auth/login cookie yokken reddedilmeli, alindi: " + loginRes.status
    );
  });
});

describe("webmodules/admin backend adminApiUrl placeholder", function() {
  it("helpers mxAdminApiConfigured placeholder ile uyumlu", function() {
    assert.strictEqual(h.mxAdminApiConfigured("{{adminApiUrl}}"), false);
    assert.strictEqual(h.mxAdminApiConfigured(""), false);
    assert.strictEqual(h.mxAdminApiConfigured(null), false);
  });

  it("placeholder cozulmeden mxAdminApiUrl bos doner", function() {
    assert.strictEqual(
      h.mxAdminApiUrl("{{adminApiUrl}}", "/api/admin/data/pagesetting"),
      ""
    );
    assert.strictEqual(h.mxAdminApiUrl("", "/api/admin/auth/me"), "");
  });

  it("cozulmus taban ile API yolu birlestirilir", function() {
    assert.strictEqual(
      h.mxAdminApiUrl("https://webmaker.yunusevgane.workers.dev", "/api/admin/data/setting"),
      "https://webmaker.yunusevgane.workers.dev/api/admin/data/setting"
    );
  });
});

describe("webmodules/admin backend page CRUD", function() {
  this.timeout(120000);

  var createdPageId = null;
  var serverUp = false;

  before(async function() {
    try {
      var probe = await h.httpGet(buildPath("/data/" + TEST_CATEGORY), 8000);
      serverUp = probe.status >= 200 && probe.status < 600;
    } catch (err) {
      if (h.isServerUnreachable(err)) {
        serverUp = false;
        return;
      }
      throw err;
    }
  });

  after(async function() {
    if (!serverUp || !createdPageId) {
      return;
    }
    try {
      await h.httpDelete(
        buildPath("/data/page-delete/" + TEST_CATEGORY + "/" + encodeURIComponent(createdPageId)),
        8000
      );
    } catch (_cleanupErr) {
      
    }
  });

  it("POST page-add → GET page-record → PUT → liste → DELETE → 404", async function() {
    if (!serverUp) {
      return this.skip();
    }

    var addRes;
    try {
      addRes = await h.httpPost(
        buildPath("/data/page-add/" + TEST_CATEGORY),
        { name: { tr: "Test Sayfa", en: "Test Page" } },
        15000
      );
    } catch (err) {
      if (h.isServerUnreachable(err)) {
        return this.skip();
      }
      throw err;
    }

    var addBody = h.parseJsonBody(addRes);
    if (addRes.status === 502 && addRes.body.indexOf("Onizleme matrix klasoru") !== -1) {
      console.log(
        "[skip] Onizleme matrix klasoru yok — webtest render + live-server preview domain gerekli"
      );
      return this.skip();
    }
    assert.strictEqual(addRes.status, 200, addRes.body);
    assert.ok(addBody && addBody.success === true, JSON.stringify(addBody));
    assert.ok(addBody.pageId, "pageId donmeli");
    createdPageId = addBody.pageId;

    var getRes = await h.httpGet(buildPath("/data/page-record/" + encodeURIComponent(createdPageId)));
    var getBody = h.parseJsonBody(getRes);
    assert.strictEqual(getRes.status, 200, getRes.body);
    assert.ok(getBody && getBody.data, JSON.stringify(getBody));
    assert.strictEqual(getBody.data.name && getBody.data.name.tr, "Test Sayfa");

    var updatedRecord = getBody.data;
    updatedRecord.name.tr = "Test Sayfa Guncellendi";

    var putRes = await h.httpPut(
      buildPath("/data/page-record/" + encodeURIComponent(createdPageId)),
      updatedRecord
    );
    var putBody = h.parseJsonBody(putRes);
    assert.strictEqual(putRes.status, 200, putRes.body);
    assert.ok(putBody && putBody.success === true, JSON.stringify(putBody));

    var listRes = await h.httpGet(buildPath("/data/" + TEST_CATEGORY));
    var listBody = h.parseJsonBody(listRes);
    assert.strictEqual(listRes.status, 200, listRes.body);
    assert.ok(categoryHasPageId(listBody, createdPageId), "kurumsal listesinde pageId olmali");

    var delRes = await h.httpDelete(
      buildPath("/data/page-delete/" + TEST_CATEGORY + "/" + encodeURIComponent(createdPageId))
    );
    var delBody = h.parseJsonBody(delRes);
    assert.strictEqual(delRes.status, 200, delRes.body);
    assert.ok(delBody && delBody.success === true, JSON.stringify(delBody));

    var goneId = createdPageId;
    createdPageId = null;

    var missRes = await h.httpGet(buildPath("/data/page-record/" + encodeURIComponent(goneId)));
    assert.strictEqual(missRes.status, 404, missRes.body);

    var listAfter = await h.httpGet(buildPath("/data/" + TEST_CATEGORY));
    var listAfterBody = h.parseJsonBody(listAfter);
    assert.strictEqual(listAfter.status, 200, listAfter.body);
    assert.ok(!categoryHasPageId(listAfterBody, goneId), "kurumsal listesinde pageId olmamali");
  });
});
