"use strict";

function Whitelist(storage) {
    var fs = require("fs");
    this._whitelist = JSON.parse(fs.readFileSync(storage));
    this.has = (source, file) => !(this._whitelist[source].indexOf(file) === -1);
    this.add = (source, file) => {
        this._whitelist[source].push(file);
        fs.writeFileSync(storage, JSON.stringify(this._whitelist));
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

var whitelist = new Whitelist("whitelist.json");
var pushover = new Pushover("pushover.json");

var apt = require("./apt");
if (apt.file == "") {
    pushover.send("Note", `Asia Pacific Telecom parsing failed`);
} else if (!whitelist.has("apt", apt.file)) {
    pushover.send("Note", `Asia Pacific Telecom might update a new financial statement: <${apt.file}>`);
    whitelist.add("apt", apt.file);
}

var fetnet = require("./fetnet");
if (fetnet.file == "") {
    pushover.send("Note", `Far EasTone Telecom parsing failed`);
} else if (!whitelist.has("fetnet", fetnet.file)) {
    pushover.send("Note", `Far EasTone Telecom might update a new financial statement: <${fetnet.file}>`);
    whitelist.add("fetnet", fetnet.file);
}
