module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel?stage=0&loose[]=es6.modules&loose[]=es6.classes'
    }]
  }
};
