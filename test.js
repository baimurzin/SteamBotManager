var Bot = require("./core/bot");
var Steam = require("steam"),
    fs = require('fs');

var steam = new Steam.SteamClient();
var user = new Steam.SteamUser(steam);


steam.connect();
steam.on('connected', function () {
    var bot = new Bot(steam, true);
    console.log('connected')
    var logOnOptions = {
        username: 'baimurzin719',
        password: '5BapsxsM',
        //auth_code: 'WPTR2'
    };
    logOnOptions.sha_sentryfile = fs.readFileSync('sentry_'+logOnOptions.username);
    bot.start(logOnOptions);
    bot.on('ready', function () {
        bot.getBotInventory(570, 2);

    });
    bot.on('debug', console.log);
});
