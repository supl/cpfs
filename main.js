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

var apt = require("./apt");
if (!whitelist.has(apt)) {
    pushover.send("Note", `Asia Pacific Telecom might update a new financial statement: <${apt.file}>`);
    whitelist.add(apt);
}

var fetnet = require("./fetnet");
if (!whitelist.has(fetnet)) {
    pushover.send("Note", `Far EasTone Telecom might update a new financial statement: <${fetnet.file}>`);
    whitelist.add(fetnet);
}

whitelist.syncStorage();
