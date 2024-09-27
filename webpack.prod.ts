'use strict';

import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { BannerPlugin, DefinePlugin } from 'webpack';

module.exports = {
    target: 'node',
    mode: 'production',
    context: path.join(__dirname, 'src'),
    resolve: {
        extensions: ['*', '.js', '.ts'],
        modules: [
            path.join(__dirname, './src'),
            "node_modules"
        ]
    },
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: false,
                        drop_debugger: true
                    }
                }
            })
        ]
    },
    entry: {
        "./easy-builder.js": ['./easy-builder.ts']
    },
    output: {
        filename: '[name]',
        path: __dirname + '/bin'
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: ['ts-loader'],
            },
            {
				test: /\.ya?ml$/,
				use: 'raw-loader' // 使用 raw-loader 来获取文件内容作为字符串
			}
        ]
    },
    plugins: [
        new BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
        new DefinePlugin({
            __IN_DEBUG__: JSON.stringify(false)
        })
    ],
};