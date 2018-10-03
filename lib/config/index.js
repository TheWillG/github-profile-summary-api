const dotenv = require('dotenv');
const log4js = require('log4js');

dotenv.config({ path: `${process.cwd()}/env` });
const logger = log4js.getLogger();

logger.level = process.env.LOGGER_LEVEL || "info";
const port = process.env.PORT || 3000;
const githubUserAccessToken = process.env.GITHUB_USERACCESS_TOKEN;
const mailgunApiKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const eventTypes = ['IssuesEvent', 'CreateEvent', 'PullRequestEvent', 'PullRequestReviewEvent', 'PushEvent', 'WatchEvent'];
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

module.exports.port = port;
module.exports.logger = logger;
module.exports.githubUserAccessToken = githubUserAccessToken;
module.exports.mailgunApiKey = mailgunApiKey;
module.exports.mailgunDomain = mailgunDomain;
module.exports.eventTypes = eventTypes;
module.exports.isProduction = isProduction;
module.exports.isDevelopment = isDevelopment;
module.exports.isTest = isTest;
