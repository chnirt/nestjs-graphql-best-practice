const config = {
	development: {
		port: 11048,
		end_point: 'graphql'
	},
	production: {
		port: process.env.PORT,
		end_point: process.env.END_POINT
	}
}
export default config[process.env.NODE_ENV || 'development']
