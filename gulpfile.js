var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    del = require('del');

/**
 * 清除
 */
gulp.task('clean', function(cb) {
    return del(['stage/online'], cb);
});

gulp.task('css', ['clean'], function () {
    return gulp.src(['stage/dev/*.css']).pipe(gulp.dest('stage/online')).pipe(minifycss()).pipe(gulp.dest('stage/online'));
});
gulp.task('js', ['css'], function () {
    return gulp.src(['stage/dev/*.js']).pipe(gulp.dest('stage/online')).pipe(uglify()).pipe(gulp.dest('stage/online'));
});

gulp.task('default', ['js'], function() {
});

gulp.task('watch', function () {
    gulp.watch('stage/dev/**', ['default']);
});
