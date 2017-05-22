import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: './es5-esm/index.js',
	dest: './es5/index.js',
	format: 'umd',
	moduleName: 'PreactRangeSlider',
	external: ['preact'],
	globals: {
		preact: 'preact',
	},
	plugins: [
			nodeResolve(
				{
					jsnext: true,
					main: true,
					browser: true,
				}
			),
	],
};
