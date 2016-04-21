'use strict'

var request = require('request')
var util = require('util')
var registryUrl = require('registry-url')().replace(/\/$/, '')

var NPM_URL = registryUrl + '/%s'

function getLatest (npmObj) {
  if (npmObj && npmObj.time) {
    var time = npmObj.time
    delete time.modified
    delete time.created
    var versions = Object.keys(time)
    versions.sort(function (a, b) { return new Date(time[b]) - new Date(time[a]) })
    var lastVersion = versions[0]
    var lastTime = time[lastVersion]
  }
  return {
    'version': lastVersion || null,
    'time': (lastTime) ? new Date(lastTime) : null
  }
}

function npmLatest (packageName, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  // Default request options
  var defaults = {
    url: NPM_URL
  }

  // Merge options with defaults
  Object.keys(options).forEach(function (key) {
    defaults[key] = options[key]
  })
  options = defaults

  // Replace placeholder with the package name
  options.url = util.format(options.url, packageName)

  request(options, function (err, response, body) {
    if (err) return callback(err)

    if (!body) return callback({error: 'not_found'})

    var npmObj = JSON.parse(body)
    if (npmObj.error) return callback(npmObj)

    var latest = getLatest(npmObj)
    callback(null, {
      name: packageName,
      version: latest.version,
      time: latest.time,
      author: npmObj.author,
      repository: npmObj.repository,
      description: npmObj.description
    })
  })
}

module.exports = npmLatest
