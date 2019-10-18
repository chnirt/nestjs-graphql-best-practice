const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

module.exports = {
	entry: ['webpack/hot/poll?100', './src/main.ts'],
	watch: true,
	target: 'node',
	externals: [
		nodeExternals({
			whitelist: ['webpack/hot/poll?100']
		})
	],
	module: {
		rules: [
			{
				test: /.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							experimentalWatchApi: true
						}
					}
				],
				exclude: /node_modules/
			}
		]
	},
	mode: 'development',
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, './src'),
			'@auth': path.resolve(__dirname, './src/auth'),
			'@utils': path.resolve(__dirname, './src/shared'),
			'@models': path.resolve(__dirname, './src/models'),
			'@environments': path.resolve(__dirname, './src/environments')
		},
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
		new ProgressBarPlugin({
			format:
				chalk.hex('#6c5ce7')('build ') +
				chalk.hex('#0984e3')('▯:bar▯ ') +
				// chalk.red('▯ :bar ▯ ') +
				chalk.hex('#00b894')('(:percent) ') +
				// chalk.green(':percent ') +
				chalk.hex('#ffeaa7')(':msg'),
			// chalk.blue('( :elapsed s )')
			complete: '▰',
			incomplete: '▱',
			clear: false
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			analyzerHost: '127.0.0.1',
			analyzerPort: '8888',
			reportFilename: process.env.NODE_ENV === 'development' && 'report.html',
			openAnalyzer: false,
			generateStatsFile: false,
			statsFilename: 'stats.json'
		})
	],
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false
	},
	output: {
		pathinfo: false
		// path: path.join(__dirname, 'dist'),
		// filename: 'server.js'
	}
}
