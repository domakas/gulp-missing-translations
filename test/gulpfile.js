var gulp = require('gulp');
var missingTranslations = require('../index');

gulp.task('translations', function() {
  return gulp.src(['./index.html'])
    .pipe(missingTranslations({ translationsSrc: './translations*.json' }));
});
