const mailgunJS = require('mailgun-js');
const { mailgunApiKey, mailgunDomain } = require('../../lib/config');

const mailgunJSClient = mailgunJS({ apiKey: mailgunApiKey, domain: mailgunDomain });
const mail = mailgunJSClient.messages();

const sendEmail = async (email, message, subject) =>
  new Promise(resolve => {
    const data = {
      from: 'noreply@thewillg.com',
      to: email,
      subject,
      text: message
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
