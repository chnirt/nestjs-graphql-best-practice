const config = {
	development: {
		port: 11048
	},
	production: {
		port: 11047
	}
}
export default config[process.env.NODE_ENV || 'development']
