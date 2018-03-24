const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, 'src/scripts/widget.js')
  ],
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'widget.js',
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
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      }
    ]
  }
};
