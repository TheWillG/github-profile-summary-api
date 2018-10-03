const { celebrate, Joi } = require("celebrate");
const emailValidationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const postEmailData = celebrate({
  body: {
    senderEmail: Joi.string().required().regex(emailValidationRegex),
    recipientEmail: Joi.string().required().regex(emailValidationRegex),
    subject: Joi.string().required(),
    message: Joi.string().required()
  },
});

module.exports.postEmailData = postEmailData;
