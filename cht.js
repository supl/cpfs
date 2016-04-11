"use strict";

var request = require("sync-request");
var cheerio = require("cheerio");
var path = require("path");

var file = "";
var url = "http://www.cht.com.tw/ir/stockit-moit.html";
var response = request('GET', url);

if (response.statusCode == 200) {
    var $ = cheerio.load(response.getBody('utf8'));
    var href = $('a[href$=".xls"]:contains("每月營運資訊")').first().attr("href");
    file = path.basename(href);
}

module.exports = {
    source: "cht",
    file: file
};
