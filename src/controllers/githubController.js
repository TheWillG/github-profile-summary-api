const { logger } = require('../../lib/config');
const { getData, validateGitHubAccessToken } = require('../services/githubService');
const { fetchUser, createUser } = require('../services/userService');

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

const postThumbsUp = async (req, res) => {
  const { userName } = req.params;
  const { accessToken } = req.body;
  try {
    const rater = await validateGitHubAccessToken(accessToken);
    const existingUser = await fetchUser({ userName });
    if(existingUser) {
      if(existingUser.raters.indexOf(rater.user.login) > -1) {
        return res.status(400).send("You have already thumbed up this user!")
      } else {
        existingUser.thumbs += 1;
        existingUser.raters.push(rater.user.login);
        await existingUser.save();
        return status(200).send('Thumbs up added')
      }
    } else {
      await createUser({ username, thumbs: 1, raters: [rater.user.login] });
      return res.status(200).send('User received their first thumbs up!');
    }
  } catch (e) {
    logger.error('Failed to authenticate userAccessToken', e);
    res.status(401).send('Failed to authenticate userAccessToken');
  }
};

module.exports.getUserData = getUserData;
module.exports.postThumbsUp = postThumbsUp;
