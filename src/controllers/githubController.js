const { logger } = require('../../lib/config');
const { getUser, validateGitHubAccessToken } = require('../services/githubService');
const { fetchUser, createUser } = require('../services/userService');
const { fetchFirebaseCredential, createFirebaseCredential, removeFirebaseCredential } = require('../services/firebaseCredentialService');

const getUserData = async (req, res) => {
  const { userName } = req.params;
  try {
    const userData = await getUser(userName);
    return res.status(200).send(userData);
  } catch (e) {
    logger.error(`Failed to get github user data with userName ${userName}`, e);
    return res.status(e.message.includes('retrieve') ? 400 : 500).send(e);
  }
};

const postThumbsUp = async (req, res) => {
  const { userName } = req.params;
  const { firebaseUid } = req.body;
  let rater;
  try {
    const existingFirebaseCredential = fetchFirebaseCredential({ firebaseUid });
    if(!existingFirebaseCredential) return res.status(404).send('FirebaseUid does not exist');
    try {
      rater = await validateGitHubAccessToken(existingFirebaseCredential.githubAccessToken);
    } catch(e) {
      removeFirebaseCredential(existingFirebaseCredential.id);
      logger.error('Failed to validate accessToken with this firebaseUid', e);
      return res.status(401).send('Failed to validate accessToken with this firebaseUid');
    }
    const existingUser = await fetchUser({ userName });
    if(existingUser) {
      if(existingUser.raters.indexOf(rater.user.login) > -1) {
        return res.status(400).send("You have already thumbed up this user!")
      } else {
        existingUser.thumbs += 1;
        existingUser.raters.push(rater.user.login);
        await existingUser.save();
        return res.status(200).send('Thumbs up added')
      }
    } else {
      await createUser({ username, thumbs: 1, raters: [rater.user.login] });
      return res.status(200).send('User received their first thumbs up!');
    }
  } catch (e) {
    logger.error('Failed to authenticate firebaseUid', e);
    return res.status(401).send('Failed to authenticate firebaseUid');
  }
};

const postFirebaseCredential = async (req, res) => {
  const { accessToken, firebaseUid } = req.body;
  try {
    await createFirebaseCredential({ accessToken, firebaseUid });
  } catch (e) {
    logger.error('Failed to add accessToken', e);
    return res.status(500).send('Failed to add accessToken');
  }
};

module.exports.getUserData = getUserData;
module.exports.postThumbsUp = postThumbsUp;
module.exports.postFirebaseCredential = postFirebaseCredential;
