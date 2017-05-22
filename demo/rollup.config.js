import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: './es2015/demo/src/index.js',
	dest: './scripts/index.js',
	format: 'iife',
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
