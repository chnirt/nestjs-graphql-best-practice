import * as dotenv from 'dotenv'
dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development'

// author
const AUTHOR: string = process.env.AUTHOR || 'Chnirt'

// application
const DOMAIN: string = process.env.DOMAIN || 'localhost'
const PORT: string = process.env.PORT || '11048'
const END_POINT: string = process.env.END_POINT || 'graphql'
const VOYAGER: string = process.env.VOYAGER || 'voyager'
const FE_URL: string = process.env.FE_URL || ''

// jsonwebtoken
const ISSUER: string = process.env.ISSUER || 'http://chnirt.dev.io'
const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || 'access-token'
const REFRESH_TOKEN: string = process.env.REFRESH_TOKEN || 'refresh-token'
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || ''
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || ''

// bcrypt
const SALT: number = +process.env.SALT || 10

// nodemailer
const MAIL_USER: string = process.env.MAIL_USER || ''
const MAIL_PASS: string = process.env.MAIL_PASS || ''

// cloudinary
const CLOUD_NAME: string = process.env.CLOUD_NAME || ''
const API_KEY: string = process.env.API_KEY || ''
const API_SECRET: string = process.env.API_SECRET || ''

export {
	NODE_ENV,
	AUTHOR,
	DOMAIN,
	PORT,
	END_POINT,
	VOYAGER,
	FE_URL,
	ISSUER,
	ACCESS_TOKEN,
	REFRESH_TOKEN,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	SALT,
	MAIL_USER,
	MAIL_PASS,
	CLOUD_NAME,
	API_KEY,
	API_SECRET
}
