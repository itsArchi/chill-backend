const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection, Crash");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
