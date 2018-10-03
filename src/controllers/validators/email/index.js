const { celebrate, Joi } = require("celebrate");

const postEmailData = celebrate({
  body: {
    senderEmail: Joi.string().email().required(),
    recipientEmail: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required()
  },
});

module.exports.postEmailData = postEmailData;
