const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const firebaseCredentialSchema = new Schema({
  firebaseUid: String,
  accessToken: String,
});
const FirebaseCredential = mongoose.model("FirebaseCredential", firebaseCredentialSchema);

module.exports = {
  FirebaseCredential
};
