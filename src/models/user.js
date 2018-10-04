const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  raters: [String],
  thumbs: { type: Number, default: 0 }
});
const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
