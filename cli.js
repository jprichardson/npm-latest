#!/usr/bin/env node
'use strict'

const latest = require('.');
(async () => {
  const args = process.argv.length > 2 ? process.argv.slice(2) : [];
  console.log(await latest.formatAll(args));
})();
