const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const webpack = require('gulp-webpack');
const minify = require('gulp-minify');
const prettyDiff = require('gulp-prettydiff');
const runSequence = require('run-sequence');

let del = require('del');
let path = require('path');

const DIST = 'dist';
let dist = function(subpath) {
    return !subpath ? DIST : path.join(DIST, subpath);
};

// lint the JavaScript
gulp.task('lint', () => {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('babel-es6', function () {

    return gulp.src('./src/**/*.js')
        .pipe(babel({
            plugins: [['transform-es2015-modules-commonjs', {
                "allowTopLevelThis": false,
                "modules" : "umd"
            }]],
            sourceMaps: 'inline',
            auxiliaryCommentBefore: 'istanbul ignore next'
        }))
        .pipe(gulp.dest('./dist/es6'));

});

gulp.task('babel-es5', function () {

    return gulp.src('./src/**/*.js')
        .pipe(babel({
            presets: ['es2015-loose'],
            plugins: [['transform-es2015-modules-commonjs', {
                "allowTopLevelThis": false,
                "strict": false,
                "loose": "es6.modules",
                "modules" : "umd"
            }]],
            sourceMaps: 'inline',
            auxiliaryCommentBefore: 'istanbul ignore next'
        }))
        .pipe(gulp.dest('./dist/es5'));

});

gulp.task('webpack-es5', ['babel-es5'], function () {

    return gulp.src('./dist/es5/index.js')
        .pipe(webpack({
            output: {
                filename: 'log4js2.js',
                library: 'log4js',
                libraryTarget: 'umd'
            }
        }))
        .pipe(gulp.dest('./dist/es5'));

});

gulp.task('webpack-es6', ['babel-es6'], function () {

    return gulp.src('./dist/es6/index.js')
        .pipe(webpack({
            output: {
                filename: 'log4js2.js',
                library: 'log4js',
                libraryTarget: 'umd'
            }
        }))
        .pipe(gulp.dest('./dist/es6'));

});

gulp.task('compress-es6', ['webpack-es6'], function () {
    return gulp.src('./dist/es6/log4js2.js')
        .pipe(prettyDiff({
            lang: "javascript",
            miniwrap: true,
            mode: 'minify',
            objsort: 'none',
            wrap: 1000
        }))
        .pipe(rename('log4js2.es6.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('compress-es5', ['webpack-es5'], function () {
    return gulp.src('./dist/es5/log4js2.js')
        .pipe(uglify({}))
        .pipe(rename('log4js2.es5.min.js'))
        .pipe(gulp.dest('./dist'));
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
    runSequence('lint',
        ['babel-es5', 'webpack-es5', 'compress-es5'],
        ['babel-es6', 'webpack-es6', 'compress-es6'],
        'test',
        callback);
});

