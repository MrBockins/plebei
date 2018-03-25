const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'src/scripts/popup.js'),
    path.join(__dirname, 'src/styles/main.scss')
  ],
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'popup.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.scss$/,
        loader: 'import-glob-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css',
      allChunks: true
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'index.html', cache: true },
      { from: 'templates.html', cache: true },
      { from: 'options.html' }
    ])
  ]
};
