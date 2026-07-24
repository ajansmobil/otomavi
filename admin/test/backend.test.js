
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
