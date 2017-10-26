const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const minify = require('gulp-minify');
const prettyDiff = require('gulp-prettydiff');
const runSequence = require('run-sequence').use(gulp);
const typescript = require('gulp-typescript');

let del = require('del');
let path = require('path');

const DIST = 'build';
let dist = function(subpath) {
    return !subpath ? DIST : path.join(DIST, subpath);
};

gulp.task('typescript', function () {

    const tsConfig = typescript.createProject('tsconfig.json');

    return gulp.src('src/**/*.ts')
        .pipe(tsConfig())
        .pipe(gulp.dest('build/ts'));

});

gulp.task('babel-es6', function () {

    return gulp.src('./build/ts/**/*.js')
        .pipe(babel({
            plugins: [['transform-es2015-modules-commonjs', {
                "modules": "umd",
                "allowTopLevelThis": false
            }]],

            sourceMaps: 'inline',
            auxiliaryCommentBefore: 'istanbul ignore next'
        }))
        .pipe(gulp.dest('./build/es6'));

});

gulp.task('webpack-es6', ['babel-es6'], function () {

    return gulp.src('./build/es6/index.js')
        .pipe(webpack({
            output: {
                filename: 'log4js2.js',
                library: 'log4js',
                libraryTarget: 'umd'
            }
        }))
        .pipe(gulp.dest('./build/es6'));

});

gulp.task('compress-es6', ['webpack-es6'], function () {
    return gulp.src('./build/es6/log4js2.js')
        .pipe(prettyDiff({
            lang: "javascript",
            miniwrap: true,
            mode: 'minify',
            objsort: 'none',
            wrap: 1000
        }))
        .pipe(rename('log4js2.min.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('test', function () {
    return gulp.src('./test/*.js')
        .pipe(mocha());
});


// Clean output directory
gulp.task('clean', function() {
    return del(['.tmp', dist()]);
});

gulp.task('build', ['clean'], function(callback) {
    runSequence('typescript',
        ['babel-es6', 'webpack-es6', 'compress-es6'],
        'test',
        callback);
});

