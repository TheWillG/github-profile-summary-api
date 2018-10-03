const fetch = require("cross-fetch");
const gql = require("graphql-tag");
const request = require("request-promise");
const { ApolloClient } = require("apollo-boost");
const { HttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { githubUserAccessToken, logger } = require("../../lib/config");
const {
  formatEvents,
  calcLanguagePercentsForRepo,
  calcLanguagePercentsForUser,
  formatCommits
} = require("../helpers/dataFormatHelper");

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    fetch,
    headers: {
      authorization: `Bearer ${githubUserAccessToken}`
    }
  }),
  cache: new InMemoryCache()
});

const reflect = p =>
  p.then(value => ({ value, status: "resolved" }), e => ({ e, status: "rejected" }));

const getEventRequestOptions = (userName, page) => {
  return {
    uri: `https://api.github.com/users/${userName}/events/public?page=${page}`,
    headers: {
      authorization: `Bearer ${githubUserAccessToken}`,
      "User-Agent": "TheWillG"
    },
    json: true
  };
};

const getUserData = async userName => {
  const graphQlResponsePromise = client.query({
    query: gql`{
            rateLimit {
              remaining
            }
            user(login: ${userName}) {
                id
                login
                name
                bio
                url
                company
                websiteUrl
                email
                createdAt
                location
                avatarUrl
                isBountyHunter
                isHireable
                followers {
                  totalCount
                }
                following {
                  totalCount
                }
                starredRepositories {
                  totalCount
                }
                repositories(privacy: PUBLIC, first: 30, orderBy: { field: UPDATED_AT, direction: DESC }) {
                  totalCount
                  edges {
                    node {
                      name
                      url
                      description
                      updatedAt
                      languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
                        edges {
                          node {
                            color
                            name
                          }
                        }
                      }
                      stargazers {
                        totalCount
                      }
                    }
                  }
                }
                gists(privacy: PUBLIC) {
                  totalCount
                }
                issues {
                  totalCount
                }
                pullRequests {
                  totalCount
                }
            }
        }`
  });

  // Run these requests in parallel, avoid fail-fast
  const [graphQlResponse, ...eventsPages] = await Promise.all(
    [
      graphQlResponsePromise,
      request(getEventRequestOptions(userName, 1)),
      request(getEventRequestOptions(userName, 2)),
      request(getEventRequestOptions(userName, 3)),
      request(getEventRequestOptions(userName, 4)),
      request(getEventRequestOptions(userName, 5)),
      request(getEventRequestOptions(userName, 6)),
      request(getEventRequestOptions(userName, 7)),
      request(getEventRequestOptions(userName, 8))
    ].map(reflect)
  );
  const events = eventsPages
    .filter(event => event.status === "resolved")
    .map(event => formatEvents(event.value))
    .reduce((combined, event) => [...combined, ...event], []);

  if (graphQlResponse.status === "rejected") {
    console.log("graphQlResponse.e", graphQlResponse.e);
    throw new Error("Could not retrieve user");
  }

  const { repoLanguagePercents, userLanguagePercents } = await getLanguageData(
    userName,
    graphQlResponse.value.data.user.repositories.edges
  );

  const totalStars = await getStarGazers(
    graphQlResponse.value.data.user.repositories.edges
  );

  const userData = Object.assign(
    {},
    {
      ...graphQlResponse.value.data.user
    },
    {
      events: events.slice(0, 10),
      commits: formatCommits(events),
      topLanguage: calcTopLanguage(userLanguagePercents),
      repoLanguagePercents,
      userLanguagePercents,
      totalStars: totalStars
    }
  );
  logger.info(`User Requested: ${userName}`);
  logger.info(`Remaining Limit: ${graphQlResponse.value.data.rateLimit.remaining}`);

  return userData;
};

const getLanguageData = async (userName, repos) => {
  const repoLanguagePercents = [];
  let totalBytes = 0;
  for (const { node } of repos) {
    const repoOwnerReg = /https\:\/\/github.com\/(.*?)\/.*$/.exec(node.url);
    let repoOwner = userName;
    if (repoOwnerReg.length > 1) {
      repoOwner = repoOwnerReg[1];
    }
    const languageRequestOptions = {
      uri: `https://api.github.com/repos/${repoOwner}/${node.name}/languages`,
      headers: {
        authorization: `Bearer ${githubUserAccessToken}`,
        "User-Agent": "TheWillG"
      },
      json: true
    };
    try {
      let res = await request(languageRequestOptions);
      totalBytes += Object.keys(res).reduce((total, key) => total + res[key], 0);
      const languages = calcLanguagePercentsForRepo(res);
      repoLanguagePercents.push({ repo: node.name, languages });
    } catch (e) {
      logger.error(`Error getting language data ${JSON.stringify(e)}`);
    }
  }
  const userLanguagePercents = calcLanguagePercentsForUser(totalBytes, repoLanguagePercents);
  return { repoLanguagePercents, userLanguagePercents };
};

const calcTopLanguage = userLanguagePercents => {
  const sortedLanguages = userLanguagePercents.sort((a, b) => b.percent - a.percent);
  return sortedLanguages[0] ? sortedLanguages[0].name : '';
};

const getStarGazers = async (repos) => {
  return repos.map(x => x.node.stargazers.totalCount).reduce((x, y) => x + y);
};

module.exports = getUserData;
