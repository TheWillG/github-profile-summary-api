const express = require("express");
const githubController = require("./githubController");
const emailController = require("./emailController");
const githubValidator = require("./validators/github");
const emailValidator = require("./validators/email");

const router = express.Router();

router.get(
  "/github/userData/:userName",
  githubValidator.getUserData,
  githubController.getUserData
);

router.post(
  "/github/thumbsup/:username",
  githubValidator.postThumbsUp,
  githubController.postThumbsUp
);

router.post(
  "/github/firebaseCredentials",
  githubValidator.postFirebaseCredential,
  githubController.postFirebaseCredential
);

router.post(
  "/email/user",
  emailValidator.postEmailData,
  emailController.postEmailData
);

router.get("/ping", (req, res) => res.status(200).send());

module.exports = router;
