var EventEmitter = require("events").EventEmitter,
    fs = require("fs"),
    util = require("util"),
    Steam = require("steam");

    var steamClient = {},
        steamUser = {};

var Bot = function (commonSteamClient, debug) {
    EventEmitter.call(this);
    steamClient = commonSteamClient;
    this._isRunning = false;
    this.debug = debug || false;
    util.log("instance created ");
};
util.inherits(Bot, EventEmitter);

Bot.prototype.start = function (config) {
    if (steamClient.connected){
        this.emit('log', 'log!!!');
        util.log("con!!")
        steamUser = new Steam.SteamUser(steamClient);
        steamUser.logOn({
            account_name: config.username,
            password: config.password,
            auth_code: 'R6GCM'

        });
        steamClient.on('logOnResponse', function () {
            console.log('bot auth');
        })
    }
    else {
        this.emit('error', 'check connection ot steamClient');
    }
};

module.exports = Bot;