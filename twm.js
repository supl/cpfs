"use strict";

var url = "http://corp.taiwanmobile.com/investor-relations/operating-results.html";
var request = require("sync-request");
var response = request('GET', url, {
    headers: {
        "user-agent": "Mozilla/5.0"
    }
});

var file = "";
if (response.statusCode == 200) {
    var cheerio = require("cheerio");
    var path = require("path");
    var $ = cheerio.load(response.getBody("utf-8"));
    $('a[href$=".xls"][title^="營運資訊"]').each(
        function (i, e) {
            var href = $(e).attr("href");
            file = path.basename(href);
        }
    );
}

module.exports = {
    source: "twm",
    file: file
};
