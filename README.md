Node.js - npm-latest
====================

Quickly find the latest version of a package in `npm`.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


Why?
----

Sometimes I want to know if a single package needs to be
updated. Also, I'm a package creatin' fool: https://www.npmjs.com/~jprichardson - I need to
know quickly if a package name is taken.

**Update 2015-03-29:**

Support config registry in `~/.npmrc` file，more on [registry-url](https://github.com/sindresorhus/registry-url)



Installation
------------

    npm install -g npm-latest



Example
------

    npm-latest express

output:

      express:

        latest: 3.0.0rc2
        last updated: Fri Aug 03 2012 15:33:05 GMT-0500 (CDT)
        author: TJ Holowaychuk
        repo: git://github.com/visionmedia/express
        description: Sinatra inspired web development framework



License
-------

(MIT License)

Copyright 2012-2015, JP Richardson <jprichardson@gmail.com>

