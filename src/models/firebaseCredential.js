const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const firebaseCredentialSchema = new Schema({
  firebaseUid: String,
  githubAccessToken: String,
});
const FirebaseCredential = mongoose.model("FirebaseCredential", firebaseCredentialSchema);

module.exports = {
  FirebaseCredential
};
