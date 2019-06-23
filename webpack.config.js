// const webpack = require('webpack');
// const path = require('path');
// const nodeExternals = require('webpack-node-externals');
// const chalk = require('chalk');
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// module.exports = {
//   entry: ['webpack/hot/poll?100', './src/main.ts'],
//   watch: true,
//   target: 'node',
//   externals: [
//     nodeExternals({
//       whitelist: ['webpack/hot/poll?100'],
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /.tsx?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   mode: 'development',
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin(),
//     new ProgressBarPlugin({
//       format:
//         chalk.hex('#6c5ce7')('build ') +
//         chalk.hex('#0984e3')('▯:bar▯ ') +
//         // chalk.red('▯ :bar ▯ ') +
//         chalk.hex('#00b894')('(:percent) ') +
//         // chalk.green(':percent ') +
//         chalk.hex('#ffeaa7')(':msg'),
//       // chalk.blue('( :elapsed s )')
//       complete: '▰',
//       incomplete: '▱',
//       clear: false,
//     }),
//   ],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'server.js',
//   },
// };

const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};
