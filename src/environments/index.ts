import * as dotenv from 'dotenv'
dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development'

// application
const DOMAIN: string = process.env.DOMAIN || 'devcloud4.digihcs.com'
const PORT: string = process.env.PORT || '11048'
const END_POINT: string = process.env.END_POINT || 'graphql'
const VOYAGER: string = process.env.VOYAGER || 'voyager'
const SECRET_KEY: string = process.env.SECRET_KEY || 'chnirt1803'
const FE_URL: string = process.env.FE_URL || ''

// nodemailer
const MAIL_USER: string = process.env.MAIL_USER || 'trinhchin.innos@gmail.com'
const MAIL_PASS: string = process.env.MAIL_PASS || 'Matkhaula1!'

// cloudary
const CLOUD_NAME: string = process.env.CLOUD_NAME || ''
const API_KEY: string = process.env.API_KEY || 'API key test'
const API_SECRET: string = process.env.API_SECRET || ''

export {
	NODE_ENV,
	DOMAIN,
	PORT,
	END_POINT,
	VOYAGER,
	SECRET_KEY,
	FE_URL,
	MAIL_USER,
	MAIL_PASS,
	CLOUD_NAME,
	API_KEY,
	API_SECRET
}
