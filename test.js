var Bot = require("./core/bot");
var Steam = require("steam");

var steam = new Steam.SteamClient();
var user = new Steam.SteamUser(steam);


steam.connect();
steam.on('connected', function () {
    var bot = new Bot(steam);
    console.log('connected')
    bot.start({
        username: '',
        password: ''
    });

    bot.on('log', console.log);
});


