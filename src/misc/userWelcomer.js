const app = require("../app.js");

function welcomeUser(callback) {
  if (typeof callback == "function") callback();
}

function databaseQuery(callback) {
  if (typeof callback == "function") callback();
}

module.exports = {
  newUser(member, config) {
    welcomeUser(function () {
      const channel = member.guild.channels.get(config.welcomeChannel);
      const welcomeMessage = config.welcomeMessage;
      const id = member.user.id;

      if (!config.require) {
        member.addRole(config.authorizedRole);
        channel.send(`Hey there, <@${id}> \n ${welcomeMessage}`);
        return;
      }

      databaseQuery(() => {
        app.db.all(
          "SELECT * FROM users WHERE id=$id",
          {
            $id: id,
          },
          (error, rows) => {
            const channel = member.guild.channels.get(config.welcomeChannel);
            if (rows.length > 0) {
              console.log(
                "Already registered user has rejoined to the server!"
              );
              console.log(`User name: ${member.displayName}`);
              channel.send(
                `<@${member.user.id}> You are already registered in the database. Welcome back!`
              );
              member.addRole(config.authorizedRole);
            } else {
              channel.send(`Hey there, <@${id}> \n ${welcomeMessage}`);
            }
          }
        );
      });
    });
  },
};
