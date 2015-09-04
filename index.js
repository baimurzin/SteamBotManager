var EventEmitter = require('events').EventEmitter,
    fs = require('fs'),
    util = require('util');


var SteamBotManager = function (steamClient, debug) {
    EventEmitter.call(this);

    this.debug = debug || false;
    this._client = steamClient;

    var self = this;
};

SteamBotManager.prototype.startBots = function() {

};

SteamBotManager.prototype.botList = function () {

};

SteamBotManager.prototype.stopBot = function (botIndex) {

};

SteamBotManager.prototype.botInfo = function (botIndex) {

};

util.inherits(SteamBotManager, EventEmitter);

module.exports = SteamBotManager;