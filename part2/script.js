import TelegramBot from "node-telegram-bot-api";
import { scrapeWebsite } from "./scrape.js";
import "dotenv/config";
import { checkCrypto } from "./utils.js";

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const cryptoNameList = [
  ["/fromBtc", "/toBtc", "Bitcoin"],
  ["/fromETH", "/toETH", "Ethereum"],
  ["/fromUSDT", "/toUSDT", "Tether USDt"],
  ["/fromBNB", "/toBNB", "BNB"],
  ["/fromSol", "/toSol", "Solana"],
  ["/fromXRP", "/toXRP", "XRP"],
  ["/fromUSDC", "/toUSDC", "USDC"],
  ["/fromCardano", "/toCardano", "Cardano"],
  ["/fromDodge", "/toDodge", "Dogecoin"],
  ["/fromAvalanche", "/toAvalanche", "Avalanche"],
];

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  if (message === "/start") {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "List Of Commands",
              callback_data: "listOfCmds",
            },
          ],
        ],
      },
    };
    bot.sendMessage(chatId, "Welcome to the bot", options);
  } else if (message === "/check") {
    const result = await scrapeWebsite();
    let resultStr = "";
    result.forEach((element) => {
      const cryptoName = element[0];
      const price = element[1];
      resultStr = resultStr + `${cryptoName} : ${price} \n`;
    });
    bot.sendMessage(chatId, resultStr);
  } else if (message === "/about") {
    bot.sendMessage(
      chatId,
      "This bot is made by @ko_bit_fetch. \n Github : https://github.com/nyilynnhtwe \n LinkedIn : https://www.linkedin.com/in/nyilynnhtwe/"
    );
  } else if (message === "/toUSD") {
    let msg = "Available commands to convert to a specific crypto to USD$\n";
    cryptoNameList.forEach((element) => {
      msg = msg + element[0] + " number of crypto" + "\n";
    });
    bot.sendMessage(chatId, msg);
  } else if (message === "/fromUSD") {
    let msg = "Available commands to convert to USD$ from a specific crypto\n";
    cryptoNameList.forEach((element) => {
      msg = msg + element[1] + " USD$" + "\n";
    });
    bot.sendMessage(chatId, msg);
  } 
  
  
  
  else if (message.startsWith("/to")) {
    const command = message.split(" ")[0];
    const usd = parseFloat(message.split(" ")[1]);
    const cryptoPriceList = await scrapeWebste();
    const obj = checkCrypto(cryptoNameList, command, cryptoPriceList);
    console.log(usd);
    console.log(obj);
    console.log(usd/obj.price);
    const result = `${usd} USD $ : ${(usd / obj.price).toFixed(3)} ${obj.name}`;
    bot.sendMessage(chatId, result);
  } else if (message.startsWith("/from")) {
    const command = message.split(" ")[0];
    const crypto = parseFloat(message.split(" ")[1]);
    const cryptoPriceList = await scrapeWebste();
    const obj = checkCrypto(cryptoNameList, command, cryptoPriceList);
    const result = `${crypto} ${obj.name} : ${(crypto * obj.price).toFixed(3)} USD$`;
    bot.sendMessage(chatId, result);
  } else {
    bot.sendMessage(chatId, "Invalid command");
  }
});

bot.on("callback_query", (callback_query) => {
  const data = callback_query.data;
  const chatId = callback_query.message.chat.id;
  switch (data) {
    case "listOfCmds":
      const presentation = `1. /check : To check all the crypto prices\n2. /toUSD : To get all the available commands to convert to USD$ from a specific crypto.\n3. /fromUSD : To get all the available commands to convert to a specific crypto to USD$\n4. /about : To read info about the developer`;
      bot.sendMessage(chatId, presentation);
      break;
    default:
      break;
  }
});

bot.on("polling_error", (msg) => console.log(msg));
