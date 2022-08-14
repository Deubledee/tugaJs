import { assertResponse } from '../../../../js/lib/asserts';
import { _getMedia, _postMedia } from '../../../lib/app_defalut_http-requests';
import { getArticleAndCategory } from './default_requests/category-article_requests.js';


async function removeUserGallery(gallery, del = false) {
    let query = `removeUserGallery(projectId: "${localStorage['app-id']}", galleryRoot: "${this.galleryRoot}", gallery: "${gallery}", delete:${del}) {
                    ... on Error {
                        errorStatus,
                        errorMessage,
                        okMessage
                    }
                }`
    return await _postMedia(query)
        .then(res => assertResponse('singleType', 'removeUserGallery', res, res.json(),
            'removeUserGallery response returned an errorMessage'))
        .catch(error => { throw error })
}

async function removeImageFromGallery(image, forever = false) {
    let query = `removeImageFromGallery(projectId: "${localStorage['app-id']}", galleryRoot: "${this.galleryRoot}", gallery: "${this.activeForm}", image: "${image}", forever:${forever}) {
                    ... on Error {
                        errorStatus,
                        errorMessage,
                        okMessage
                    }
                }`
    return await _postMedia(query)
        .then(res => assertResponse('singleType', 'removeImageFromGallery', res, res.json(),
            'removeImageFromGallery response returned an errorMessage'))
        .catch(error => { throw error })
}


async function getGalleryImages(removed) {
    let query = `getGalleryImages(projectId: "${localStorage['app-id']}", gallery:"${this.gallery}", removed: ${removed}) {
                    ... on Images {
                                url
                                gallery
                                contentType
                                chechsum
                                title
                            }
                    ... on EMPTY { empty }
                    ... on Error { errorStatus errorMessage }
                }`
    return await _getMedia(query)
        .then(res => assertResponse('singleType', 'getGalleryImages', res, res.json(), 'response returned an errorMessage'))
        .catch(error => { throw error })
}

async function createUserGallery(author, gallery) {
    let query = `createUserGallery(projectId: "${localStorage['app-id']}", galleryRoot: "${this.galleryRoot}", author: "${author}", gallery: "${gallery}") {
                    ... on Error {
                        errorStatus,
                        errorMessage,
                        okMessage
                    }
                }`
    return await _postMedia(query)
        .then(res => assertResponse('singleType', 'createUserGallery', res, res.json(),
            'createUserGallery response returned an errorMessage'))
        .catch(error => { throw error })
}

async function addImageToUserGallery(image) {
    let query = `addImageToUserGallery(projectId: "${localStorage['app-id']}", galleryRoot: "${this.galleryRoot}", gallery: "${this.activeForm}", image: "${image}") {
                    ... on Error {
                        errorStatus,
                        errorMessage,
                        okMessage
                    }
                }`
    return await _postMedia(query)
        .then(res => assertResponse('singleType', 'addImageToUserGallery', res, res.json(),
            'addImageToUserGallery response returned an errorMessage'))
        .catch(error => { throw error })
}

export {
    createUserGallery, getArticleAndCategory, addImageToUserGallery, removeUserGallery, removeImageFromGallery, getGalleryImages
};
