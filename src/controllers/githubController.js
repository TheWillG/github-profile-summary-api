const { logger } = require("../../lib/config");
const getData = require("../services/githubService");

const getUserData = async (req, res) => {
  const { userName } = req.params;
  try {
    const userData = await getData(userName);
    res.status(200).send(userData);
  } catch (e) {
    logger.error(`Failed to get github user data with userName ${userName}`, e);
    res.status(e.message.includes('retrieve') ? 400 : 500).send(e);
  }
};

module.exports.getUserData = getUserData;
