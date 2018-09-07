const { celebrate, Joi } = require("celebrate");

const getUserData = celebrate({
  params: {
    userName: Joi.string().required(),
  },
});

module.exports.getUserData = getUserData;