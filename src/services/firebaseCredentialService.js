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

const removeFirebaseCredential = (id) => {
  return FirebaseCredential.findByIdAndRemove({_id: id});
}

module.exports = {
  fetchFirebaseCredential,
  createFirebaseCredential,
  updateFirebaseCredential,
  removeFirebaseCredential
};