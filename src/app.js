const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const controllers = require("./controllers");
const { errors } = require("celebrate");
const { whitelist } = require("../lib/config")
const { isProduction } = require("../lib/config")


var corsOptions = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error('Not allowed by CORS'));
    }
  }
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errors());
if(isProduction) app.use(cors(corsOptions));

module.exports = app;
