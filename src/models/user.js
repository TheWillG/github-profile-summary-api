const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  userName: String,
  raters: [String],
  recommendations: { type: Number, default: 0 }
});
const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
