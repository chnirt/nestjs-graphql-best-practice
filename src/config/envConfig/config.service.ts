import * as fs from 'fs'
import * as config from '../../environments'

export class ConfigService {
	// private readonly envConfig: { [key: string]: string }
	private readonly envConfig
	constructor(filePath: string) {
		// this.envConfig = dotenv.parse(fs.readFileSync(filePath))
		this.envConfig = {
			development: {
				orm: {
					url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
					// host: 'localhost',
					// port: process.env.MONGO_PORT,
					// username: '',
					// password: '',
					// database: 'lunch4',
				},
				...config
			},
			testing: {
				orm: {
					url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
				},
				...config
			},
			staging: {
				orm: {
					url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
				},
				...config
			},
			production: {
				orm: {
					url: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'
					// host: 'localhost',
					// port: 11049,
					// username: '',
					// password: '',
					// database: 'test'
				},
				...config
			}
		}
	}
	get(key: string) {
		return this.envConfig[config.NODE_ENV][key]
	}
}
