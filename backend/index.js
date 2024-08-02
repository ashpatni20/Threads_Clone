const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./db");

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8080

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
