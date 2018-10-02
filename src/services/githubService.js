const fetch = require("cross-fetch");
const gql = require("graphql-tag");
const request = require("request-promise");
const { ApolloClient } = require("apollo-boost");
const { HttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { githubUserAccessToken, logger } = require("../../lib/config");
const { formatEvents, calcLanguagePercentsForRepo, calcLanguagePercentsForUser, formatCommits } = require('../helpers/dataFormatHelper');

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

const reflect = p => p.then(value => ({value, status: "resolved" }), e => ({e, status: "rejected" }));

const getEventRequestOptions = (userName, page) => {
  return {
    uri: `https://api.github.com/users/${userName}/events/public?page=${page}`,
    headers: {
      authorization: `Bearer ${githubUserAccessToken}`,
      "User-Agent": "TheWillG"
    },
    json: true
  };
}

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


  // Run these requests in parallel, avoid fail-fast
  const [graphQlResponse, eventsPage1, eventsPage2, eventsPage3] = await Promise.all([
    graphQlResponsePromise,
    request(getEventRequestOptions(userName, 1)),
    request(getEventRequestOptions(userName, 2)),
    request(getEventRequestOptions(userName, 3))
  ].map(reflect));
  const events = [eventsPage1, eventsPage2, eventsPage3]
    .filter(event => event.status === 'resolved')
    .map(event => formatEvents(event.value))
    .reduce((combined, event) => [...combined, ...event], []);
  
  if (graphQlResponse.status === 'rejected') {
    throw new Error('Could not retrieve user');
  }
  
  const { 
    repoLanguagePercents, 
    userLanguagePercents 
  } = await getLanguageData(userName, graphQlResponse.value.data.user.repositories.edges);
  const userData = Object.assign({
    ...graphQlResponse.value.data.user
  }, {
    events: events.slice(0, 10),
    commits: formatCommits(events),
    repoLanguagePercents,
    userLanguagePercents
  });
  logger.info(`User Requested: ${userName}`);
  logger.info(`Remaining Limit: ${graphQlResponse.value.data.rateLimit.remaining}`);

  return userData;
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
      logger.error(`Error getting language data ${JSON.stringify(e)}`);
    }
  }
  const userLanguagePercents = calcLanguagePercentsForUser(totalBytes, repoLanguagePercents);
  return { repoLanguagePercents, userLanguagePercents };
};



module.exports = getUserData;
