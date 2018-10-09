# GitHub Profile Summary Backend
Powered by [https://nodejs.org/](NodeJS), [http://expressjs.com/](Express), and [https://github.com/hapijs/joi](Joi).

The web app is hosted at [https://githubprofilesummary.com](https://www.githubprofilesummary.com/) on [Netlify](https://www.netlify.com/).

This API is hosted on [Google App Engine](https://cloud.google.com/appengine/).

Frontend React app for this project is located here: https://github.com/theblindprophet/github-profile-summary.

## Install

`git clone https://github.com/TheWillG/github-profile-summary-api.git`

`cd github-profile-summary-api`

`npm install`

## Run

`npm run start`

## Testing

`npm run test`

Tests are located at *\_\_tests__*

## Environment

| Name | Description | Example |
|------|-------------|--------|
| PORT | Port the app is run on. | 3000 |
| LOGGER_LEVEL | Logger level configuration used by `log4js` package | info |
| GITHUB_USERACCESS_TOKEN | Access token used to read from the Github API | 123456abcdef
| MAILGUN_API_KEY | Mailgun API Key required to send mail | 123456abcdef
| MAILGUN_DOMAIN | Mailgun Domain name required to send mail | subdomain.domain.com
| GITHUB_CLIENT_ID | GitHub client id | xxx |
| GITHUB_CLIENT_SECRET | GitHub client secret | xxx |
| MONGO_URL | MongoDB URL | xxx |

`GITHUB_USERACCESS_TOKEN` can be obtained [here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

The environment variables are encrypted from *env* to *env.enc*.

## CI/CD

We use Google Cloud Build and Google App Engine for continuous integration and deployment.

| File | Description |
|------|-------------|
| *app.yaml* | Configurations for deployment on Google App Engine |
| *cloudbuild.yaml* | Configurations for integration testing, **non**-master branch, on Google Cloud Build |
| *cloudbuild.prod.yaml* | Configurations for integration testing, master branch, on Google Cloud Build |

**These files should be NOT edited by anyone except the original maintainers.**

Our Google App Engine and Google Cloud Project have also been configured to help with the CI/CD pipeline.

## Contributing

We are always willing to accept contributions to this project.

## Contributors

[Will Garcia](https://github.com/thewillg/) ([LinkedIn](https://www.linkedin.com/in/thewillg/))

[Jamie Gross](https://github.com/theblindprophet/) ([LinkedIn](https://www.linkedin.com/in/james-l-gross/))
