var assert = require('assert')
var cp = require('child_process')
var path = require('path')

/* global describe, it */

var npmLatestBin = path.resolve('./bin/cli.js')

describe('npm-latest', function () {
  describe('> when package exists', function () {
    it('should return the info', function (done) {
      var cmd = npmLatestBin + ' express'
      cp.exec(cmd, function (err, stdout) {
        assert.ifError(err)
        var lines = stdout
          .split('\n')
          .filter(function (line) { return !!line.trim() })
          .map(function (line) { return line.trim() })

        assert(lines[0].indexOf('express:'))
        assert.equal(lines[3], 'author: TJ Holowaychuk')
        done()
      })
    })
  })

  describe('> when package does not exist', function () {
    it('should return a message notifying the user', function (done) {
      var cmd = npmLatestBin + ' expressXXXAFASDFASDFAG33'
      cp.exec(cmd, function (err, stdout) {
        assert.ifError(err)
        var lines = stdout
          .split('\n')
          .filter(function (line) { return !!line.trim() })
          .map(function (line) { return line.trim() })

        assert(lines[0].indexOf('not found in NPM.'))
        done()
      })
    })
  })
})
