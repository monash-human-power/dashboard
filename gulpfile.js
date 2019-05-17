const gulp = require('gulp');
const sass = require('gulp-sass');

const bootstrapScssPath = 'node_modules/bootstrap/scss/bootstrap.scss';
gulp.task('sass', () => {
  return gulp
    .src(bootstrapScssPath)
    .pipe(sass())
    .pipe(gulp.dest('client/css'));
});

const bootstrapJsPath =
  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
const jqueryJsPath = 'node_modules/jquery/dist/jquery.min.js';
const chartJsPath = 'node_modules/chart.js/dist/Chart.bundle.min.js';
gulp.task('js', () => {
  return gulp
    .src([bootstrapJsPath, jqueryJsPath, chartJsPath])
    .pipe(gulp.dest('client/js'));
});

gulp.task('default', gulp.parallel('sass', 'js'));
