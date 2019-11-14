import { NODE_ENV, MONGO_URL, MONGO_PORT, MONGO_DB } from '@environments'

const orm = {
	development: {
		url: MONGO_URL!
	},
	testing: {
		url: MONGO_URL!
	},
	staging: {
		host: 'localhost',
		port: MONGO_PORT!,
		username: '',
		password: '',
		database: MONGO_DB!
	},
	production: {
		url: MONGO_URL!
	}
}

export default orm[NODE_ENV!]
