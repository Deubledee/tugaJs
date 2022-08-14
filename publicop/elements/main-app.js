"use strict";
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings';
import { css, html, LitElement } from 'lit';
import { getProjectLangs, setFirebaseApp } from "../js/firebase";
import SetDefaultUrlState from '../js/_INIT_control.js';
import './lazy-imports.js';
import { elementsDefine } from './lib/methods';
import { setErrorStatus, setStatus404 } from './lib/warnings';
import { Methods } from './util/mixins/main-app_mixin';

SetDefaultUrlState()

const FirebaseApp = setFirebaseApp()
    .then(() => getProjectLangs())

setPassiveTouchGestures(true);
setRootPath('/');

if (module.hot) module.hot.accept()

class mainApp extends Methods(LitElement) {

    static get styles() {
        return [css` 
            main {
                display: flex;
                flex-flow: column
            }`]
    }
    render() {
        return html`     
            <app-router-element layer1 layer2 .routecallback="${(this.routecallback).bind(this)}" .route2callback="${(this.routecallback).bind(this)}">
            </app-router-element>                 
            <main>
                <div>
                    <slot name="header"></slot>
                </div>
                ${!!this.showHero ? html`
                 <div>
                    <slot name="hero"> </slot>
                </div> ` :
                ''}      
                <div>
                    <slot name="pageview"> </slot> 
                </div>
                <div>
                    <slot name="footer"> </slot>   
                </div>
            </main>`
    }
    static get properties() {
        return {
            route: {
                type: Object
            },
            _showHero: {
                type: Boolean
            },
            user: {
                type: Object
            },
            _page: {
                type: String
            },
            viewPages: {
                type: Array
            },
            views: {
                type: Object
            },
            pagelangs: {
                type: Object
            },
            viewAreas: {
                type: Object
            },
            _langArray: {
                type: Array
            },
            resetLayout: {
                type: String
            },
            _langs: {
                type: Array
            },
            _categoryPage: {
                type: Array
            },
            _Match: {
                type: Array
            },
            _lang: {
                type: String
            },
            spinner: {
                type: Object
            },
            _count: {
                type: Number
            },
            _article: {
                type: Object
            }
        }
    }
    get showHero() {
        return this._showHero
    }
    get categoryPage() {
        return this._categoryPage
    }
    get page() {
        return this._page
    }
    get viewPages() {
        return this._viewPages
    }
    get langArray() {
        return this._langArray
    }
    get langs() {
        return this._langs
    }
    get views() {
        return this._views
    }
    get lang() {
        return this._lang
    }
    get count() {
        return this._count
    }
    get pagesElement() {
        return document.querySelector('div[id=pageview]')
    }
    get article() {
        return this._article = data
    }
    set article(data) {
        this._article = data
        this._setArticle(data)
    }
    get Match() {
        return this._Match
    }
    get resetLayout() {
        return this._resetLayout
    }
    set resetLayout(data) {
        this._resetLayout = data
        this._setPageSellector(this.viewPages, data)
    }
    set Match(data) {
        this._Match = data
    }
    set showHero(data) {
        this._showHero = data
    }
    set views(data) {
        this._views = data
    }
    set langArray(data) {
        this._langArray = data
        this._setLangSellector()
    }
    set viewPages(data) {
        if (!!data && !!data.length) {
            this._viewPages = data
            this._setPageSellector(data, this.resetLayout)
        }
    }
    set categoryPage(data) {
        this._categoryPage = data
        this._setViewPage(this.page2, data)
    }
    set page(page) {
        if (!!page || page !== "undefined") {
            this._page = page
            let infoData = this.getInfoDataByType(page, 'viewPages')
            this._setViewPage(this.page, infoData)
            return
        }
        setStatus404.call(this.routeData.page, 'page')
    }
    set langs(data) {
        this._langs = data
    }
    set lang(data) {
        this._lang = data
    }
    set count(data) {
        this._count = data
    }
    connectedCallback(...args) {
        super.connectedCallback(...args);
    }
    disconnectedCallback(...args) {
        super.disconnectedCallback(...args);
    }
    constructor() {
        super();
        this.langs = {};
        this.viewAreas = {}
        this.showHero = true
        this.firstLoad = true
        this.headerTimeout = 1500
        this.createStyleElements()
        FirebaseApp
            .then(projectLangs => this.setProjectLangs(projectLangs))
            .catch(err => setErrorStatus.call(this, '204', err))
    }
    setProjectLangs(projectLangs) {
        let obj = {}
        localStorage['app-langs'] = projectLangs
        projectLangs.forEach(Lang => obj[Lang] = [])
        this.langArray = projectLangs
        this.pagelangs = obj
        //document.querySelector('#loading').style.display = 'none';
    }
    _setViewPage(page, infoData) {
        this._pageChanged(page, infoData)
            .then(() => this.loginchecker.call(this, infoData.id, infoData))
            .catch(err => console.error(`_setViewPage error`, err, infoData))
    }
    async _pageChanged(page, infoData) {
        if (page === "404" || !infoData || !infoData.areas)
            throw `_pageChanged: page or infoData may be wrong! page: ${page} infoData: ${infoData}`
        return
    }
}

elementsDefine('main-app', mainApp);
