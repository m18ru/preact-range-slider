import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	input: './es5-esm/index.js',
	output: {
		file: './es5/index.js',
		format: 'umd',
		name: 'PreactRangeSlider',
	},
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
