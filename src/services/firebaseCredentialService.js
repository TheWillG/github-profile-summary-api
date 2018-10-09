const { FirebaseCredential } = require('../models/firebaseCredential');

const fetchFirebaseCredential = (query) => {
  return FirebaseCredential.findOne(query);
}
const createFirebaseCredential = (data) => {
  const firebaseCredential = new FirebaseCredential(data);
  return firebaseCredential.save();
}

const updateFirebaseCredential = (id, query) => {
  return FirebaseCredential.findByIdAndUpdate({_id: id}, query, {new: true});
}

const removeFirebaseCredential = async (query) => {
  return FirebaseCredential.deleteMany(query);
}

module.exports = {
  fetchFirebaseCredential,
  createFirebaseCredential,
  updateFirebaseCredential,
  removeFirebaseCredential
};