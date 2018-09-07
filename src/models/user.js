const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const userSchema = new Schema({
  email: String,
  password: String,
});
mongoose.model("User", userSchema);

module.exports = userSchema;
