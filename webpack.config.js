const path = require('path');
console.log(path.join( __dirname + "/srv"));

module.exports = {

  node: {
    fs: "empty"
  },
  
  entry: {
    app: './src/index.js',
  },

  output: {
    path: path.join( __dirname + "/srv"),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  
  devServer: {
    port: 10001
  }
};
