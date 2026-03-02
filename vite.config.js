import path from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
	base: '/votpo-test/',
	css: {
		devSourcemap: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
});
