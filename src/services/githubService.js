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
  const languagePercents = await getLanguageData(userName, graphQlResponse.data.user.repositories.edges);
  const events = await eventsPromise;

  const userData = Object.assign({
    ...graphQlResponse.data.user
  }, {
    events: formatEvents(events),
    repoLanguagePercents: languagePercents.repoLanguagePercents,
    userLanguagePercents: languagePercents.userLanguagePercents
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
  const repoLanguagePercents = [];
  let totalBytes = 0;
  for(const { node } of repos) {
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
      console.log('error', e);
    }
  }
  const userLanguagePercents = calcLanguagePercentsForUser(totalBytes, repoLanguagePercents);
  return { repoLanguagePercents, userLanguagePercents };
};

const calcLanguagePercentsForRepo = languages => {
  let total = Object.keys(languages).map(key => languages[key]).reduce((total, bytes) => total + bytes, 0);
  let percents = [];
  for (const lang in languages) {
    percents.push({
      name: lang,
      percent: Math.round(parseFloat(languages[lang]) / total.toFixed(2) * 100 * 100) / 100,
      bytes: languages[lang]
    });
  }
  return percents;
};

const calcLanguagePercentsForUser = (total, allLanguages) => {
  const langs = allLanguages.reduce((combined, repos) => [...combined, ...repos.languages], []);
  let totals = [];
  for (const lang in langs) {
    let index = totals.findIndex((value) => value.name === langs[lang].name);
    if (index === -1) {
      totals.push({ name: langs[lang].name, bytes: langs[lang].bytes });
    } else {
      totals[index].bytes += langs[lang].bytes;
    }
  }
  totals = totals.map(lang => {
    return { name: lang.name, percent: Math.round(lang.bytes.toFixed(2) / total * 100 * 100) / 100, bytes: lang.bytes }
  });
  return totals;
};

module.exports = getUserData;
