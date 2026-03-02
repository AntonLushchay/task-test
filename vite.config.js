import path from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
	base: '/task-test/',
	css: {
		devSourcemap: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
});
