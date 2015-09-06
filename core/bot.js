var EventEmitter = require("events").EventEmitter,
    fs = require("fs"),
    util = require("util"),
    crypto = require('crypto'),
    Steam = require("steam"),
    SteamTradeOffers = require('steam-tradeoffers'),
    SteamWebLogOn = require('steam-weblogon'),
    q = require('q');

    var steamClient = {},
        steamUser = {},
        offers, steamWebLogOn, botSessionId, botCookie, steamTrade;

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
                        webCookie: botCookie,
                        APIKey: config.apikey
                    });
                    self.emit('debug', 'cookie configured with session ID: ' + botSessionId + " on bot : " + self._config.username);
                    self.emit('ready');

                });
                //steamTrade = new Steam.SteamTrading(steamClient);

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
    var deferred = q.defer();
    self.emit('debug', botSessionId + "TEST");
    offers.loadMyInventory({
        appId: appId,
        contextId: contextId
    }, function (err, items) {
        if (err) {
            self.emit('errors', 'Cannot load inventory');
        }
        deferred.resolve(items);
    });
    return deferred.promise;
};

Bot.prototype.makeOffer = function (options) {
      offers.makeOffer(options, function (err, response) {
          if (err) {
              self.emit('errors', 'Cannot make offer to ' + options.partnerSteamId);
          }
          self.emit('debug', 'Trade offer sent');
      });
};

//
Bot.prototype.checkOffers = function () {
    var self = this;
    var deferred = q.defer();
    offers.getOffers({
        get_received_offers: 1,
        active_only: 1,
        time_historical_cutoff: Math.round(Date.now() /1000)
    }, function (err, body) {
        if(err){
            self.emit('debug', "error occured while getting ofers")
            self.emit('debug', err)
        }
        if(body.response.trade_offers_received) {
            body.response.trade_offers_received.forEach(function (offer) {
                if (offer.trade_offer_state == 2) {
                    if (!offer.items_to_give) {
                        self.emit('debug', 'Trying to get items');
                        acceptOffer(offer).then(function (err, items) {
                            if (err) {
                                self.emit('errors', err);
                            } else {
                                self.emit('debug', 'item received');
                                deferred.resolve(items);
                            }
                        });
                    } else {
                        declineOffer(offer);
                        self.emit('debug', "offer declined");
                    }
                }
            })
        }
    });
    return deferred.promise;
};

function acceptOffer(offer) {
    console.log('accepting offer');
    var deferred = q.defer();
    offers.acceptOffer({tradeOfferId: offer.tradeofferid}, function (err, res) {
        if (err) {
            console.log('error accetp' + err)
        } else {
            offers.getItems({tradeId:res.tradeid}, function (err, items) {
                deferred.resolve(err, items);
            })
        }
    });
    return deferred.promise;
}

function declineOffer(offer) {
    offers.declineOffer({tradeOfferId: offer.tradeofferid});
}

function getSHA(bytes) {
    return crypto.createHash('sha1').update(bytes).digest();
}

module.exports = Bot;