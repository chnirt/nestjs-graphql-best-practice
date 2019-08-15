import * as dotenv from 'dotenv'
dotenv.config()

// COMPLETE:
const config = {
	development: {
		domain: 'localhost',
		port: process.env.PORT,
		end_point: 'graphqllunch',
		orm: {
			type: 'mongodb',
			host: 'localhost',
			port: process.env.MONGO_PORT,
			username: '',
			password: '',
			database: 'lunch4',

			// type: 'mongodb',
			// url: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql',
			useNewUrlParser: true
		}
	},
	production: {
		domain: 'devcloud4.digihcs.com',
		port: process.env.PORT,
		end_point: 'graphqllunch',
		orm: {
			type: 'mongodb',
			url: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql',
			// host: 'localhost',
			// port: 27017,
			// username: '',
			// password: '',
			// database: 'lunch4',
			useNewUrlParser: true
		}
	}
}

export default config[process.env.NODE_ENV || 'development']
