'use strict'

const assert = require('assert')
const path = require('path')
const webpack = require('webpack')
const Cmt2emtPlugin = require('../index')
const fs = require('fs')

describe('Basic replacement', () => {
  it('should pass', (done) => {
    webpack({
      entry: {
        a: path.join(__dirname, './hello/a.js')
      },
      output: {
        path: path.join(__dirname, '../build'),
        filename: '[name]-[chunkhash].js'
      },
      plugins: [
        new Cmt2emtPlugin({
          source: path.join(__dirname, './hello/index.html'),
          output: 'index.html'
        })
      ]
    }, (err, stats) => {
      const assetsByChunkName = stats.toJson().assetsByChunkName
      fs.readFile(path.join(__dirname, '../build/index.html'), 'utf8', (err, data) => {
        assert.equal(data, `<script src="${assetsByChunkName.a}"></script>\n`)
        done()
      })
    })
  })
})
