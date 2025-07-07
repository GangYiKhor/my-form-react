import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	base: './',
	root: './documentations',
	plugins: [react()],
	build: {
		outDir: '../build',
		emptyOutDir: true,
		chunkSizeWarningLimit: 10000,
		rollupOptions: {
			output: {
				entryFileNames: `[name]-[hash].js`,
				chunkFileNames: `[name]-[hash].js`,
				assetFileNames: `[name]-[hash].[ext]`,
			},
		},
	},
});
