var gulp = require('gulp')
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');

gulp.task('browserify', function() {
  browserify({"entries": ["./js/scratchpad.js"],
              "extensions": [".js"],
              "transform": [babelify]
            })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("./js/"));
});

gulp.task('default', ['browserify']);
