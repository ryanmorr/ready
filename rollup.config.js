import fs from 'node:fs/promises';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import generatePackageJSON from 'rollup-plugin-generate-package-json';

export default async () => {
    const pkg = JSON.parse(await fs.readFile('package.json'));
    const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.homepage} */`;

    return {
        input: 'src/ready.js',
        output: [
            {
                banner,
                name: 'ready',
                file: pkg.browser,
                format: 'umd'
            },
            {
                banner,
                file: pkg.main,
                format: 'cjs',
                plugins: [
                    generatePackageJSON({
                        baseContents: {
                            type: 'commonjs'
                        },
                        outputFolder: 'dist/cjs'
                    })
                ]
            },
            {
                banner,
                file: pkg.module,
                format: 'esm'
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            terser()
        ]
    };
};
