const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const controllers = require("./controllers");
const { errors } = require("celebrate");
const { whitelist, isProduction } = require("../lib/config");

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app = express();
app.use(helmet());
if (isProduction) {
  app.use(cors(corsOptions));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/", controllers);
app.use(errors());

module.exports = app;
