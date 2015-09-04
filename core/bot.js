var EventEmitter = require("events").EventEmitter,
    fs = require("fs"),
    util = require("util"),
    crypto = require('crypto'),
    Steam = require("steam"),
    SteamTradeOffers = require('steam-tradeoffers'),
    SteamWebLogOn = require('steam-weblogon');

    var steamClient = {},
        steamUser = {},
        offers, steamWebLogOn, botSessionId, botCookie;

var Bot = function (commonSteamClient, debug) {
    EventEmitter.call(this);
    offers = new SteamTradeOffers();
    steamClient = commonSteamClient;
    this._isRunning = false;
    this.debug = debug || false;
};
util.inherits(Bot, EventEmitter);

Bot.prototype.start = function (config) {
    var self = this;
    if (steamClient.connected){

        self._config = config;
        steamUser = new Steam.SteamUser(steamClient);
        steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
        var logOnOptions = {};
        logOnOptions.account_name = config.username;
        logOnOptions.password = config.password;

        //sentry or auth_code
        if (config.sha_sentryfile) {
            logOnOptions.sha_sentryfile = getSHA(config.sha_sentryfile);
            self.emit('sentry found');
        } else if (config.auth_code) {
            self.emit('no sentry using auth_code')

            logOnOptions.auth_code = config.auth_code;
        }

        steamUser.logOn(logOnOptions);
        steamUser.on('updateMachineAuth', function (sentry, callback) {
            fs.writeFileSync('sentry_'+self._config.username, sentry.bytes);
            self.emit('sentry file created');

            callback({
                sha_file: getSHA(sentry.bytes)
            });
        });
        steamClient.on('logOnResponse', function (logonResp) {
            if (logonResp.eresult == Steam.EResult.OK) {
                self._isRunning = true;
                self.emit('debug','bot started: ' + self._config.username);
                steamWebLogOn.webLogOn(function (webSessionId, cookies) {
                    botSessionId = webSessionId;
                    botCookie = cookies;
                    offers.setup({
                        sessionId: botSessionId,
                        webCookie: botCookie
                    });
                    self.emit('debug', 'cookie configured with session ID: ' + botSessionId + " on bot : " + self._config.username);
                    self.emit('ready');
                });
            }

        });
    }
    else {
        this.emit('debug', 'check connection ot steamClient');
    }
};

Bot.prototype.stop = function () {
    var self = this;
    self._isRunning = false;
};

Bot.prototype.getBotInventory = function (appId, contextId) {
    var self = this;
    self.emit('debug', botSessionId + "TEST");
    offers.loadMyInventory({
        appId: appId,
        contextId: contextId
    }, function (err, items) {
        if (err) {
            self.emit('errors', 'Cannot load inventory');
        }
        var item = [], num = 0;
        return items;
    });
};

function getSHA(bytes) {
    return crypto.createHash('sha1').update(bytes).digest();
}

module.exports = Bot;