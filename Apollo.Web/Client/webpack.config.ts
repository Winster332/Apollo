import CopyWebpackPlugin = require('copy-webpack-plugin');
import PnpWebpackPlugin = require('pnp-webpack-plugin');
import SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { AppNamesFile, getApps, ImportFile } from './ExportableApp';

const apps = getApps();

const importFile = new ImportFile('./Apps.ts');
const appNamesFile = new AppNamesFile('./AppNames.ts');

importFile.generate(apps);
appNamesFile.generate(apps);

type Environment = {
	analyze: boolean;
};

type WebpackOptions = {
	mode: 'development' | 'production',
	watch: boolean
};

module.exports = (env: Environment | undefined, options: WebpackOptions) => {
	const tsChecker = options.watch ?
		new ForkTsCheckerWebpackPlugin({
			formatter: 'codeframe'
		}) :
		new ForkTsCheckerWebpackPlugin({
			eslint: {
				files: '**/*.{ts,tsx}',
			}
		});

	let config: webpack.Configuration = {
		context: __dirname,
		stats: 'errors-only',
		entry: {
			bundle: './index.ts',
		},
		output: {
			path: path.join(__dirname, 'bundles'),
			filename: chunk => chunk.chunk.name + '.js'
		},
		devtool: options.mode === 'development' ? 'inline-source-map' : undefined,
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
				},
				{
					test: /\.(woff|woff2|svg|eot|ttf|png|jpg|gif)$/,
					use: [{
						loader: 'url-loader',
						options: {
							limit: 10000
						}
					}]
				},
				{
					test: /\.json$/,
					use: 'json-loader'
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.json'],
			plugins: [
				PnpWebpackPlugin,
			],
			alias: {
				'lodash$': 'lodash-es'
			}
		},
		resolveLoader: {
			plugins: [
			PnpWebpackPlugin.moduleLoader(module),
			],
		},
		plugins: [
			tsChecker,
			new CopyWebpackPlugin([
				{
					from: path.join(__dirname, 'serverShims.js'),
					to: path.join(__dirname, 'bundles', 'serverShims.js')
				}
			])
		]
	};

	if (env && env.analyze) {
		if (config.plugins) {
			config.plugins.push(new BundleAnalyzerPlugin());
			config.plugins.push(new webpack.debug.ProfilingPlugin());
		}

		config = new SpeedMeasurePlugin().wrap(config);
	}

	return config;
};