const app = require("./src/app");
const { logger, port } = require("./lib/config");

app.listen(port);
logger.info(`App listening on port ${port}!`);
