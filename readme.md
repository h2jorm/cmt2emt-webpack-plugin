# cmt2emt-webpack-plugin
A webpack plugin to replace comment nodes with element nodes in html

## Quick guide
webpack config
```js
const webpack = require('webpack');
const Cmt2emtPlugin = require('cmt2emt-webpack-plugin');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom'],
    app: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new Cmt2emtPlugin({
      source: path.resolve('public/index.html'),
      output: './index.html',
    })
  ]
};
```
source html file located in 'public/index.html'
```html
<!-- cmt2emt-webpack-plugin vendor -->
<!-- cmt2emt-webpack-plugin app -->
```

output html file located in 'build/index.html'
```html
<script src="vendor.js"></script>
<script src="app.js"></script>
```

## Advanced
It is supported to transform asset name by cmt2emt-webpack-plugin. Follow the previous example.

change webpack config
```js
new Cmt2emtPlugin({
  source: path.resolve('public/index.html'),
  output: './index.html',
  // ** a new line ** //
  transform: assetName => `/assets/${assetName}`
})
```

output html file
```html
<script src="/assets/vendor.js"></script>
<script src="/assets/app.js"></script>
```
