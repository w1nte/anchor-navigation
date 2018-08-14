var gulp        = require('gulp');
var babel       = require('gulp-babel');
var minify      = require('gulp-minify');

gulp.task('es6', function() {
    gulp.src('./anchor-navigation.js')
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function() {
    gulp.watch('./anchor-navigation.js', ['es6']);
});

gulp.task('default', ['es6', 'watch']);