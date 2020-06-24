let mix = require('laravel-mix');
const path = require('path');
require('laravel-mix-eslint');

mix.js('src/index.js', 'dist/')
  .js('src/global.js', 'dist/')
  .sourceMaps()
  .setPublicPath('dist')
  .extract(Object.keys(require('./package.json').dependencies))
  .webpackConfig({
    node: {
      fs: "empty"
    },
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'js')
      }
    },
  }).options({
    clearConsole: false
  });
