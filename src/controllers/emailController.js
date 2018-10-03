const { logger } = require("../../lib/config");
const sendMail = require("../services/emailService");

const postEmailData = async (req, res) => {
  const { senderEmail, recipientEmail, message, subject } = req.body;
  try {
    const responseData = await sendMail(senderEmail, recipientEmail, message, subject);
    if (responseData.error) {
      logger.error(`Failed to send email to ${recipientEmail}`, responseData.error);
      res.status(500).send(responseData);
    }
    else {
      res.status(200).send(responseData);
    }
  } catch (e) {
    logger.error(`Failed to send email to ${recipientEmail}`, e);
    res.status(500).send(e);
  }
};

module.exports.postEmailData = postEmailData;
