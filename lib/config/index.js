const dotenv = require('dotenv');
const log4js = require('log4js');

dotenv.config({ path: `${process.cwd()}/env` });
const logger = log4js.getLogger();

logger.level = process.env.LOGGER_LEVEL || "info";
const port = process.env.PORT || 3000;
let githubUserAccessToken = process.env.GITHUB_USERACCESS_TOKEN;
let mailgunApiKey = process.env.MAILGUN_API_KEY;
let mailgunDomain = process.env.MAILGUN_DOMAIN;
const whitelist = ['https://githubprofilesummary.com/', 'localhost:3000', 'https://www.githubprofilesummary.com'];
const eventTypes = ['IssuesEvent', 'CreateEvent', 'PullRequestEvent', 'PullRequestReviewEvent', 'PushEvent', 'WatchEvent'];
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

if (isTest) {
  githubUserAccessToken = 'test';
  mailgunApiKey = 'test';
  mailgunDomain = 'test';
}

module.exports.port = port;
module.exports.logger = logger;
module.exports.githubUserAccessToken = githubUserAccessToken;
module.exports.mailgunApiKey = mailgunApiKey;
module.exports.mailgunDomain = mailgunDomain;
module.exports.whitelist = whitelist;
module.exports.eventTypes = eventTypes;
module.exports.isProduction = isProduction;
module.exports.isDevelopment = isDevelopment;
module.exports.isTest = isTest;
