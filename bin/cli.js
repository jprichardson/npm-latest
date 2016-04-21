#!/usr/bin/env node
'use strict'

var npmLateset = require('./../lib/npm-latest')
var path = require('path')
var fs = require('fs')
var colors = require('colors')
var vcsurl = require('vcsurl')

function main () {
  if (process.argv.length < 3) {
    displayHelp()
  } else {
    process.argv.slice(2).forEach(function (packageName) {
      npmLateset(packageName, function (err, result) {
        if (err) {
          if (err.error === 'not_found') {
            console.log('')
            console.log("  Package '%s' not found in NPM.", colors.blue(packageName))
            console.log('')
          } else {
            console.log('ERROR')
            console.log(err.reason)
          }
          return
        }

        console.log('')
        console.log('  ' + colors.blue(packageName + ': '))
        console.log('    latest: ' + result.version)
        console.log('    last updated: ' + result.time)
        if (result.author && result.author.name) {
          console.log('    author: ' + result.author.name)
        }
        if (result.repository && result.repository.url) {
          console.log('    repo: ' + vcsurl(result.repository.url))
        }
        if (result.description) {
          console.log('    description: ' + result.description)
        }
        console.log('')
      })
    })
  }
}

function displayHelp () {
  var packageJson = path.join(__dirname, '../package.json')
  if (fs.existsSync(packageJson)) {
    var packageConf = JSON.parse(fs.readFileSync(packageJson).toString())
    console.log('')
    console.log(colors.bold('  npm-latest [%s]'), packageConf.version)
    console.log('')
    console.log('    Usage: npm-latest [package]')
    console.log('')
  } else {
    console.log("Can't locate package.json. Can't display help.")
  }
}

main()
