import { createTransport } from 'nodemailer';
import getText from './lang/get-text.js';
import errorHelper from './helpers/error-helper.js';
import { awsAccessKey, awsSecretAccessKey, awsRegion } from '../config/index.js';
import pkg from 'aws-sdk';
const { config, SES } = pkg;

config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion
});

export default async (email, name, confirmCode, lang, type, req, res) => {
  new Promise(async (resolve, reject) => {
    if (!email || !confirmCode || (lang !== 'tr' && lang !== 'en')) {
      return res.status(400).send(errorHelper('00005', req)).end();
    }

    // const emailTransfer = createTransport({
    //   SES: new SES({
    //     apiVersion: '2010-12-01'
    //   })
    // });
    console.log(confirmCode);

    let body = '';
    //NOTE: You can customize the message that will be sent to the newly registered users according to your pleasure.
    if (type == 'register') {
      body = `${getText(lang, 'welcomeCode')} ${name}!\r\n\r\n${getText(lang, 'verificationCodeBody')} ${confirmCode}`;
    } else {
      body = `${getText(lang, 'verificationCodeBody')} ${confirmCode}`;
    }

    let MAIL_SERVER_URL = '127.0.0.0';

    let smtp = nodemailer.createTransport({
      host: MAIL_SERVER_URL,
      connectionTimeout: 60000
    });

    const emailInfo = {
      from: 'smtp.gmail.com',
      to: email,
      subject: getText(lang, 'verificationCodeTitle'),
      text: body
    };

    try {
      await smtp.sendMail(emailInfo);
      return resolve('Success');
    } catch (err) {
      return reject(err);
    }
  });
};
