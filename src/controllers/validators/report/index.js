const { celebrate, Joi } = require("celebrate");

const postUserData = celebrate({
  params: {
    userName: Joi.string().required(),
  },
  body: {
    languageChart: Joi.string().dataUri().required(),
    commitChart: Joi.string().dataUri().required()
  }
});

module.exports.postUserData = postUserData;