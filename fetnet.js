"use strict";

var request = require("sync-request");
var cheerio = require("cheerio");
var path = require("path");

var file = ""
var url = "https://www.fetnet.net/cs/Satellite/Corporate/coOperationAnalysis";
var response = request('GET', url);

if (response.statusCode == 200) {
    var $ = cheerio.load(response.getBody('utf8'));
    $('a[href$=".xlsx"]:contains("下載每月營運資訊")').each(
        function (i, e) {
            var href = $(e).attr("href");
            file = path.basename(href);
        }
    );
}

module.exports = { file: file };
