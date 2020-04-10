module.exports = {
  name: "clear",
  description: "To clean the chat.",
  execute(message, args1, args2) {
    if (!args1[0]) {
      message.channel.send(
        "Please provide a proper amount of messages required to be deleted."
      );
      return message.channel.send("Example: !clear 10");
    } else if (args1[0] > 100) {
      return message.channel.send(
        "Please don't provide a number bigger than 100. Our bot is running on a very small server and it crashes if given a high volume of tasks..."
      );
    } else if (isNaN(args1[0])) {
      return message.channel.send(
        "Not a proper value. Please provide a number! Use !help for help if needed."
      );
    }

    message.channel.bulkDelete(args1[0]);
  },
};
