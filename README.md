# gulp-missing-translations

> checks provided files with and compares them to translation files to find missing translations

## Install

```
$ npm install --save-dev gulp-missing-translations
```

## Usage

```js
var gulp = require('gulp');
var missingTranslations = require('gulp-missing-translations');

gulp.task('translations', function() {
  return gulp.src(['app/scripts/**/*.js', 'app/views/**/*.html'])
    .pipe(missingTranslations({ translationsSrc: 'app/translations/*.json' }));
});
```