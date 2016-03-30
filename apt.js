"use strict";

var request = require("sync-request");
var cheerio = require("cheerio");
var path = require("path");

var file = "";
var url = "http://www.mzcan.com/taiwan/3682/irwebsite_c/index.php?mod=monthlysales";
var response = request('GET', url);

if (response.statusCode == 200) {
    var $ = cheerio.load(response.getBody('utf8'));
    var imgs = $('img[src="img/corporate/btn_stock01.jpg"]');
    if (imgs.length == 1) {
        var href = imgs.first().parent().attr("href");
        file = path.basename(href);
    }
}

module.exports = {
    source: "apt",
    file: file
};
