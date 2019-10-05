import { NODE_ENV } from './environments'

// COMPLETE:
const orm = {
	development: {
		url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
		// host: 'localhost',
		// port: process.env.MONGO_PORT,
		// username: '',
		// password: '',
		// database: 'process.env.DB_NAME',
	},
	testing: {
		url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
	},
	staging: {
		url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
	},
	production: {
		url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
		// host: 'localhost',
		// port: 11049,
		// username: '',
		// password: '',
		// database: 'test'
	}
}

export default orm[NODE_ENV]
