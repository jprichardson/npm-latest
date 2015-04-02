'use strict'

var npmLatest = require('./../lib/npm-latest.js')

// The request options. For more information please visit:
// https://github.com/mikeal/request/#requestoptions-callback
var options = {
  url: 'https://registry.nodejitsu.com/%s',
  timeout: 1500
}

npmLatest('express', options, function (err, result) {
  if (err) {
    console.error(err)
    return
  }
  console.log(result.name + ' v' + result.version)
})
