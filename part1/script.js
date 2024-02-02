const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
    if(message==="/start")
    {
        bot.sendMessage(chatId,"Welcome to the bot");
    }
    else if(message.startsWith("/age"))
    {
        const inputArr = message.split("\n");
        const userAge = parseInt(inputArr[1]);
        const result = userAge>=18?"You are adult":"You are not adult";
        bot.sendMessage(chatId,result);
    }
    else
    {
        bot.sendMessage(chatId,"Invalid command");
    }
});
