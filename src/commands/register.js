const app = require("../app.js");

function registerUserToDB(callback) {
  if (typeof callback == "function") callback();
}

function serializeQuery(message, args1, args2) {
  const id = message.author.id;
  const firstName = args2[1];
  const lastName = args2[2];
  const mail = args2[3];
  const date = new Date().toISOString().slice(0, 10);

  app.db.serialize(() => {
    app.db.all(
      //SQL query
      "SELECT * FROM users WHERE id=$id",
      //Parameters to pass into query
      {
        $id: id,
      },
      (err, rows) => {
        //If the query returns an empty array that means user does not exists in the database.
        //So we can proceed with the registration.
        if (!rows.length > 0) {
          app.db.run(
            "INSERT INTO users VALUES($id, $firstName, $lastName, $mail, $date)",
            {
              $id: id,
              $firstName: firstName,
              $lastName: lastName,
              $mail: mail,
              $date: date,
            }
          );
          message.reply("Registration complete!");
          message.member.addRole(app.config.register[0].authorizedRole);
          message.member.setNickname(`${firstName} ${lastName}`);
        } else return message.reply("You are already registered!");
      }
    );
  });
}

//
//
//

module.exports = {
  name: "register",
  description: "To register a new account into the database.",
  execute(message, args1, args2) {
    const config = app.config;
    const isRegisterRequired = config.register[0].require;
    if (!isRegisterRequired)
      return message.reply(
        `Registration is not enabled in ${message.guild.name}`
      );

    registerUserToDB(function () {
      //Standard input checks to make sure that all args are provided.
      if (!args2[1]) {
        return message.channel.send(
          "Please provide a proper first name for registration."
        );
      } else if (!args2[2]) {
        return message.channel.send(
          "Please provide a proper last name for registration."
        );
      } else if (!args2[3] || !args2[3].includes("@")) {
        return message.channel.send(
          "Please provide an email for registration."
        );
      }

      serializeQuery(message, args1, args2);
    });
  },
};
