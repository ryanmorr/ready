const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const specs = 'test/specs/**/*.js';

module.exports = function(config) {
    config.set({
        basePath: __dirname,
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [specs],
        preprocessors: {
            [specs]: ['rollup']
        },
        rollupPreprocessor: {
            output: {
                format: 'esm',
                sourcemap: 'inline'
            },
            plugins: [
                resolve(),
                commonjs()
            ]
        },
        reporters: ['mocha'],
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        singleRun: true
    });
};
