const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const controllers = require("./controllers");
const { errors } = require("celebrate");

const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/", controllers);
app.use(errors());

module.exports = app;
