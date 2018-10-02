const { eventTypes } = require("../../lib/config");

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
        obj = Object.assign({}, obj, { merged: payload.pull_request.merged_at != null });
      }
      return obj;
    });
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

const formatCommits = events => {
  const commits = [];
  events = events.filter(event => event.type === 'PushEvent');
  events.forEach(event => {
    const date = new Date(event.created_at);
    const id = `${date.getDate()}${date.getMonth()}${date.getFullYear}`;
    const commitIndex = commits.findIndex(commit => commit.id === id);
    if (commitIndex >= 0) {
      commits[commitIndex].total += 1;
    } else {
      const createdDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      commits.push({
        total: 1,
        id,
        day: createdDay
      });
    }
  });
  return commits.map(commit => {
    return { x: commit.day, y: commit.total };
  });
};

module.exports = { formatEvents, calcLanguagePercentsForRepo, calcLanguagePercentsForUser, formatCommits }