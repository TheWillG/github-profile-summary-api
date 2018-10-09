const { celebrate, Joi } = require("celebrate");

const postEmailData = celebrate({
  body: Joi.object().keys({
    senderEmail: Joi.string().email().required(),
    recipientEmail: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required()
  }),
});

module.exports.postEmailData = postEmailData;
