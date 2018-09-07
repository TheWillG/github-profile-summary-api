const dotenv = require('dotenv');
const log4js = require('log4js');

dotenv.config({ path: `${process.cwd()}/env` });
const logger = log4js.getLogger();

logger.level = process.env.LOGGER_LEVEL || "info";
const port = process.env.PORT || 3000;
const githubUserAccessToken = process.env.GITHUB_USERACCESS_TOKEN;

module.exports.port = port;
module.exports.logger = logger;
module.exports.githubUserAccessToken = githubUserAccessToken;
