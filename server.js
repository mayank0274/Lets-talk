const express = require("express");
const app = express();
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// env variables config
dotenv.config();

//middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(cors());

//connection to db
require("./db/connection");

// routes
require("./routes/api")(app);

// error handling middleware
app.use(errorHandler);

const httpServer = app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});

// socket connection
require("./socketConn")(httpServer);
