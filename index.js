'use strict';
var glob = require('glob');
var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

module.exports = function(options) {
  var translationsSrc = options.translationsSrc;
  var translations = [];
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new gutil.PluginError('gulp-missing-translations', 'Streaming not supported'));
      return;
    }

    translations = translations.concat(file.contents.toString().match(/MVTR_[A-Z0-9_]+/g));
    callback(null, file);
  }, function(callback) {

    translations = _(translations).compact().uniq().value();
    glob(translationsSrc, null, function(er, translationFiles) {
      if (er) {
        return;
      }

      translationFiles.forEach(function(translationFile) {
        fs.createReadStream(translationFile)
          .pipe(through.obj(function(file, encoding, cb) {
            var fileContent = file.toString();
            var missingTranslations = [];

            translations.forEach(function(translation) {
              if (_.endsWith(translation, '_')) {
                if (fileContent.indexOf(translation) === -1) {
                  missingTranslations.push(translation);
                }
                return;
              }

              // all translations in JSON file ends with "
              if (fileContent.indexOf(translation + '"') === -1) {
                missingTranslations.push(translation);
              }
            });

            printResults(translationFile, missingTranslations);

            cb(null, file);
          }));
      });


      callback();
    });
  });

  function printResults(translationFile, missingTranslations) {
    if (missingTranslations.length === 0) {
      gutil.log(gutil.colors.bgGreen.grey(translationFile));
      gutil.log(gutil.colors.blue('No missing translations.'));
    } else {
      gutil.log(gutil.colors.bgYellow.grey(translationFile));
      gutil.log(gutil.colors.yellow(missingTranslations.length + ' missing translations.'));

      missingTranslations.forEach(function(translation) {
        gutil.log(gutil.colors.red(translation));
      })
    }

    gutil.log(gutil.colors.blue('----------------------------'));
  }
};