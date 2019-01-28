import pkg from './package.json';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import header from 'gulp-header';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import del from 'del';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import { Server } from 'karma';

const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.homepage} */\n`;

const config = {
    files: './src/**/*.js',
    entryFile: './src/ready.js',
    outputFile: 'ready.js',
    outputDir: './dist/',
    specs: './test/specs/**/*.js'
};

const karmaConfig = {
    basePath: __dirname,
    frameworks: ['browserify', 'mocha', 'chai', 'sinon', 'source-map-support'],
    files: [config.specs],
    preprocessors: {[config.specs]: ['browserify']},
    browserify: {
        debug: true,
        transform: [
            ['babelify', {plugins: ['istanbul']}]
        ]
    },
    coverageReporter: {
        type: 'html',
        dir: './test/coverage/'
    },
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    singleRun: true
};

gulp.task('clean', () => {
    return del.sync([config.outputDir]);
});

gulp.task('build', ['clean'], () => {
    return browserify(config.entryFile, {debug: true, standalone: pkg.name})
        .transform(babelify)
        .bundle()
        .pipe(source(config.outputFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(header(banner, {pkg}))
        .pipe(gulp.dest(config.outputDir))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(header(banner, {pkg}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task('lint', () => {
    return gulp.src(['./gulpfile.babel.js', config.files, config.specs])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
    karmaConfig.reporters = ['mocha'];
    new Server(karmaConfig, (code) => {
        process.exit(code);
    }).start();
});

gulp.task('coverage', () => {
    karmaConfig.reporters = ['mocha', 'coverage'];
    new Server(karmaConfig, (code) => {
        process.exit(code);
    }).start();
});

gulp.task('watch', () => {
    gulp.watch(['./gulpfile.babel.js', config.files, config.specs], ['lint', 'test']);
});

gulp.task('default', [
    'lint',
    'coverage',
    'build',
    'watch'
]);
