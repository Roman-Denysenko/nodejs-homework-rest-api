const app = require("../app");
const db = require("../service/db.js");

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, function () {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) =>
  console.log(`Server not running. Error message: ${err.message}`)
);
