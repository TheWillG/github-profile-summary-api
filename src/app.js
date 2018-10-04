const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const controllers = require("./controllers");
const { errors } = require("celebrate");
const { isTest } = require("../lib/config");

if(!isTest) mongoose.connect(mongoUrl);
const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/", controllers);
app.use(errors());

module.exports = app;
