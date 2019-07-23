const gulp = require('gulp');
const sass = require('gulp-sass');

const bootstrapScssPath = 'node_modules/bootstrap/scss/bootstrap.scss';
const fontAwesomeCssPath = 'node_modules/@fortawesome/fontawesome-free/css/all.min.css';
gulp.task('sass', () => {
  return gulp
    .src([bootstrapScssPath, fontAwesomeCssPath])
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

const fontAwesomePath = 'node_modules/@fortawesome/fontawesome-free/webfonts/**.*';
gulp.task('icons', () => {
  return gulp
    .src(fontAwesomePath)
    .pipe(gulp.dest('client/webfonts/'));
});

gulp.task('default', gulp.parallel('sass', 'js', 'icons'));
