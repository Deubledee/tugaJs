
import { getBlob } from '../../../js/lib/http-handler'
import { includeStyles } from '../../templates/lib/article-template_lib';
import { resetForm } from '../../lib/methods';
import { getInfo } from '../cacheStates&Listners/infoCache';
import { callChooseImagePopup } from '../../lib/warnings';

export const Methods = {
    includeStyles,
    resetForm,
    callGalleryPopup() {
        let [INFO, { lang, _category: category }] = [getInfo('viewsInfo', 'galleries'), this]
        callChooseImagePopup({
            INFO, lang,
            category,
            method: this._setValue.bind(this),
            cancelMethod: () => this.resetForm(false)
        })
    },
    setEdit(edit) {
        if (!edit) return this.close = true
        let Content = edit
        if (!!this.imageproperty && !!Content[this.imageproperty]) {
            if (!Content[this.imageproperty].length)
                Content[this.imageproperty] = [{ url: this.defaultNoimage, title: 'default no image' }]
            return this._setValue(Content[this.imageproperty])
        }
        if (!this.imageproperty && !!Content.images &&
            !!Content.images[0] && !!Content.images[0].url) {
            this._setValue(Content.images[0].url)
        }
    },
    _setValue(data) {
        if (!data.constructor.name === 'Array') data = [data]
        return data.forEach(image => this._getImageSrc(image))
    },
    async _getImageSrc(image) {
        let { blob, url } = image, objUrl
        if (!blob) blob = await getBlob(url)
        objUrl = URL.createObjectURL(blob)
        this.resetValue(objUrl, image)
    },
    resetValue(blob, { url, title }) {
        if (!!url) {
            this.value = JSON.stringify({ url, title })
            if (!!this._imageDefaultUrlIsSet) {
                this.imageSrcs = []
                this._imageDefaultUrlIsSet = false
            }
            this.imageSrcs = !!this.multiimage ? [...this.imageSrcs, blob] : [blob]
            if (!!this._imageDefaultUrlIsSet) {
                this.imageSrcs = [this.defaultNoimage]
                this.showremove = false
            }
            /*   if (!!this._imageDefaultUrlIsSet) {
                 this.values = this.imageSrcs = []
                 this._imageDefaultUrlIsSet = false
             }          
                this.values = !!this.multiimage ? [...this.values, url] : [url]*/
        }
        this.close = false
    },
    _remove({ model }) {
        let { __data: element } = model
        if (!!this.multiimage) {
            this.imageSrcs = this.imageSrcs.filter(Src => Src !== this.imageSrcs[element.index])
            this._imageDefaultUrlIsSet = !this.imageSrcs.length
            if (!!this._imageDefaultUrlIsSet) this.resetValue(false)
            return
        }
        this._imageDefaultUrlIsSet = true
        this.resetValue(false)
    }
}
