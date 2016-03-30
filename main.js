"use strict";

function Whitelist(storage) {
    var fs = require("fs");
    this._updated = false;
    this._whitelist = JSON.parse(fs.readFileSync(storage));
    this.has = (report) => !(this._whitelist[report.source].indexOf(report.file) === -1);
    this.add = (report) => {
        this._whitelist[report.source].push(report.file);
        this._updated = true;
    };

    this.syncStorage = () => {
        if (this._updated) {
            fs.writeFileSync(storage, JSON.stringify(this._whitelist));
        }
    };
}

function Pushover(config) {
    var fs = require("fs");
    var config = JSON.parse(fs.readFileSync(config));
    var pushover = require("node-pushover");
    var _pushover = new pushover({ token: config.token });

    this.send = (title, message) => {
        for (var user of config.users) {
            _pushover.send(user, title, message);
        }
    }
}

var whitelist = new Whitelist(__dirname + "/whitelist.json");
var pushover = new Pushover(__dirname + "/pushover.json");
var targets = [
    {
        report: require("./apt"),
        message: "Asia Pacific Telecom updated operating report: "
    },
    {
        report: require("./fetnet"),
        message: "Far EasTone Telecom updated operating report: "
    },
    {
        report: require("./twm"),
        message: "Taiwan Mobile updated operating report: "
    },
];

for (var target of targets) {
    if (!whitelist.has(target.report)) {
        pushover.send("Note", target.message + `<${target.report.file}>`);
        whitelist.add(target.report);
    }
}

whitelist.syncStorage();
