const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const _ = require('lodash');
const pkg = require('../utils/package');
const read = require('../utils/read');
const unique = require('../utils/unique');
const baseUrl = require('../utils/baseUrl');
const _if = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');


const outputDependenciesList = false;
const rootFontSize = 16;
const buildDir = "dist";
const htdocs = ""; //"htdocs/";



const DEBUG = {
  rem: rootFontSize,
  read,
  require,
  unique: unique(),
  version: pkg.getVersion,
  projectName: pkg.getProjectName(),
  projectDescription: pkg.getProjectDescription(),
  project_id: pkg.getProjectId(),
  _,
  assign: _.assign,
  debug: true,
  release: false,
  oAuth: true,
  base_url: base_url(''),
  route: {},
  copyright: 'app/components/copyright.json',
  php: false,
  isBitrix: () => {return info.isBitrix;}
};
const RELEASE = _.assign({}, DEBUG, {
  // oAuth: false,
  debug: false,
  php: true,
  release: true
});
const DEV = _.assign({}, RELEASE, {
  oAuth: true,
  base_url: base_url(getCurrentProjectDir())
});

function getCurrentProjectDir() {
  return getProjectDirById(pkg.getProjectId())
}
function getProjectDirById(id) {
  return `/20${id.substr(0,2)}/${id}/`;
}

const BITRIX = _.assign({}, RELEASE, {
  // base_url: base_url("/dev/"),
  copyright: 'app/components/copyright_bitrix.json'
});

const _browserify = {};


function base_url(_base_url) {
  return  function(str, suffix){
    return (suffix ? suffix + '/' : '' ) + (_base_url + (str || '')).replace(/\/{2}/g, '/');
  }
}



function getBrowserify(entry) {
  if (!entry) return _browserify;
  if (_browserify[entry]) return _browserify[entry];

  const customOpts = {
    entries: [entry], // './app/scripts/main.js'],
    debug: info.isServe || info.isDev,
    transform: ['babelify']
  };
  if (info.isServe) {
    customOpts.plugin = [watchify];
  }
  const opts = _.assign({}, watchify.args, customOpts);
  const b = browserify(opts);
  _browserify[entry] = b;

  if (outputDependenciesList && !info.isServe) {
    const _replace = pathReplace(__dirname);
    const through = require('through2').obj;
    b.pipeline.get('deps').push(through(
      function traceDeps(row, enc, next) {
        const dep = _replace(row.file || row.id);

        console.log('\x1b[32m%s\x1b[0m', dep);
        next();
      }
    ));
  }
  return b;

  function pathReplace(dir) {
    dir = require('path').resolve(dir, '../../');
    return path=>path.replace(dir, '');
  }
}

let info = {
  getCurrentProjectDir,

  init(params) {
    return (cb) => {
      _.assign(info, params);
      cb();
    }
  },

  plumber: ()=>plumber({errorHandler: notify.onError('Error: <%= error.message %>')}),

  getDestinationRoot() {
    return baseUrl(htdocs, buildDir);
  },

  getDestination(dir) {
    return info.isBitrix
      ? `./${buildDir}/local/templates/${require('./bitrix').bitrixTemplateName()}/${dir}`
      : baseUrl(`${htdocs}${dir}`, buildDir)
  },

  rootFontSize,
  author: require("./utils/user-name"),

  isServe: false,
  isDev: false,
  isBitrix: false,
  noVersion: false,

  getBrowserify,
  sourcemaps: {
    init: ()=>_if(info.isServe, sourcemaps.init()),
    write: ()=>_if(info.isServe, sourcemaps.write())
  },
  pug: {
    pretty: true,
    getData: () => {
      switch (true) {
        case info.isServe: return DEBUG;
        case info.isDev: return DEV;
        case info.isBitrix: return BITRIX;
        default: return RELEASE;
      }
    }
  }
};

module.exports = info;
