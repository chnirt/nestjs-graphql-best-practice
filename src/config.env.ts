const config = {
  development: {
    port: 11098
  },
  production: {
    port: 11097
  }
}
export default config[process.env.NODE_ENV || 'development']
