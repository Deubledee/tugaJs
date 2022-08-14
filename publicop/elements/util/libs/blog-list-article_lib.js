import { getBlob } from '../../lib/app_defalut_http-requests';
import { _getNoCarigeReturn } from '../../lib/methods'

function setImagesBlobs(textElement) {
    Array.from(textElement.querySelectorAll('img'))
        .forEach(imgElement => getBlob(imgElement.src)
            .then(blob => imgElement.src = URL.createObjectURL(blob)))
}
function decodeArticle(articlecontent) {
    return atob(articlecontent.article)
}

function _getShortVersion(description) {
    let te = description.split('')
    let splice = !!this.previous ? 60 : 100
    te.splice(splice, te.length)
    te = te.join('')
    te = te.split(' ')
    te.pop()
    te = te.join(' ') + '...'
    return te
}
export {
    decodeArticle,
    setImagesBlobs,
    _getShortVersion,
    _getNoCarigeReturn
}
