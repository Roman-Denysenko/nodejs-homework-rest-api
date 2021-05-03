const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const contactsRouter = require("./routes/api/contacts/contacts.js");
const usersRouter = require("./routes/api/users/users.js");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors());
app.use(express.json({ limit: 100000 }));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(500).json({
    status: status === 500 ? "fail" : "error",
    code: status,
    message: err.message,
  });
});

module.exports = app;
