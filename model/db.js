const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.DB_HOST;

const db = mongoose.connect(uriDb, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("error", (err) =>
  console.log(`Mongoose error: ${err.message}`)
);

mongoose.connection.on("disconnected", () =>
  console.log(`Mongoose disconnected`)
);

process.on("SIGINT", async () => {
  mongoose.connection.close("SIGINT", () => {
    console.log("Connection to DB closed and app termination");
    process.exit(1);
  });
});

module.exports = db;
