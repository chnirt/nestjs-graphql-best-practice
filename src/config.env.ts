import * as dotenv from 'dotenv'
dotenv.config()

// COMPLETE:
const config = {
	testing: {
		domain: 'devcloud4.digihcs.com',
		port: process.env.PORT,
		end_point: 'graphql',
		orm: {
			url: 'mongodb://admin:chnirt1803@ds161397.mlab.com:61397/database-test'
		}
	},
	development: {
		domain: 'devcloud4.digihcs.com',
		port: process.env.PORT,
		end_point: 'graphql',
		orm: {
			url: 'mongodb://admin:chnirt1803@ds161397.mlab.com:61397/database-test'
			// host: 'localhost',
			// port: process.env.MONGO_PORT,
			// username: '',
			// password: '',
			// database: 'lunch4',
		}
	},
	production: {
		domain: 'devcloud4.digihcs.com',
		port: process.env.PORT,
		end_point: 'graphql',
		orm: {
			host: 'localhost',
			port: 11049,
			username: '',
			password: '',
			database: 'test'
		}
	}
}

export default config[process.env.NODE_ENV || 'development']
