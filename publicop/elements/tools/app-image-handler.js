import { render } from 'lit-html';
import { elementsDefine } from '../lib/methods';
import { appPopupHandler } from './app-popup-handler';
import { resetAppStyles } from '../lib/app-styles-setter';
import { getViewTemplate } from '../templates/view-elements_templates';

class appImageHandler extends appPopupHandler {
    static get is() { return 'app-image-handler' }
    static get properties() {
        return {
            type: {
                type: String,
                notify: true,
                value: 'image-handler'
            },
            styleElement: {
                type: Object,
                value: function () {
                    if (!document.querySelector('style[scope=image-popup]')) {
                        let style = document.createElement('style')
                        style.setAttribute('scope', 'image-popup')
                        document.head.appendChild(style)
                    }
                    return document.querySelector('style[scope=image-popup]')
                }
            }
        }
    }
    ready() {
        super.ready();
        window.addEventListener('choose-image', (this.openPopup).bind(this));
    }
    openPopup({ detail }) {
        this.METHOD = detail.method
        this.cancelMethod = detail.cancelMethod
        resetAppStyles(true, false)
        /* this._getGalleryPage(detail)
             .then(() => {*/
        this.time = setTimeout(() => {
            render(this.Template(detail), this);
            this.style.display = "block"
            clearInterval(this.time)
        }, 60 * 5);
        //   })
    }
    Template(detail) {
        let template = getViewTemplate.call(this, 'galleries')
        return template.call(this, detail)
    }
    _statusMethod(evt) {
        if (typeof this.METHOD === 'function') this.METHOD(evt)
        this._reset()
    }
    /* async _getGalleryPage({ INFO }) {
         return //import(INFO.areas.element);
     }*/
}

elementsDefine(appImageHandler.is, appImageHandler);
