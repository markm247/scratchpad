var gulp = require('gulp') ([
  'browserify',
  'babelify',
  'vinyl-source-stream',
  'reactify'
]);

gulp.task('browserify', function() {
  browserify({"entries": ["./js/scratchpad.js"],
              "extensions": [".js"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("./js/"));
});
