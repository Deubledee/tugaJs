const fspromises = require('fs/promises');
const buffer = require('buffer');

const { writeFile, appendFile, readFile } = fspromises;
const { Buffer } = buffer;


async function readJs(FilePath) {
    return readFile(FilePath, { encoding: 'utf-8' });
}
async function readJson(FilePath) {
    let data = await readFile(FilePath, { encoding: 'utf-8' });
    return JSON.parse(data);
}
function AppendJs(Imported, path) {
    const data = getDataBuffer(Imported);
    appendFile(path, data).catch(console.error);
}
function WriteJs(Imported, path) {
    const data = getDataBuffer(Imported);
    writeFile(path, data, 'utf8').catch(console.error);
}
function WriteJson(Imported, path) {
    let save = JSON.stringify(Imported, null, '\t');
    const data = getDataBuffer(save);
    writeFile(path, data, 'utf8').catch(console.error);
}
function getDataBuffer(data) {
    return new Uint8Array(Buffer.from(data));
}

exports.readJs = readJs;
exports.WriteJs = WriteJs
exports.AppendJs = AppendJs;
exports.readJson = readJson;
exports.WriteJson = WriteJson;
