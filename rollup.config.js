import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.homepage} */`;

export default {
    input: 'src/ready.js',
    output: [
        {
            banner,
            name: 'ready',
            file: pkg.browser,
            format: 'umd',
            sourcemap: 'inline'
        },
        {
            banner,
            file: pkg.main,
            format: 'cjs',
            sourcemap: 'inline'
        },
        {
            banner,
            file: pkg.module,
            format: 'esm',
            sourcemap: 'inline'
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs(),
        minify()
    ]
};
