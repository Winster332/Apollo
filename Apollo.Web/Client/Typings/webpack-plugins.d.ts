declare module 'speed-measure-webpack-plugin' {
	import { Configuration } from 'webpack';

	interface SpeedMeasurePlugin {
		new(): { wrap(config: Configuration): Configuration };
	}

	const plugin: SpeedMeasurePlugin;

	export = plugin;
}

declare module 'webpack-bundle-analyzer' {
	import { Plugin } from 'webpack';

	export class BundleAnalyzerPlugin extends Plugin {
	}
}

declare module 'purifycss-webpack-fixed' {
	import { Plugin } from 'webpack';

	class PurifyCSSPlugin extends Plugin {
	}

	interface PurifyCSSPluginConstructor {
		new (opts: any): PurifyCSSPlugin;
	}

	const plugin: PurifyCSSPluginConstructor;

	export = plugin;
}

declare module 'recursive-readdir-sync' {
	const read: (path: string) => string[];

	// eslint-disable-next-line import/no-default-export
	export default read;
}