'use strict'

const assert = require('assert');
const path = require('path');
const webpack = require('webpack');
const Cmt2emtPlugin = require('../index');
const fs = require('fs');
const rimraf = require('rimraf');

const BUILDDIR = 'build';

function cleanBuildDir() {
  return new Promise((resolve, reject) => {
    rimraf(path.resolve(BUILDDIR), err => {
      if (err)
        return reject();
      resolve();
    });
  });
}

beforeEach(done => {
  cleanBuildDir().then(() => done());
});

after(done => {
  cleanBuildDir().then(() => done());
});

describe('single replacement', () => {
  let cmt2emtConfig = {
    source: path.join(__dirname, './single/index.html'),
    output: 'index.html',
  };
  let webpackConfig = {
    entry: {
      hello: path.join(__dirname, './single/hello.js')
    },
    output: {
      path: path.resolve(BUILDDIR),
      filename: '[name]-[chunkhash].js',
    }
  };
  describe('basic', () => {
    it('should replace comment to script tag', done => {
      const _webpackConfig = Object.assign({}, webpackConfig, {
        plugins: [new Cmt2emtPlugin(cmt2emtConfig)]
      });
      webpack(_webpackConfig, (err, stats) => {
        const assetsByChunkName = stats.toJson().assetsByChunkName;
        fs.readFile(path.join(__dirname, '../build/index.html'), 'utf8', (err, data) => {
          assert.equal(data, `<script src="${assetsByChunkName.hello}"></script>\n`);
          done();
        });
      });
    });
  });
  describe('transform function', () => {
    it('should transform src', done => {
      const _cmt2emtConfig = Object.assign({}, cmt2emtConfig, {
        transform: asset => `assets/${asset}`
      });
      const _webpackConfig = Object.assign({}, webpackConfig, {
        plugins: [new Cmt2emtPlugin(_cmt2emtConfig)]
      });
      webpack(_webpackConfig, (err, stats) => {
        const assetsByChunkName = stats.toJson().assetsByChunkName;
        fs.readFile(path.resolve('build/index.html'), 'utf8', (err, data) => {
          assert.equal(data, `<script src="assets/${assetsByChunkName.hello}"></script>\n`);
          done();
        });
      });
    });
  });
});

describe('multiple replacement', () => {
  let cmt2emtConfig = {
    source: path.join(__dirname, './multiple/index.html'),
    output: 'index.html'
  };
  let webpackConfig = {
    entry: {
      hello: path.join(__dirname, './multiple/hello.js'),
      world: path.join(__dirname, './multiple/world.js'),
    },
    output: {
      path: path.resolve(BUILDDIR),
      filename: '[name]-[chunkhash].js'
    }
  };
  describe('basic', () => {
    it('should replace comment to script tag', (done) => {
      const _webpackConfig = Object.assign({}, webpackConfig, {
        plugins: [new Cmt2emtPlugin(cmt2emtConfig)]
      });
      webpack(_webpackConfig, (err, stats) => {
        const assetsByChunkName = stats.toJson().assetsByChunkName;
        const files = ['hello', 'world'];
        files.forEach((name, key, files) => {
          files[key] = `<script src="${assetsByChunkName[name]}"></script>\n`;
        });
        const expectedIndexHtml = files.join('');
        fs.readFile(path.join(__dirname, '../build/index.html'), 'utf8', (err, data) => {
          assert.equal(data, expectedIndexHtml);
          done();
        });
      });
    });
  });
});
