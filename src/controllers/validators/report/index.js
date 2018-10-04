const { celebrate, Joi } = require("celebrate");

const postUserData = celebrate({
  params: {
    userName: Joi.string().required(),
  },
  body: {
    languageChart: Joi.string().dataURI().required(),
    commitChart: Joi.string().dataURI().required()
  }
});

module.exports.postUserData = postUserData;