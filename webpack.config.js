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

  // resolve: {
  //   alias: {
  //     '3base': path.join(__dirname, '/node_modules/3base/lib'),
  //   },
  //   extensions: ['*', '.js', '.jsx']
  // },
  
  devServer: {
    port: 10001
  }
};