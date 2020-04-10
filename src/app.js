console.log("Bot starting...");
process.title = "Discord Bot by Emre Bugday";

const fs = require("fs");
const Discord = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const config = require("../src/config.json");
const mailer = require("../src/misc/Mailer.js");

//Setting up the database if it does not exist.
if (fs.existsSync("src/database/discord.db") === false) {
  console.log("No database found. Creating a new one...");
  const createDB = require("../src/utils/createDB.js");
  createDB.createTable();
}

const db = new sqlite3.Database("src/database/discord.db");

client = new Discord.Client();

client.login(config.discord[0].token);

let commands = new Map();

client.on("ready", async () => {
  console.log("Bot connected!");
  console.log("Loading commands to memory...");
  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".js"));

  let loadedCommands = [];

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    loadedCommands.push(command.name);
  }
  console.log("Loaded commands: ");
  console.log(loadedCommands);
});

//When a new person have joined the Discord server.
client.on("guildMemberAdd", (member) => {
  const userWelcomer = require("./misc/userWelcomer.js");
  const registerConfig = config.register[0];
  //All the database checks will be done at the newUser function.
  userWelcomer.newUser(member, registerConfig);
});

client.on("message", async (message) => {
  const prefix = config.discord[0].prefix;
  mailer.checkChannel(message);

  if (message.author.bot || !message.content.startsWith(prefix)) return;
  //If for some reason member is not registered correctly.
  //This is a known issue in Discord.JS due to caching issues.
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args1 = message.content.toLowerCase().slice(prefix.length).split(" ");
  //This argument is for commands that can't be separated by space.
  const args2 = message.content.toLowerCase().slice(prefix.length).split("---");
  const commandName = args1.shift().toLowerCase();

  //Checking if there is such a command with that name.
  if (!commands.has(commandName)) return;
  const command = commands.get(commandName);
  command.execute(message, args1, args2);
});

//If pressed CTRL+C
process.on("SIGINT", function () {
  console.log("Initiating exit procedures...");
  db.close();
  console.log("Exit successful!");
  process.exit(0);
});

module.exports = { client, config, db };
