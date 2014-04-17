'use strict';

var request = require('request')
  , util = require('util')

var NPM_URL = "http://registry.npmjs.org/%s";

function getLatest(npmObj) {
  var versions = [];
  for (var version in npmObj.time)
    versions.push(version);

  var lastVersion = versions[versions.length - 1];
  var lastTime = npmObj.time[lastVersion];

  return {
    "version": lastVersion,
    "time": new Date(lastTime)
  };
}

module.exports = function (packageName, cb) {
  var url = util.format(NPM_URL, packageName);
  request(url, function(err, response, body) {
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
