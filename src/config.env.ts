import { DOMAIN, PORT, END_POINT, NODE_ENV } from './environments'

// COMPLETE:
const config = {
	development: {
		domain: DOMAIN,
		port: PORT,
		end_point: END_POINT,
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
		domain: DOMAIN,
		port: PORT,
		end_point: END_POINT,
		orm: {
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
		}
	},
	staging: {
		domain: DOMAIN,
		port: PORT,
		end_point: END_POINT,
		orm: {
			url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
		}
	},
	production: {
		domain: DOMAIN,
		port: PORT,
		end_point: END_POINT,
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

export default config[NODE_ENV]
