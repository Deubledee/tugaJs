
import { firebaseApp } from '../../js/firebase';
import { getCredentials } from '../../js/login_lib';
import { getChecksum, setChecksum } from '../util/requests&queries/requests/storage_requests';
import { getBlob } from './app_defalut_http-requests';
import { toggleSpinner } from './methods';
import { shaZam } from './shaZam';

const PROCESSED = {
    clear() {
        this.checkSum = {};
        this.setImages = undefined
        this.Images = false
    },
    checksumJSONReplacer: sha => (key, value) => key === "checksum" ? sha : value
}

async function upload(Table, file, prefix, folder, gallery, setImages = true) {
    //let{ editPostID, editRequestName, createPostID, createRequestName } = Table    
    let ChecksumData = await getChecksum(await GetImageChecksum(file)).catch(error => { console.log(error) })
    if (!ChecksumData) return await storeFile(file, prefix, folder, gallery, setImages)
    return await getStoredFile(ChecksumData)
}
function GetImageChecksum(blob) {
    return shaZam(blob).toSHA('SHA-256')
}
async function getStoredFile(ChecksumData) {
    toggleSpinner(true)
    let { filepath, fileName, checksum, gallery } = ChecksumData
    let resolvedUrls = await resolveUrls(filepath, fileName)
    toggleSpinner(false)
    console.log(filepath, fileName, checksum);
    console.log(resolvedUrls);
    PROCESSED.checkSum = ChecksumData
    PROCESSED.setImages = false
    if (!!resolvedUrls) return new Promise((resolve) => setProcesedImages(resolvedUrls, gallery, resolve))
    /*  return Promise.reject()*/
}
function setProcesedImages(resolvedUrls, gallery, resolve) {
    let { checkSum, setImages } = PROCESSED
    if (!!setImages) resolvedUrls.forEach((resolved, idx) => ChecksumImages(resolvedUrls[idx], resolved))
    resolve({ resolvedUrls, gallery, PROCESSED: checkSum })
    toggleSpinner(false)
};
async function ChecksumImages(resolvedUrls, resolved) {
    let checkSum = await GetImageChecksum(resolved.blob)
    let processedCheckSum = { ...PROCESSED.checkSum, originalChecksum: PROCESSED.checkSum.checksum }
    let checksumData = JSON.stringify(processedCheckSum, PROCESSED.checksumJSONReplacer(checkSum))
    checksumData = btoa(checksumData)
    resolvedUrls.checksum = checkSum
    resolvedUrls.originalChecksum = PROCESSED.checkSum.checksum
    resolvedUrls.checksumData = checksumData
}
async function storeFile(file, prefix, folder, gallery, setImages) {
    PROCESSED.clear.call(PROCESSED)
    if (!!file && (file.size / 1000) > 1000) return Promise.reject(), alert('max size 9999.999 kbytes')
    let [name, meta] = [file.name.split('.')[0], { 'contentType': file.type }]
    let filepath = `${gallery}/${folder}`,
        fileName = `${prefix}-${name}`
    PROCESSED.setImages = setImages
    return new Promise((resolve, reject) => upLoadPromisseCallback
        .call(this, resolve, reject, file, meta, gallery, filepath, fileName))
}
async function upLoadPromisseCallback(resolve, reject, file, meta, gallery, filepath, fileName) {
    let checksum = await shaZam(file).toSHA('SHA-256')
    let checkSumJson = { filepath, fileName, meta, gallery, checksum }
    let storageRef = await firebaseApp.Ref(firebaseApp.storage, `${filepath}/${fileName}`)
    await firebaseApp.upload(storageRef, file)
        .catch(() => console.log('here'))
    onTaskEventStateChanged.call(this, filepath, fileName, gallery, checkSumJson, resolve, reject)
};
function onTaskEventStateChanged(filepath, fileName, gallery, checkSumJson, resolve, reject) {
    PROCESSED.Images = true
    PROCESSED.checkSum = checkSumJson
    setTimeout(() => finalize.call(this, filepath, fileName, gallery, resolve, reject), 5000);
}
async function finalize(filepath, fileName, gallery, resolve, reject) {
    await resolveUrls(filepath, fileName)
        .then(resolvedUrls => setProcesedImages(resolvedUrls, gallery, resolve))
        .catch(error => console.log(error) && reject())
    return
}
async function resolveUrls(filepath, fileName, counter = 0, result) {
    if (counter === 10 && result.length < 4) throw 'resolveUrls resized images reached 10 trys'
    const listRef = firebaseApp.Ref(firebaseApp.storage, filepath);
    let { items } = await firebaseApp.listAll(listRef)
    result = resolveList(items, fileName)
    if (!result) throw 'no result'
    if (result.length < 4) return resolveUrls(filepath, fileName, ++counter, result)
    return getUrls(result)
}
function resolveList(data, name) {
    let files = data.filter(item => item.name.includes(name))
    if (!files.length) return !!files.length
    return files
}
async function getUrls(files, idx = 0, urls = []) {
    let fileData = await getFileData(files[idx], true)
    urls.push(fileData)
    if (urls.length === files.length) return urls
    return getUrls(files, ++idx, urls)
}
async function getFileData(file) {
    let url = await firebaseApp.getDownloadURL(file)
    let meta = await firebaseApp.getMetadata(file)
    let blob = await getBlob(url)
    let { size, name, fullPath } = meta
    return { size, name, fullPath, url, blob }
}
function saveImagesChecksum(resolvedUrls) {
    resolvedUrls
        .forEach(async result => {
            let checkSum = await GetImageChecksum(result.blob)
            let checksumData = btoa(JSON.stringify(PROCESSED.checkSum, PROCESSED.checksumJSONReplacer(checkSum)))
            setChecksum(checkSum, checksumData)
        })
}


export {
    upload,
    shaZam,
    getChecksum,
    getCredentials,
    GetImageChecksum
};
/**
 * ! deprecated
 *  @param {removeImage, detail, chooseImagePopupCallBack} DEPRECATED
 * */
function removeImage(idx, canRemove) {
    this.IMAGES.splice(idx, idx + 1)
    canRemove()
}
function detail(resolvedUrls, gallery, resolve, reject) {
    let [{ message, tableAssets }, type, images, cancelMethod, method] =
        [this.chooseImage[this.lang], 'chooseImage', resolvedUrls, () => reject(),
        imageIndex => chooseImagePopupCallBack.call(this, imageIndex, gallery, resolvedUrls, resolve)]
    return { type, images, message, tableAssets, cancelMethod, method }
}
