var Bot = require("./core/bot");
var Steam = require("steam"),
    fs = require('fs');

var steam = new Steam.SteamClient();


steam.connect();
steam.on('connected', function () {
    var bot = new Bot(steam, true);
    console.log('connected')
    var logOnOptions = {
        username: 'baimurzin719',
        password: '5BapsxsM',
        //auth_code: 'WPTR2'
    };

    var logOnOptions2 = {
        username: 'vladislav_719',
        password: '5BapsxsM',
        apikey: ''
    };
    logOnOptions.sha_sentryfile = fs.readFileSync('sentry_'+logOnOptions.username);
    bot.start(logOnOptions2);
    bot.on('ready', function () {
        bot.checkOffers().then(function (items) {
            fs.writeFileAsync('itemsGetting', JSON.stringify(items))
        });
        //bot.getBotInventory(570, 2).then(function (items) {
        //    console.log(items);
        //})
        //bot.checkOffers().then(function (tradeId, steamId) {
        //    console.log(tradeId, steamId);
        //})
    });

    var steamTrade = new Steam.SteamTrading(steam);
    steamTrade.on('tradeProposed', function (tradeId, steamId) {
        console.log('trade'+ tradeId + " " + steamId);
        //deferred.resolve(tradeId, steamId);
    });
    bot.on('debug', console.log);
});
