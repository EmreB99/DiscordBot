const nodeMailer = require("nodemailer");

function sendBulkMail(callback) {
  if (typeof callback == "function") callback();
}

async function prepareMail(message, config, db) {
  let mailList = [];
  const transporter = nodeMailer.createTransport({
    host: config.mailAnnouncer[0].mailHost,
    port: config.mailAnnouncer[0].port,
    secure: false,
    auth: {
      user: config.mailAnnouncer[0].mailAddress,
      pass: config.mailAnnouncer[0].mailPassword,
    },
  });

  db.serialize(() => {
    const query = "SELECT * FROM users";

    db.all(query, (err, row) => {
      for (const user in row) {
        mailList.push(row[user].mail);
      }
      mailList = mailList.toString();

      let mailOptions = {
        from: config.discord[0].serverName,
        to: mailList,
        subject: "New Announcement!",
        text: message.content,
      };

      sendBulkMail(function () {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      });
    });
  });
}

module.exports = {
  name: "Mailer",
  description: "Bulk mail sender.",
  //We will check if the message is sent to the announcement channel
  //and to make sure that we dont send any messages sent by the bot.
  checkChannel(message) {
    const { config, db } = require("../app");

    if (
      message.author.bot === false &&
      message.channel.id === config.mailAnnouncer[0].announcementChannel &&
      config.mailAnnouncer[0].enabled === true
    ) {
      console.log(`Announcement received from: ${message.member.displayName}`);
      console.log("Announcement: ");
      console.log(message.content);
      console.log("Attempting to send mails...");
      prepareMail(message, config, db);
    }
  },
};
