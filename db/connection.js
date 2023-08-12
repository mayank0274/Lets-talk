const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_CONN_URL).then(() => {
  console.log("connection to db success");
}).catch((err) => {
  console.log("connection to db failed");
})