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
    firebaseUid: Joi.string().required()
  }),
});

const postFirebaseCredential = celebrate({
  body: Joi.object().keys({
    firebaseUid: Joi.string().required(),
    accessToken: Joi.string().token().required()
  }),
});

module.exports.getUserData = getUserData;
module.exports.postThumbsUp = postThumbsUp;
module.exports.postFirebaseCredential = postFirebaseCredential;