'use strict';

import path from 'path';
import { DefinePlugin } from 'webpack';

module.exports = {
	target: 'node',
	mode: 'development',
	context: path.join(__dirname, 'src'),
	resolve: {
		extensions: ['.js', '.ts'],
		modules: [
			path.join(__dirname, './src'),
			"node_modules"
		]
	},
	devtool: 'source-map',
	optimization: {
		minimize: false
	},
	externals: [
		"electron-builder"
	],
	entry: {
		"./easy-builder.js": ['./easy-builder.ts']
	},
	output: {
		filename: '[name]',
		path: __dirname + '/out'
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				use: ['ts-loader'],
			},
			{
				test: /\.(ya?ml|iss)$/,
				use: 'raw-loader' // 使用 raw-loader 来获取文件内容作为字符串
			}
		]
	},
	plugins: [
		new DefinePlugin({
			__IN_DEBUG__: JSON.stringify(true)
		})
	],
};