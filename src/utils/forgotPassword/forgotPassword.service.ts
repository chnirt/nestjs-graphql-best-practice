import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-core'
import * as nodemailer from 'nodemailer'
import Redis from 'ioredis'
import * as jwt from 'jsonwebtoken'
import { getMongoRepository } from 'typeorm'
import { User } from '../../modules/user/user.entity'
import { Args } from '@nestjs/graphql'
import * as fs from 'fs'
import * as handlebars from 'handlebars'
// import * as hbs from 'nodemailer-express-handlebars'
// import * as path from 'path'

@Injectable()
export class ForgotPasswordService {
	async forgotPassword(email: string): Promise<any> {
		const user = await getMongoRepository(User).findOne({ username: email })

		if (!user) {
			return true
		}

		const token = await jwt.sign(
			{
				issuer: 'http://lunchapp4.dev.io',
				subject: user._id,
				audience: user.username
			},
			process.env.SECRET_KEY,
			{
				expiresIn: '1h'
			}
		)
		const url = `http://devcloud4.digihcs.com:14270/%F0%9F%A5%A2/${token}`

		return await this.sendEmail(email, url)
	}

	async sendEmail(email: string, url: string) {
		const readHTMLFile = (path, callback) => {
			fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
				if (err) {
					throw err
					callback(err)
				} else {
					callback(null, html)
				}
			})
		}

		const transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		})

		readHTMLFile(`src/utils/template/index.html`, function(err, html) {
            const template = handlebars.compile(html)
            const replacements = {
                username: email
            }
            const htmlToSend = template(replacements)
			const mailOptions = {
				from: 'Acexis 📧 trinhchin.innos@gmail.com', // sender address
				to: 'thangkhung164@gmail.com', // list of receivers
				subject: 'Reset your password by e-mail',
				// text:
				// 	'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				// 	'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				// 	url +
				// 	'\n\n' +
                // 	'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                html: htmlToSend
			}

			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					// console.log(err)
					throw new ApolloError(err.message, '500', {})
				} else {
					// console.log("Message sent: " + info.response.message)
				}
			})
		})

		transporter.close()
	}
}
