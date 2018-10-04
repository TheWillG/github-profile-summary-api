const express = require("express");
const githubController = require("./githubController");
const emailController = require("./emailController");
const githubValidator = require("./validators/github");
const emailValidator = require("./validators/email");

const reportController = require("./reportController");
const reportValidator = require("./validators/report");


const router = express.Router();

router.get(
  "/github/userData/:userName",
  githubValidator.getUserData,
  githubController.getUserData
);

router.post(
  "/email/user",
  emailValidator.postEmailData,
  emailController.postEmailData
);

router.post(
  "/github/userData/:userName/report",
  reportValidator.postGenerateReport,
  reportController.postGenerateReport
);

router.get("/ping", (req, res) => res.status(200).send());

module.exports = router;
