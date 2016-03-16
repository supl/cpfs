"use strict";

var request = require("request");
var cheerio = require("cheerio");
var path = require("path");

var target = "http://www.mzcan.com/taiwan/3682/irwebsite_c/index.php?mod=monthlysales";

request(target, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        var imgs = $('img[src="img/corporate/btn_stock01.jpg"]');
        if (imgs.length == 1) {
            var href = imgs.first().parent().attr("href");
            var filename = path.basename(href);
            console.log(filename);
        }
    }
});
