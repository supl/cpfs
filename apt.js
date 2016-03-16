"use strict";

var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");

var target = "http://www.mzcan.com/taiwan/3682/irwebsite_c/index.php?mod=monthlysales";

function pushover(message) {
    var pushover = JSON.parse(fs.readFileSync("pushover.json"));
    if (pushover.users.length && pushover.token) {
        for (var user of pushover.users) {
            request.post("https://api.pushover.net/1/messages.json").form({
                token: pushover.token,
                user: user,
                message: message
            });
        }
    }
}

request(target, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        var imgs = $('img[src="img/corporate/btn_stock01.jpg"]');
        if (imgs.length == 1) {
            var href = imgs.first().parent().attr("href");
            var filename = path.basename(href);

            var whitelist = JSON.parse(fs.readFileSync("whitelist.json"));
            if (whitelist.apt.indexOf(filename) === -1) {
                pushover(`Asis Pacific Telecom might update a new financial statement: <${filename}>`);
                whitelist.apt.push(filename);
                fs.writeFileSync("whitelist.json", JSON.stringify(whitelist));
            }
        }
    }
});
