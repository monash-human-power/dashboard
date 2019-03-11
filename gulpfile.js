var gulp = require('gulp');
var sass = require('gulp-sass');

var bootstrapScssPath = 'node_modules/bootstrap/scss/bootstrap.scss';
gulp.task('sass', () => {
    return gulp.src(bootstrapScssPath)
        .pipe(sass())
        .pipe(gulp.dest('client/css'))
});

var bootstrapJsPath = 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
var jqueryJsPath = 'node_modules/jquery/dist/jquery.min.js'
gulp.task('js', ()=> {
    return gulp.src([bootstrapJsPath, jqueryJsPath])
        .pipe(gulp.dest('client/js'))
});

gulp.task('default', gulp.parallel('sass', 'js'));