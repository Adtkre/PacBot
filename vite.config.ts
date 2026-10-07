import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        // Generate output that doesn't have hashes, for a simple Chrome extension setup
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'popup.html'),
                content: resolve(__dirname, 'src/content/main.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
