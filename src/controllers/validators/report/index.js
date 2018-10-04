const { celebrate, Joi } = require("celebrate");

const postUserData = celebrate({
  params: {
    userName: Joi.string().required(),
  },
});

module.exports.postUserData = postUserData;