const { User } = require('../models/user');

const fetchUser = (query) => {
  return User.findOne(query);
}
const createUser = (data) => {
  const user = new User(data);
  return user.save();
}

const updateUser = (id, query) => {
  return User.findByIdAndUpdate({_id: id}, query, {new: true});
}

module.exports = {
  fetchUser,
  createUser,
  updateUser
};