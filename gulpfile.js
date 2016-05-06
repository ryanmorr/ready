var del     = require('del'),
    gulp    = require('gulp'),
    uglify  = require('gulp-uglify'),
    jshint  = require('gulp-jshint'),
    header  = require('gulp-header'),
    plumber = require('gulp-plumber'),
    rename  = require('gulp-rename'),
    mocha   = require('gulp-mocha-phantomjs'),
    package = require('./package.json');

var banner = [
    '/*! ',
        '<%= pkg.name %> ',
        'v<%= pkg.version %> | ',
        '(c) ' + new Date().getFullYear() + ' <%= pkg.author.name %> |',
        ' <%= pkg.homepage %>',
    ' */',
    '\n'
].join('');

var paths = {
    output: 'dist/',
    test: {
        runner: 'test/runner.html',
        specs: 'test/test.*.js'
    },
    scripts: [
        'src/ready.js'
    ]
};

gulp.task('build', ['clean'], function(){
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(header(banner, {pkg: package}))
        .pipe(gulp.dest(paths.output))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(header(banner, {pkg: package}))
        .pipe(gulp.dest(paths.output));
});

gulp.task('clean', function(){
    return del(paths.output);
});

gulp.task('lint', function(){
    return gulp.src(paths.scripts.concat([paths.test.specs]))
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function(){
    return gulp.src(paths.test.runner)
        .pipe(plumber())
        .pipe(mocha());
});

gulp.task('default', [
    'lint',
    'clean',
    'build',
    'test'
]);
