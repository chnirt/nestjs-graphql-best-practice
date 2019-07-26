const config = {
	development: {
		port: 11098,
		end_point: 'graphqllunch'
	},
	production: {
		port: process.env.PORT,
		end_point: process.env.END_POINT || 'graphqllunch'
	}
}
export default config[process.env.NODE_ENV || 'development']
