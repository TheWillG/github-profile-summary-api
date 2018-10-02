const { logger } = require("../../lib/config");
const sendMail = require("../services/emailService");

const postEmailData = async (req, res) => {
  const { senderEmail, message, subject } = req.body;
  try {
    const responseData = await sendMail(senderEmail, message, subject);
    if (responseData.error) {
      logger.error(`Failed to send email to ${senderEmail}`, responseData.error);
      res.status(500).send(responseData);
    }
    else {
      res.status(200).send(responseData);
    }
  } catch (e) {
    logger.error(`Failed to send email to ${senderEmail}`, e);
    res.status(500).send(e);
  }
};

module.exports.postEmailData = postEmailData;
