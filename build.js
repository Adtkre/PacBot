const { build } = require('esbuild');
const fs = require('fs');

async function runBuild() {
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    await build({
        entryPoints: ['src/content/main.ts'],
        bundle: true,
        outfile: 'dist/content.js',
        format: 'iife'
    });

    await build({
        entryPoints: ['src/popup/popup.ts'],
        bundle: true,
        outfile: 'dist/popup.js',
        format: 'iife'
    });

    fs.copyFileSync('public/manifest.json', 'dist/manifest.json');
    fs.copyFileSync('popup.html', 'dist/popup.html');

    console.log("Build complete!");
}

runBuild();
