const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  userName: String,
  recommenders: [String]
});
const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
