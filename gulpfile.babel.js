import pkg from './package.json';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import header from 'gulp-header';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import mocha from 'gulp-mocha-phantomjs';
import browserify from 'browserify';
import babelify from 'babelify';
import del from 'del';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const banner = '/*! ${pkg.name} v${pkg.version} | ${pkg.homepage} */\n';

const config = {
    src: {
        files: './src/**/*.js',
        entryFile: './src/ready.js',
        outputFile: 'ready.js',
        outputDir: './dist/'
    },
    test: {
        runner: './test/runner.html',
        specs: './test/specs/*.js',
        entryFile: './test/specs/ready.js',
        outputDir: './test/',
        outputFile: 'tests.js'
    }
};

gulp.task('clean', () => {
    return del.sync([config.src.outputDir]);
});

gulp.task('clean:test', () => {
    return del.sync([config.test.outputDir + config.test.outputFile]);
});

gulp.task('build', ['clean'], () => {
    return browserify(config.src.entryFile, {debug: true, standalone: pkg.name})
        .transform(babelify)
        .bundle()
        .pipe(source(config.src.outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(header(banner, {pkg}))
        .pipe(gulp.dest(config.src.outputDir))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(header(banner, {pkg}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.src.outputDir));
});

gulp.task('build:test', ['clean:test'], () => {
    return browserify(config.test.entryFile)
        .transform(babelify)
        .bundle()
        .pipe(source(config.test.outputFile))
        .pipe(buffer())
        .pipe(gulp.dest(config.test.outputDir));
});

gulp.task('lint', () => {
    return gulp.src(['./gulpfile.babel.js', config.src.files, config.test.specs])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', ['build:test'], () => {
    return gulp.src(config.test.runner)
        .pipe(mocha());
});

gulp.task('watch', () => {
    gulp.watch(['./gulpfile.babel.js', config.src.files, config.test.specs], ['lint', 'test']);
});

gulp.task('default', [
    'lint',
    'test',
    'build',
    'watch'
]);
