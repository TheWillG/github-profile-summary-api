const { logger } = require("../../lib/config");

const postUserData = async (req, res) => {
  const { userName } = req.params;
  try {
    res.status(200).send();
  } catch (e) {
    logger.error(`Failed to post github user data with userName ${userName}`, e);
    res.status(e.message.includes('retrieve') ? 400 : 500).send(e);
  }
};

module.exports.postUserData = postUserData;
