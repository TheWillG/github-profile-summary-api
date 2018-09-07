const express = require("express");
const githubController = require("./githubController");
const githubValidator = require("./validators/github");

const router = express.Router();

router.get(
  "/github/userData/:userName",
  githubValidator.getUserData,
  githubController.getUserData
);

module.exports = router;
