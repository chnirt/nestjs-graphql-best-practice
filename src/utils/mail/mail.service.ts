import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ApolloError } from 'apollo-server-core';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class MailService {
  async sendMail(
    email: string,
    req: any,
    resetPasswordToken: string,
  ): Promise<any> {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const readHTMLFile = (path, callback) => {
      fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) {
          throw err;
          callback(err);
        } else {
          callback(null, html);
        }
      });
    };

    readHTMLFile(
      __dirname + '/../../../assets/templates/index.html',
      (err, html) => {
        const template = handlebars.compile(html);

        const replacements = {
          link: 'http//' + req.headers.host + '/reset/' + resetPasswordToken,
        };
        const htmlToSend = template(replacements);

        const mailOptions = {
          from: 'Acexis 📧 ' + process.env.MAIL_USER, // sender address
          to: email, // list of receivers
          subject: 'Reset Password',
          html: htmlToSend,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            // console.log(err)
            throw new ApolloError(err.message, '500', {});
          } else {
            // console.log("Message sent: " + info.response.message)
          }
        });

        transporter.close();
      },
    );
  }
}
