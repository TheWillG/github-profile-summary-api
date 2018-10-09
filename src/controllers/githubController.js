const { logger } = require('../../lib/config');
const { getUser, validateAccessToken } = require('../services/githubService');
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

const getRecommendations = async (req, res) => {
  const { userName } = req.params;
  try {
    const existingUser = await fetchUser({ userName: userName.toLowerCase() });
    if (!existingUser) {
      return res.status(404).send({ error: `User with username, ${userName}, not found` });
    }
    return res.status(200).send({ total: existingUser.recommenders.length });
  } catch (e) {
    logger.error(`Failed to get recommendations up data with userName ${userName}`, e);
    return res.status(e.message.includes('retrieve') ? 400 : 500).send(e);
  }
};

const postRecommendations = async (req, res) => {
  const { userName } = req.params;
  const { firebaseUid } = req.body;
  let recommender;
  try {
    const existingFirebaseCredential = await fetchFirebaseCredential({ firebaseUid });
    if(!existingFirebaseCredential) return res.status(404).send({ error: 'FirebaseUid does not exist' });
    try {
      recommender = await validateAccessToken(existingFirebaseCredential.accessToken);
    } catch(e) {
      removeFirebaseCredential({ accessToken: existingFirebaseCredential.accessToken });
      logger.error('Failed to validate accessToken with this firebaseUid', e);
      return res.status(401).send({ error: 'Failed to validate accessToken with this firebaseUid' });
    }
    const existingUser = await fetchUser({ userName: userName.toLowerCase() });
    if(existingUser) {
      if(existingUser.recommenders.indexOf(recommender.user.login) > -1) {
        return res.status(400).send({ error: 'You have already recommended up this user!' })
      } else {
        existingUser.recommenders.push(recommender.user.login);
        await existingUser.save();
        return res.status(200).send({ message: 'Recommendation added' })
      }
    } else {
      await createUser({ userName: userName.toLowerCase(), recommenders: [recommender.user.login] });
      return res.status(200).send({ message: 'User received their first recommendation!' });
    }
  } catch (e) {
    logger.error('Failed to authenticate firebaseUid', e);
    return res.status(401).send({ error: 'Failed to authenticate firebaseUid' });
  }
};

const postFirebaseCredential = async (req, res) => {
  const { accessToken, firebaseUid } = req.body;
  try {
    await createFirebaseCredential({ accessToken, firebaseUid });
  } catch (e) {
    logger.error('Failed to add accessToken', e);
    return res.status(500).send({ error: 'Failed to add accessToken' });
  }
};

module.exports.getUserData = getUserData;
module.exports.getRecommendations = getRecommendations;
module.exports.postRecommendations = postRecommendations;
module.exports.postFirebaseCredential = postFirebaseCredential;
