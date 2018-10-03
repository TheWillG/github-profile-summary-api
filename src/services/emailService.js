const mailgunJS = require("mailgun-js");
const { mailgunApiKey, mailgunDomain } = require("../../lib/config");

const mailgunJSClient = mailgunJS({ apiKey: mailgunApiKey, domain: mailgunDomain });
const mail = mailgunJSClient.messages();

const sendEmail = async (from, to, text, subject) => {
  let html = `<p>${text}</p>`;
  html += "<br />";
  html += "<small>This message was sent you from https://githubprofilesummary.com</small>";
  return new Promise(resolve => {
    const data = {
      from,
      to,
      html,
      subject
    };

    mail.send(data, (error, body) => {
      if (error) {
        resolve({ error: error.message });
      } else {
        resolve(body);
      }
    });
  });
};

module.exports = sendEmail;
