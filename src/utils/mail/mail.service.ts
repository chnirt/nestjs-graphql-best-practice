import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ApolloError } from 'apollo-server-core'
import { getMongoRepository } from 'typeorm'
import { User } from '../../modules/user/user.entity'
// import * as hbs from 'nodemailer-express-handlebars'
// import * as path from 'path'

@Injectable()
export class MailService {
	async sendMail(email: string, req: any): Promise<any> {
		const message = 'Not Found: Email'
		const code = '404'
		const additionalProperties = {}

		const existedUser = await getMongoRepository(User).findOne({
			username: email
		})

		if (!existedUser) {
			throw new ApolloError(message, code, additionalProperties)
		}

		const token = '$2y$12$2SJ7/SwsMq4St5EPqRdh5OMm.sfAkchcXSFJn9SEqL/ekmGusAXhm'

		const transporter = await nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		})

		// const handlebarsOptions = {
		// 	viewEngine: 'handlebars',
		// 	viewPath: path.resolve('src/assets/templates'),
		// 	extName: '.html'
		// }

		// transporter.use('compile', hbs(handlebarsOptions))

		const mailOptions = {
			from: 'Acexis 📧 phanngocly164@gmail.com', // sender address
			to: 'thangkhung164@gmail.com', // list of receivers
			subject: 'Reset your password by e-mail',
			text:
				'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' +
				req.headers.host +
				'/reset/' +
				token +
				'\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		}

		await transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				// console.log(err)
				throw new ApolloError(err.message, '500', {})
			} else {
				// console.log("Message sent: " + info.response.message)
			}
		})

		transporter.close()
	}
}
