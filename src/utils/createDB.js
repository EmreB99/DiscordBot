//A simple utility tool to create the necessary tables inside database.

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/database/discord.db");

module.exports = {
  createTable() {
    db.serialize(() => {
      db.run(
        "CREATE TABLE users (id TEXT, firstName TEXT, lastName TEXT, mail TEXT, date TEXT)"
      );

      db.close();
      console.log("Database initialization complete!")
    });
  },
};
