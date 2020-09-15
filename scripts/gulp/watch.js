const watch = require('gulp-watch');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const blockTemplate = require('../templates/templates');

module.exports = function (browserSync) {

  watch([
    'app/images/**/*',
    'app/fonts/**/*'
  ], browserSync.reload);

  watch(excludeTmp(['app/**/*.scss', 'app/styles/**/*']), gulp.parallel('styles'));
  watch(excludeTmp(['app/**/*.{html,pug,json}']), gulp.parallel('pug'));
  watch(excludeTmp(['app/components/**/*.svg']), gulp.parallel('pug'));
  watch(excludeTmp(['app/components/**/*.js']), gulp.parallel('lint'));



  //TODO on addDir создавать пустые файлы, шаблоны записывать во все создаваемые пустые файлы
  watch(excludeTmp([
    'app/components/**/*',
    '!app/components/**/(svg|images)',
    '!app/components/**/(svg|images)/**/*'
  ]))
    .on('addDir', function (dir_path) {
      let appDirAbsolute = path.resolve(process.cwd(), "app/");
      let appDir = path.relative(dir_path, appDirAbsolute).split(path.sep).join("/");
      let name = path.basename(dir_path);

      /**
       * Не добавлять шаблон блока в папки с названиями svg, lib, js, assets, images, utils, plugins или начинающиеся с _
       */
      if (/^(svg|libs?|js|assets|images|utils|plugins)$|^_/.test(name)) {
        return;
      }

      let LIST = [
        {"ext": ".pug", "template": blockTemplate('pug')},
        {"ext": ".scss", "template": blockTemplate('scss')},
        {"ext": ".js", "template": blockTemplate('js')},
        {"name": "package", "ext": ".json", "template": blockTemplate('json')}
      ];
      LIST.forEach(function (itm) {
        let tpl = itm.template;
        if (typeof tpl === "function") {
          tpl = tpl(name, appDir, relative);
        }
        writeFile(dir_path + "/" + (itm.name || name) + itm.ext, tpl);
      });

      function relative(dir) {
        return path.relative(dir_path, path.resolve(appDirAbsolute + dir)).split(path.sep).join("/");
      }
    });

  function excludeTmp(list) {
    list.push( '!**/*___jb_tmp___' );
    return list;
  }
  function writeFile(path, content) {
    fs.exists(path, function (exists) {
      if (!exists) {
        fs.writeFile(path, content, function () {});
      }
    });
  }
  //watch('app/components/svg/symbols/*.svg', start(['svg']));
};
