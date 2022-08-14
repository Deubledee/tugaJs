import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import { html } from 'lit';
import { elementsDefine } from './lib/methods';
import { AppPageTemplate } from './templates/app-page-template';
import { Methods } from './util/mixins/gallery_mixin';

if (module.hot) module.hot.accept()
class appGalleryPage extends Methods(AppPageTemplate) {
    launchRouter() {
        return html`
            <app-router-element
                layer1
                layer2
                .routecallback="${(this.routecallback).bind(this)}"
                .route2callback="${(this.routecallback).bind(this)}">
            </app-router-element>
            <input id="gallery-input" name="local" style="display:none" accept="image/png, image/jpeg"/>
            `
    }
    static get properties() {
        return {
            route: {
                type: Object,
            },
            itemsArray: {
                type: Array
            },
            _categories: {
                type: Array
            },
            page: {
                type: String,
            },
            index: {
                type: Number,
                value: 0
            },
            _setted: {
                type: Boolean
            },
            _type: {
                type: String
            },
            _styles: {
                type: String
            },
            _INFO: {
                type: String,
            },
            _tools: {
                type: Array
            },
            _areas: {
                type: Object
            },
            _multiimage: {
                type: Boolean
            },
            _requestcategory: {
                type: Object
            }
        }
    }
    /**
     * *getters
     **/
    get styleElement() {
        return `style[scope=image-popup]`
    }
    get type() {
        return this._type
    }
    get page() {
        return this._page
    }
    get langs() {
        return this._langs
    }
    get lang() {
        return this._lang
    }
    get INFO() {
        return this._INFO
    }
    get index() {
        return this._index
    }
    get categories() {
        return this._categories
    }
    get styles() {
        return this._styles
    }
    get areas() {
        return this._areas
    }
    get setted() {
        return this._setted
    }
    get tools() {
        return this._tools
    }
    get multiimage() {
        return this._multiimage
    }
    get requestcategory() {
        return this._requestcategory
    }
    /** 
     * * setters 
     **/
    set type(data) {
        this._type = data
    }
    set index(data) {
        this._index = data
    }
    set page(data) {
        this._page = data
    }
    set setted(data) {
        this._setted = data
    }
    set langs(data) {
        this._langs = data
    }
    set lang(data) {
        this._lang = data
        this._slotContent()
    }
    set INFO(data) {
        this._INFO = data
    }
    set tools(data) {
        this._tools = data
    }
    set categories(data) {
        this._categories = data
    }
    set styles(data) {
        this._styles = data
    }
    set areas(data) {
        this._areas = data
    }
    set multiimage(data) {
        this._multiimage = data
    }
    set requestcategory(data) {
        this._requestcategory = data
    }
    connectedCallback() {
        super.connectedCallback();

    }
    constructor() {
        super();
        this.langs = {}
        this.elements = []
        this.setted = false
    }
}

elementsDefine('app-gallery-page', appGalleryPage);
