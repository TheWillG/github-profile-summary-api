const mailgunJS = require('mailgun-js');
const { mailgunApiKey, mailgunDomain } = require('../../lib/config');

const mailgunJSClient = mailgunJS({ apiKey: mailgunApiKey, domain: mailgunDomain });
const mail = mailgunJSClient.messages();

const sendEmail = async (from, to, text, subject) =>
  new Promise(resolve => {
    const data = {
      from,
      to,
      text,
      subject
    };

    mail.send(data, (error, body) => {
      if (error) {
        resolve({ error: error.message })
      }
      else {
        resolve(body)
      }
    });
  });


module.exports = sendEmail;
