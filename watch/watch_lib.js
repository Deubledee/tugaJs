const { getLogColors } = require("./getLogColors");
const { readJson, readJs, WriteJs, WriteJson, AppendJs } = require("./watch-fs_lib");

async function setImported({ importedFilePath }) {
    let Imported = readJson(importedFilePath)
    return Imported
}
async function checkArguments(Imported, defaults) {
    if (process.argv.length >= 3 && process.argv[2].includes('-i'))
        defaults.importsFilePath = `.${process.argv[3]}`;
    return Imported
}
function createEntryFile(Imported, defaults, filters) {
    let { importsFilePath } = defaults
    if (!Object.keys(Imported).length)
        readJs(importsFilePath, { encoding: 'utf-8' })
            .then(fileList => {
                let files = fileList.split('import ')
                files = files.map(RemoveFromString => cleanString(RemoveFromString, filters))
                updateImportedJson(Imported, defaults, files, false)
                defaults.update = false
            })
    return Imported
}
function addCallback(Imported, defaults, filters) {
    return path => path && Add(Imported, path, defaults, filters).catch((error) => console.log(error));
}
function unlinkCallback(Imported, defaults, filters) {
    return path => path && unlink(Imported, path, defaults, filters).catch((error) => console.log(error));
}

async function Add(Imported, path, defaults, filters) {
    Update(Imported, path, defaults, filters)
}
async function unlink(Imported, path, defaults, filters) {
    Update(Imported, path, defaults, filters, true)
}
function Update(Imported, path, defaults, filters, remove = false) {
    let files = cleanString(path, filters)
    updateImportedJson(Imported, defaults, [files], remove)
    let [updateLog, linkedLog] = getLogColors(remove, defaults, path)
    if (defaults.update) updateImportsJs(Imported, defaults, files, remove)
    !defaults.update ? console.log(...linkedLog) : console.log(...updateLog)
    defaults.update = false
}
function updateImportedJson(Imported, defaults, files, remove) {
    let notImported = !remove ? files.filter(file =>
        defaults.exeptions.find(execption => file.Cleaned.includes(execption)) ? false :
            !Imported[file.KeyCleaned]) : []
    let { importedFilePath } = defaults
    if (!!notImported.length) {
        notImported.forEach(file => Imported[file.KeyCleaned] = `import \"${file.Cleaned.replaceAll("'", "")}\";\n`)
        defaults.update = true
    }
    if (!!remove) {
        files.forEach(file => Reflect.deleteProperty(Imported, file.KeyCleaned))
        defaults.update = true
    }
    !!defaults.update && WriteJson(Imported, importedFilePath)
}
function updateImportsJs(Imported, defaults, { KeyCleaned }, remove = false) {
    let { importsFilePath } = defaults,
        args = [Imported[KeyCleaned], importsFilePath]
    if (!remove) return AppendJs(...args)
    let fileUpdated = Object.keys(Imported).map(key => Imported[key]).join('\n')
    WriteJs(fileUpdated, importsFilePath)
}
function cleanString(RemoveFromString, filters) {
    let Cleaned = RemoveFromString;
    Cleaned = Cleaned.replaceAll('"', "").replaceAll('\n', "");
    let filtred = filters.filter(filter => Cleaned.includes(filter.patern)).pop();
    Cleaned = Cleaned.replaceAll(filtred.patern, filtred.replace);
    let KeyCleaned = Cleaned.replaceAll("'", "").replaceAll(";", "");
    return { Cleaned, KeyCleaned };
}


exports.setImported = setImported
exports.checkArguments = checkArguments
exports.addCallback = addCallback
exports.unlinkCallback = unlinkCallback
exports.createEntryFile = createEntryFile
