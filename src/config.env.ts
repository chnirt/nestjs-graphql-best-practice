import { PORT, NODE_ENV } from './environments'

// COMPLETE:
const config = {
	development: {
		domain: 'devcloud4.digihcs.com',
		port: PORT,
		end_point: 'graphql',
		orm: {
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
			// host: 'localhost',
			// port: process.env.MONGO_PORT,
			// username: '',
			// password: '',
			// database: 'lunch4',
		}
	},
	testing: {
		domain: 'devcloud4.digihcs.com',
		port: PORT,
		end_point: 'graphql',
		orm: {
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
		}
	},
	staging: {
		domain: 'devcloud4.digihcs.com',
		port: PORT,
		end_point: 'graphql',
		orm: {
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
		}
	},
	production: {
		domain: 'devcloud4.digihcs.com',
		port: PORT,
		end_point: 'graphql',
		orm: {
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
			// host: 'localhost',
			// port: 11049,
			// username: '',
			// password: '',
			// database: 'test'
		}
	}
}

// export default config[process.env.NODE_ENV || 'development']
export default config[NODE_ENV]
