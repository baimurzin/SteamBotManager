var config = {};

config.bots = [
    {
        "Username":"BOT USERNAME",
        "Password":"BOT PASSWORD",
        "ApiKey":"Bot specific apiKey",
        "DisplayName":"TestBot",
        "ChatResponse":"Hi there bro",
        "logFile": "TestBot.log",
        "BotControlClass": "SteamBot.SimpleUserHandler",
        "MaximumTradeTime":180,
        "MaximumActionGap":30,
        "DisplayNamePrefix":"[AutomatedBot] ",
        "TradePollingInterval":800,
        "ConsoleLogLevel":"Success",
        "FileLogLevel":"Info",
        "AutoStart": "true",
        "SchemaLang":"en"
    },
    {
        "Username":"BOT USERNAME",
        "Password":"BOT PASSWORD",
        "ApiKey":"Bot specific apiKey",
        "DisplayName":"TestBot",
        "ChatResponse":"Hi there bro",
        "logFile": "TestBot.log",
        "BotControlClass": "SteamBot.SimpleUserHandler",
        "MaximumTradeTime":180,
        "MaximumActionGap":30,
        "DisplayNamePrefix":"[AutomatedBot] ",
        "TradePollingInterval":800,
        "ConsoleLogLevel":"Success",
        "FileLogLevel":"Info",
        "AutoStart": "true",
        "SchemaLang":"en"
    }
];

config.autoStartAll = true;
config.logFile = 'main.log';

module.exports = config;
