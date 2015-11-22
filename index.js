'use strict'

const fs = require('fs')
const IDENTITY = 'cmt2emt-webpack-plugin'

function Plugin(options) {
  if (!options.source)
    throw new Error('Cmt2emtWebpackPlugin: options.source should be specified')
  if (!options.output)
    throw new Error('Cmt2emtWebpackPlugin: options.output should be specified')
  this.options = options
}

Plugin.prototype.apply = function(compiler) {
  const sourceFile = this.options.source
  const outputFile = this.options.output
  const transform = this.options.transform

  compiler.plugin('emit', function(compilation, callback) {
    const webpackStatsJson = compilation.getStats().toJson()

    fs.readFile(sourceFile, 'utf8', (err, data) => {
      data = data.replace(/<!--(.*)-->/g, (commentNodeString, commentContent) => {
        return composeScriptTag(commentContent, webpackStatsJson, transform)
      })
      compilation.assets[outputFile] = {
        source: () => data,
        size: () => data.length
      }
      callback()
    })

  })

}

function composeScriptTag(commentContent, stats, transform) {
  let _pieces = commentContent.split(' ')
  let pieces = []
  _pieces.map(piece => {
    if (piece.length) pieces.push(piece)
  })

  const identity = pieces[0]
  const filename = pieces[1]
  const assetsByChunkName = stats.assetsByChunkName

  if (identity !== IDENTITY || !assetsByChunkName.hasOwnProperty(filename))
    return `<!--${commentContent}-->`

  return `<script src="${transform ? transform(assetsByChunkName[filename]) : assetsByChunkName[filename]}"></script>`

}

module.exports = Plugin
