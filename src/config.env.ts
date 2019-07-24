const config = {
	development: {
		port: 11048,
		end_point: 'graphqllunch'
	},
	production: {
		port: process.env.PORT,
		end_point: process.env.END_POINT
	}
}
export default config[process.env.NODE_ENV || 'development']
