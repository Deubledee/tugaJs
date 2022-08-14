
const defaults = {
    update: false,
    importsFilePath: './publicop/elements/lazy-imports.js',
    importedFilePath: './imported-files.json',
    exeptions: [
        'lazy-imports.js',
        'main-app.js'
    ],
    Filters: {
        filter1: {
            patern: 'publicop/js',
            replace: '../js'
        },
        filter2: {
            patern: 'publicop/elements/',
            replace: './'
        }
    }
};

exports.defaults = defaults;
