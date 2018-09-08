const express = require("express");
const githubController = require("./githubController");
const githubValidator = require("./validators/github");
const { getPing } = require("./pingController");

const router = express.Router();

router.get(
  "/github/userData/:userName",
  githubValidator.getUserData,
  githubController.getUserData
);

router.get("/ping", getPing);

module.exports = router;
