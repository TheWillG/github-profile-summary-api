const { logger } = require("../../lib/config");

const postUserData = async (req, res) => {
  const { userName } = req.params;
  try {
    res.status(200).send();
  } catch (e) {
    logger.error(`report failed to be generated`, e);
    res.status(500).send(`report failed to be generated`);
  }
};

module.exports.postUserData = postUserData;
