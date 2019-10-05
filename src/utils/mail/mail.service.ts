import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import * as fs from 'fs'

import { MAIL_USER, MAIL_PASS } from '../../environments'

@Injectable()
export class MailService {
	async sendMail(email: string, req: any, resetPasswordToken: string): Promise<any> {
		const transporter = await nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: MAIL_USER,
				pass: MAIL_PASS
			}
		})

		const readHTMLFile = (path, callback) => {
			fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
				if (err) {
					callback(err)
				} else {
					callback(null, html)
				}
			})
		}

		readHTMLFile('./src/assets/templates/index.html', (err, html) => {
			const template = handlebars.compile(html)

			const replacements = {
				link: 'http//' + req.headers.host + '/reset/' + resetPasswordToken
			}
			const htmlToSend = template(replacements)

			const mailOptions = {
				from: 'Chnirt  📮:' + MAIL_USER, // sender address
				to: email, // list of receivers
				subject: 'Reset Password',
				html: htmlToSend
			}

			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					// console.log(err)
					Logger.error(err.message)
				} else {
					// console.log("Message sent: " + info.response.message)
				}
			})

			transporter.close()
		})
	}
}
