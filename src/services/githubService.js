const fetch = require("cross-fetch");
const gql = require("graphql-tag");
const request = require("request-promise");
const { ApolloClient } = require("apollo-boost");
const { HttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { githubUserAccessToken, logger, eventTypes } = require("../../lib/config");

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

const getUserData = async userName => {

  const eventRequestOptions = {
    uri: `https://api.github.com/users/${userName}/events/public`,
    headers: {
      authorization: `Bearer ${githubUserAccessToken}`,
      "User-Agent": "TheWillG"
    },
    json: true
  };

  // Run both API requests in parallel
  const eventsPromise = request(eventRequestOptions);
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

  // Wait for all async calls to return
  const graphQlResponse = await graphQlResponsePromise;
  const repoLanguagePercents = await getLanguageData(userName, graphQlResponse.data.user.repositories.edges);
  const events = await eventsPromise;

  const userData = Object.assign({
    ...graphQlResponse.data.user
  }, {
    events: formatEvents(events),
    repoLanguagePercents
  });
  logger.info(`User Requested: ${userName}`);
  logger.info(`Remaining Limit: ${graphQlResponse.data.rateLimit.remaining}`);

  return userData;
};

const formatEvents = events => {
  return events.filter(event => eventTypes.includes(event.type))
          .map(({ type, repo, payload, created_at }) => {
            let obj = {
              type,
              repo,
              action: payload.action,
              ref_type: payload.ref_type,
              created_at
            }
            if (payload.pull_request) {
              obj = Object.assign(obj, { merged: payload.pull_request.merged_at != null });
            }
            return obj;
          })
          .slice(0, 10);
};

const getLanguageData = async (userName, repos) => {
  const languagePercents = {};
  for(const { node } of repos) {
    const languageRequestOptions = {
      uri: `https://api.github.com/repos/${userName}/${node.name}/languages`,
      headers: {
        authorization: `Bearer ${githubUserAccessToken}`,
        "User-Agent": "TheWillG"
      },
      json: true
    };
    try {
      let res = await request(languageRequestOptions);
      res = calcLanguagePercents(res);
      languagePercents[node.name] = res;
    } catch (e) {
      console.log('error', e);
    }
  }
  return languagePercents;
};

const calcLanguagePercents = languages => {
  let total = Object.keys(languages).map(key => languages[key]).reduce((a, b) => a + b, 0);
  let percents = {};
  for(const lang in languages) {
    percents[lang] = Math.round(parseFloat(languages[lang]) / total.toFixed(2) * 100, 2);
  }
  return percents;
};

module.exports = getUserData;
