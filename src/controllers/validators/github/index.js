const { celebrate, Joi } = require("celebrate");

const getUserData = celebrate({
  params: {
    userName: Joi.string().required(),
  },
});

const getRecommendations = celebrate({
  params: {
    userName: Joi.string().required(),
  }
});

const postRecommendations = celebrate({
  params: {
    userName: Joi.string().required(),
  },
  body: Joi.object().keys({
    firebaseUid: Joi.string().required()
  }),
});

const postFirebaseCredential = celebrate({
  body: Joi.object().keys({
    firebaseUid: Joi.string().required().required(),
    accessToken: Joi.string().token().required()
  }),
});

module.exports.getUserData = getUserData;
module.exports.getRecommendations = getRecommendations;
module.exports.postRecommendations = postRecommendations;
module.exports.postFirebaseCredential = postFirebaseCredential;