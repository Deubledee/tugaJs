import { css, html } from 'lit';
import { elementsDefine } from './lib/methods';
import { AppPageTemplate } from './templates/app-page-template';
import { Methods } from './util/mixins/blog-article_mixin';

if (module.hot) module.hot.accept()

export class appBlogArticle extends Methods(AppPageTemplate) {
    static get styles() {
        return [css`
        :host {
            display: block;
            background-color: var(--app-background-color);
        }
        `]
    }
    launchRouter() {
        return html`<app-router-element .route2callback="${(this.routecallback).bind(this)}" layer2>
            </app-router-element>`
    }

    static get properties() {
        return {
            _categories: {
                type: Array
            },
            spinner: {
                type: Object
            },
            _langs: {
                type: Object
            },
            _lang: {
                type: Object
            },
            _INFO: {
                type: String,
            },
            _article: {
                type: Object
            }
        }
    }
    get langs() {
        return this._langs
    }
    get lang() {
        return this._lang
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
    get tools() {
        return this._tools
    }
    set areas(data) {
        this._areas = data
    }
    set langs(data) {
        this._langs = data
    }
    set lang(data) {
        this._lang = data
        this._slotContent()
    }
    set tools(data) {
        this._tools = data
    }
    set categories(data) {
        this._categories = data
    }
    set INFO(data) {
        this._INFO = data
    }
    constructor() {
        super();
        this.imageStyles = []
        this.langs = {}
    }
}

elementsDefine('app-blog-article', appBlogArticle);
