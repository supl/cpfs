"use strict";

var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");
var pushover = require("node-pushover");

var target = "http://www.mzcan.com/taiwan/3682/irwebsite_c/index.php?mod=monthlysales";
var pushover_config = JSON.parse(fs.readFileSync("pushover.json"));
var push = new pushover({ token: pushover_config.token });

request(target, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        var imgs = $('img[src="img/corporate/btn_stock01.jpg"]');
        if (imgs.length == 1) {
            var href = imgs.first().parent().attr("href");
            var filename = path.basename(href);

            var whitelist = JSON.parse(fs.readFileSync("whitelist.json"));
            if (whitelist.apt.indexOf(filename) === -1) {
                var title = "Note";
                var message = `Asia Pacific Telecom might update a new financial statement: <${filename}>`;
                for (var user of pushover_config.users) {
                    push.send(user, title, message);
                }

                whitelist.apt.push(filename);
                fs.writeFileSync("whitelist.json", JSON.stringify(whitelist));
            }
        }
    }
});
