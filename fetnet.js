"use strict";

var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");
var pushover = require("node-pushover");

var target = "https://www.fetnet.net/cs/Satellite/Corporate/coOperationAnalysis";
var pushover_config = JSON.parse(fs.readFileSync("pushover.json"));
var push = new pushover({ token: pushover_config.token });

request(target, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        $('a[href$=".xlsx"]').each(
            function (i, e) {
                if ("下載每月營運資訊" == $(e).text()) {
                    var href = $(e).attr("href");
                    var filename = path.basename(href);
                    var whitelist = JSON.parse(fs.readFileSync("whitelist.json"));
                    if (whitelist.fetnet.indexOf(filename) === -1) {
                        var title = "Note";
                        var message = `Far EasTone Telecom might update a new financial statement: <${filename}>`;
                        for (var user of pushover_config.users) {
                            push.send(user, title, message);
                        }

                        whitelist.fetnet.push(filename);
                        fs.writeFileSync("whitelist.json", JSON.stringify(whitelist));
                    }
                }
            }
        );
    }
});
