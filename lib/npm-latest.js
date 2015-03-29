'use strict';

var request = require('request')
  , util = require('util')
  , _ = require('lodash')
  , registryUrl = require('registry-url')().replace(/\/$/, '')

var NPM_URL = registryUrl + "/%s";

function getLatest(npmObj) {
  var time = npmObj.time;
  delete time.modified
  delete time.created
  var versions = Object.keys(time);
  versions.sort(function(a, b) { return new Date(time[b]) - new Date(time[a]); });

  var lastVersion = versions[0];
  var lastTime = time[lastVersion];

  return {
    "version": lastVersion,
    "time": new Date(lastTime)
  };
}

module.exports = function (packageName, options, cb) {
  if(typeof options === 'function') {
    cb = options;
  }

  // Default request options
  var defaults = {
    url: NPM_URL
  }

  // Merge options with defaults
  options = _.merge(defaults, options);

  // Replace placeholder with the package name
  options.url = util.format(options.url, packageName);

  request(options, function(err, response, body) {
    if (err) {
      cb(err);
    } else {
      var npmObj = JSON.parse(body);
      if (npmObj.error) {
        cb(npmObj);
      } else {
        var latest = getLatest(npmObj);
        cb(null, {
          name: packageName,
          version: latest.version,
          time: latest.time,
          author: npmObj.author,
          repository: npmObj.repository,
          description: npmObj.description
        });
      }
    }
  });
};
