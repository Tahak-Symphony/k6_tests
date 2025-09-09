const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
require('dotenv').config({ path: './.env' });


const entryArray = glob.sync('./src/**/*.js');

const entryObject = entryArray.reduce((acc, item) => {
  const name = path.relative('src', item).replace(/\.js$/, '');
  acc[name] = path.resolve(__dirname, item);
  return acc;
}, {});


module.exports = {
  mode: 'production',
  entry: entryObject,
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name].bundle.js',
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  target: 'web',
  externals: /k6(\/.*)?/,
};

