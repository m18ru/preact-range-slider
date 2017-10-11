import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	input: './es2015/demo/src/index.js',
	output: {
		file: './scripts/index.js',
		format: 'iife',
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
