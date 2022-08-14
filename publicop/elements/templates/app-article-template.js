
import { html, PolymerElement } from '@polymer/polymer';
import { setHrefs } from "../../js/urlQueryToObject";
import { mixInScope, getInviewState } from '../lib/methods';
import { includeStyles, _registerSize, imageTemplate } from './lib/article-template_lib';

if (module.hot) module.hot.accept()
import { render } from 'lit-html';
export class AppArticleTemplate extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                box-sizing: border-box;
            }    
            article::before{
                content: normal;
            }
            .article {
                position: relative;  
                min-height: 0px;
                max-width: 0%;
                border-radius: 10px;
                overflow: hidden;
                background-image: linear-gradient(-138deg, #ced2d8 0%, #ffffff  14%);
               /* box-shadow: 11px 3px 77px -27px rgb(0 0 0);*/
                box-shadow: 0px 5px 11px -2px rgb(162 162 162);
                visibility: hidden;
                filter: blur(2px);
            }  
            article[show] {
                display: grid;
                grid-template-columns: [col1] 40% [col2] 60%;
                grid-template-rows: [row3] 220px;
                grid-template-areas:
                    "images text";
                align-items: center;   
                max-width: 95%;
                min-width: 100%;       
                box-sizing: border-box; 
                visibility: visible;
                filter: blur(0px);
                transition: filter .5s ease-in .5s, visibility .5s ease-in .5s;
            }  
            article[reverse] {
                grid-template-columns: [col1] 60% [col2] 40%;
                grid-template-areas:
                    "text images";
                background-image: linear-gradient(138deg, #ced2d8 0%, #ffffff 14%);  
            } 
           section[reverse] {                
                text-align: left;
            }  
            .article section {
                box-sizing: border-box;
             /*   margin-left: auto;
                margin-right: auto;*/
                text-shadow: 0px 0px 0px #374156;
            }
            .img-section {
                display: grid;
                align-items: center;
                box-sizing: border-box;
                overflow: hidden;   
                width: 100%;
                height: 100%; 
            }
            .description-section,  
            .text-section {
                font-size: 1.4em;
                color: var(--app-secondary-text-color);
                box-sizing: border-box;
                word-break: break-word;
                line-height: 36px;
            }         
            ::slotted(div[halfheight]) {
                display: block;
                width: 100%;
                height: 150px;
                --iron-image-width: 100%;
                pointer-events: none;
                margin-left: auto;
                margin-right: auto; 
            } 
            :-webkit-any(article, aside, nav, section) :-webkit-any(article, aside, nav, section) h1 {
                font-size: 2em!important;
                margin-block-start: 0.67em!important;
                margin-block-end: 0.67em!important;
            }
            ${this._getStyles}
        </style>
        ${this._getArticleTemplate}
        `
    }
    static get is() { return 'app-article-template' }
    static get _getStyles() {
        return html``
    }
    static get _getArticleTemplate() {
        return html``
    }
    static get properties() {
        return {
            article: Object,
            lang: String,
            reverse: Boolean,
            show: Boolean,
            index: Number,
            current: Number,
            imagesOrder: Array,
            category: Object,
            content: Object,
            setArticleLinks: Object,
            offsetStart: {
                type: Number,
                value: 200
            },
            offsetEnd: {
                type: Number,
                value: 250
            },
            heightOffset: {
                type: Number,
                value: 100
            },
            options: {
                type: Object,
                value: {
                    modules: {
                        "toolbar": false,
                    },
                    placeholder: '',
                    theme: ''
                },
            },
        }
    }
    connectedCallback() {
        super.connectedCallback();
    }
    ready() {
        super.ready();
        mixInScope.call(this, { includeStyles })
    }
    setHrefs(query) {
        if (query) setHrefs.call(this, query, this.category, this.ElementName)
    }
    _getArticlelang() {
        return this.lang
    }
    _getInviewState(args) {
        return getInviewState.call(this, args)
    }
    _getArticleId() {
        return this.article.id
    }
    _getArticleSubject() {
        return this.article.subject[0]
    }
    _getArticleSubjectLang() {
        return this.subject
    }
    _getArticleName() {
        return this.article.articleName
    }
    toReverseOrNotToReverse(index) {
        let reversed = !(index % 2)
        if (!!reversed) this.reverse = !!reversed
        return reversed
    }
    _slotFristImage(data, element) {
        let elementScope = !!element && element.tagName ? element : this
        if (!!data.images && data.images.join && data.images.length > 0)
            render(imageTemplate.call(this, data)(data.images), elementScope)
    }
    _getImageTemplate(data) {
        if (!!data.images && data.images.join && data.images.length > 0)
            return imageTemplate.call(this, data)(data.images)
    }
    setStyles(strings, ...values) {
        return `  
        background-image: url('${values[0]}');
        ${strings[0]} 
        ${values[1]}
        `
    }
    _getImageUrl(images) {
        let imagesLang = images.length > 0 ? images.filter(item => !!item.imageLang) : images
        if (imagesLang.length > 0) {
            let image = imagesLang.filter(item => item.imageLang === this.lang)
            return image[0].url
        }
        let imagesOrder = images.length > 0 ? images.filter(item => !!item.imageOrder) : images
        if (imagesOrder.length > 0) {
            let image = []
            imagesOrder.forEach(item => image[parseInt(item.imageOrder - 1)] = item)
            this.imagesOrder = image
            return this.imagesOrder[0].url
        }
        return images[0].url
    }
    _setText(delta, elem) {
        let element = typeof elem == 'string' ? this.querySelector(`#${elem}`) : elem
        let Q = new Quill(element, this.options)
        _registerSize()
        let parsedDelta = JSON.parse(delta)
        Q.setContents(parsedDelta)
        Q.enable(false)
        this.killEditable()
    }
    getText(toparse) {
        let element = document.createElement('div')
        let Q = new Quill(element, this.options)
        let parsed = JSON.parse(toparse)
        Q.setContents(parsed)
        let text = Q.getText().split('')
        text.pop()
        return text.join('')
    }
    killEditable() {
        Array.from(this.querySelectorAll(".ql-clipboard"))
            .forEach(elem => elem.setAttribute('contenteditable', false))
    }
    showElementOnScroll() {
        let waitToShow = 60
        clearInterval(this.waitToShowTimewout)
        this.waitToShowTimewout = setTimeout(() => {
            this.show = true
            this.playAnimation('entry')
            if (!!this.imagesOrder && this.imagesOrder.length > 0) {
                this._rotateImages()
            }
        }, waitToShow);
    }
    hideElementOnScroll() {
        let waitToHide = 60
        this.playAnimation('exit')
        clearInterval(this.waitToHideTimewout)
        this.waitToHideTimewout = setTimeout(() => {
            this.show = false
        }, waitToHide);
    }
    _rotateImages() {
        let idx = 0
        this.time = setInterval(() => {
            let image, { length } = this.imagesOrder
            this.playAnimation('imageExit')
            if (idx < length - 1) idx++
            else idx = 0
            image = this.imagesOrder[idx]
            let time = setTimeout(() => {
                this.children[0].children[0].src = ''
                this.children[0].children[0].alt = ''
                this.children[0].children[0].setAttribute("style", this.setStyles`${image.url}${this.imageStyles}`)
                this.children[0].children[0].setAttribute('alt', 'media')
                this.playAnimation('imageEntry')
                clearTimeout(time)
            }, 250);
        }, 5000);
    }
}
