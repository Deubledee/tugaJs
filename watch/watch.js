const chokidar = require('chokidar');
const { setImported, checkArguments, createEntryFile, addCallback, unlinkCallback } = require("./watch_lib");
const { defaults } = require("./defaults");
const { filter1, filter2 } = defaults.Filters
const filters = [filter1, filter2]
const [LOCATIONS, binaryInterval, interval, persistent] =
    [[filter1.patern, filter2.patern], 300, 100, true]

setImported(defaults)
    .then((Imported) => checkArguments(Imported, defaults))
    .then((Imported) => createEntryFile(Imported, defaults, filters))
    .then(Watch)
    .catch(console.error);

async function Watch(Imported) {
    const chokidarWatcher = chokidar.watch(LOCATIONS, { binaryInterval, interval, persistent });
    chokidarWatcher
        .on('add', addCallback(Imported, defaults, filters))
        .on('unlink', unlinkCallback(Imported, defaults, filters))
}
