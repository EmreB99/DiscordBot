module.exports = {
  name: "status",
  description: "To check if the bot is responsive.",
  execute(message, args1, args2) {
    message.channel.send("Bot is up and running!");
  },
};
