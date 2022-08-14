import { css, html } from 'lit';
import { elementsDefine } from '../lib/methods';
import { Methods } from "../util/mixins/articles-form_mixin";
import { AppPageTemplate } from '../templates/app-page-template';

if (module.hot) module.hot.accept()
export class appArticlesForm extends Methods(AppPageTemplate) {
    static get styles() {
        return [css`
        :host {
            display: block;
            background-color: var(--app-background-color);
        }        
        `]
    }

    launchRouter() {
        return html`       
        <app-router-element 
        layer1
         .routecallback="${(this.routecallback).bind(this)}"
         layer2
         .route2callback="${(this.routecallback).bind(this)}">
        </app-router-element>`
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
            _edit: {
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
    get styleElement() {
        return `style[scope=popup]`
    }
    get article() {
        return this._article
    }
    get langs() {
        return this._langs
    }
    get lang() {
        return this._lang
    }
    get tools() {
        return this._tools
    }
    get areas() {
        return this._areas
    }
    get categories() {
        return this._categories
    }
    get INFO() {
        return this._INFO
    }
    get edit() {
        return this._edit
    }
    set edit(edit) {
        this._edit = edit
    }
    set areas(data) {
        this._areas = data
    }
    set langs(data) {
        this._langs = data
    }
    set lang(data) {
        this._lang = data
    }
    set categories(data) {
        this._categories = data
    }
    set INFO(data) {
        this._INFO = data
        this._slotContent()
        this.createCategoryPropertyFrom(this.INFO, this.INFO)
        //   if (this.preview) this.fromStoreToPreview(this.preview)
    }
    set tools(data) {
        this._tools = data
    }
    constructor() {
        super();
        this.imageStyles = []
    }
}

elementsDefine('app-articles-form', appArticlesForm);
