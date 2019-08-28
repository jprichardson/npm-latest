'use strict'

const https = require('https');
const colors = require('colors');
const vcsurl = require('vcsurl');

const REGISTRY_URL = 'https://registry.npmjs.org'; // Hardcode for now

class ReqError extends Error {
  constructor(options) {
    super(options);
    this.code = 'NOT_FOUND';
  }
}

const request = (options) => new Promise((resolve, reject) => {
  https.get(options, async (resp) => {
    let data = '';
    try {
      for await (const chunk of resp) data += chunk;
    } catch (error) {
      return reject(error);
    }
    resolve(data);
  });
});

const extractLatest = (data) => {
  if (!(data && data.time)) return {}
  const {time} = data;
  delete time.modified
  delete time.created
  const versions = Object.keys(time)
  versions.sort((a, b) => Number(new Date(time[b])) - Number(new Date(time[a])))
  const version = versions[0]
  const lt = time[version];
  const lastTime = lt && new Date(lt)
  return {version, time: lastTime};
};

const getLatest = async (name) => {
  const url = `${REGISTRY_URL}/${name}`;
  const body = await request(url);
  if (!body) throw new ReqError('Package not found')
  const data = JSON.parse(body);
  if (data.error) throw new ReqError(data.error);

  const {repository, author, description} = data;
  const {version, time} = extractLatest(data);
  return {name, version, time, author, repository, description};
};

const getFormatted = async (name) => {
  let result;
  try {
    result = await getLatest(name);
  } catch (error) {
    if (error.code !== 'NOT_FOUND') throw error;
    return `\n  Package '${colors.blue(name)}' not found in NPM.`
  }
  const author = result.author.name;
  const repo = result.repository.url;
  const desc = result.description;

  const str = [
    colors.blue(name + ': '),
    `  latest: ${result.version}`,
    repo && `  repo: ${vcsurl(repo)}`,
    author && `  author: ${author}`,
    desc && `  description: ${desc}`,
  ].filter(s => s).map(s => `  ${s}`).join('\n')
  return str;
};

const formatAll = async (names) => {
  let str = '\n';
  if (names.length > 0) {
    let all = [];
    for (const name of names) {
      all.push(await getFormatted(name));
    }
    str += all.join('\n');
  } else {
    try {
      const json = require('./package.json');
      str += colors.bold(`  npm-latest [${json.version}]`);
    } catch (error) {
    } finally {
      str += '\n  Usage: npm-latest [package]';
    }
  }
  str += '\n'
  return str;
}

exports.getLatest = getLatest;
exports.getFormatted = getFormatted;
exports.formatAll = formatAll;
