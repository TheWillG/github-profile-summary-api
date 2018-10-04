const { celebrate, Joi } = require("celebrate");

const getUserData = celebrate({
  params: {
    userName: Joi.string().required(),
  },
});

const postThumbsUp = celebrate({
  params: {
    userName: Joi.string().required(),
  },
  body: Joi.object().keys({
    accessToken: Joi.string().token().required()
  }),
});

module.exports.getUserData = getUserData;
module.exports.postThumbsUp = postThumbsUp;