
var fs = require('fs');
var path = require('path');

var adminRoot = path.resolve(__dirname, '..');
var vendorDir = path.join(adminRoot, 'vendor');
var outJs = path.join(vendorDir, 'uppy.min.js');
var outCss = path.join(vendorDir, 'uppy.min.css');

function readIfExists(p) {
    if (!fs.existsSync(p)) {
        return '';
    }
    return fs.readFileSync(p, 'utf8');
}

async function main() {
    var esbuild;
    try {
        esbuild = require('esbuild');
    } catch (e) {
        console.error(
            'esbuild gerekli — webmodules/admin icinde: npm install esbuild @uppy/core @uppy/drag-drop @uppy/progress-bar',
        );
        process.exit(1);
    }

    var entryPath = path.join(__dirname, '_uppy-vendor-entry.js');
    if (!fs.existsSync(entryPath)) {
        console.error('entry dosyasi yok:', entryPath);
        process.exit(1);
    }

    if (!fs.existsSync(vendorDir)) {
        fs.mkdirSync(vendorDir, { recursive: true });
    }

    var result = await esbuild.build({
        entryPoints: [entryPath],
        bundle: true,
        minify: true,
        format: 'iife',
        globalName: 'mxAdminUppyLib',
        outfile: outJs,
        legalComments: 'none',
        target: ['es2018'],
    });

    if (result.errors && result.errors.length) {
        console.error(result.errors);
        process.exit(1);
    }

    var cssParts = [
        readIfExists(
            path.join(adminRoot, 'node_modules', '@uppy/core', 'dist', 'style.min.css'),
        ),
        readIfExists(
            path.join(
                adminRoot,
                'node_modules',
                '@uppy/drag-drop',
                'dist',
                'style.min.css',
            ),
        ),
        readIfExists(
            path.join(
                adminRoot,
                'node_modules',
                '@uppy/progress-bar',
                'dist',
                'style.min.css',
            ),
        ),
    ].filter(function (p) {
        return p && p.length;
    });

    var cssBanner =
        '\n';
    fs.writeFileSync(outCss, cssBanner + cssParts.join('\n'), 'utf8');

    var jsBanner =
        '\n';
    var jsBody = fs.readFileSync(outJs, 'utf8');
    fs.writeFileSync(outJs, jsBanner + jsBody, 'utf8');

    console.log('OK vendor:', outJs, outCss);
}

main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
