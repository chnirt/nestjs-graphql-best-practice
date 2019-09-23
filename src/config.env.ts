import * as dotenv from 'dotenv'
dotenv.config()

// COMPLETE:
const config = {
	development: {
		domain: 'devcloud4.digihcs.com',
		// domain: 'localhost',
		port: process.env.PORT,
		end_point: 'graphql',
		orm: {
			// url: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql',
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
			// host: 'localhost',
			// port: process.env.MONGO_PORT,
			// username: '',
			// password: '',
			// database: 'lunch4',
		}
	},
	production: {
		domain: 'devcloud4.digihcs.com',
		// domain: 'localhost',
		port: process.env.PORT,
		end_point: 'graphql',
		orm: {
			// url: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql',
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
			// host: 'localhost',
			// port: 27017,
			// username: '',
			// password: '',
			// database: 'lunch4',
		}
	}
}

export default config[process.env.NODE_ENV || 'development']
