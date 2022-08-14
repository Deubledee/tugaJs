"use strict";
import { css, html, LitElement } from 'lit';
import { render as litRender } from 'lit-html';
import { assertResponse, PrefixTypes } from '../../js/lib/asserts';
import { resetIgnoreQueries } from "../../js/reset_location";
import { setArticleLinks } from "../../js/urlQueryToObject";
import { _getArticles, _getArticles2, _getCategories } from '../lib/app_defalut_http-requests';
import { callLocationEvent, getInviewState, GetPage, toggleSpinner } from '../lib/methods';
import { defaultSetPageResponse, CallResponseMethods } from './lib/page-template_lib';
import { isContentLangCacheSet, isCategoryCacheSet, isContentCacheSet, CategoryCacheResolve } from '../util/cacheStates&Listners/contentCache';
import { callCustomTemplatePopup } from '../lib/warnings';
/** 
 * * { Reload BUG }
 * * This is a simple object that will ensure the content is requested after reload even if verification
 * * returns cache as been set.
 * * { Reload BUG } 
 * */

// Turn off migration warnings on all ReactiveElements,
// including LitElements
//ReactiveElement.disableWarning?.('migration');

// Turn off update warnings on all LitElements
LitElement.disableWarning?.('change-in-update');

const CacheLoadedControl = { CategoriesCached: {}, PageLangsCached: {}, cacheByQuery: {} }
const Aproved = {}

if (module.hot) module.hot.accept()

export class AppPageTemplate extends LitElement {

    static get styles() {
        return [css`
        :host {
            position: relative;
            display: block;
        } 
        .simple {
            display: flex;
            flex-flow: column;
        }
        #editor {
            display:none
        }
            `,
        this._getStyles]
    }

    render() {
        return html`                  
            ${this.launchRouter()}
            <div class="simple">
                <slot></slot>
                <div id="nav">
                    <slot name="nav"></slot>
                </div> 
                <div id="main">
                    <slot name="main"> </slot>
                </div> 
            </div>`
    }
    static get _getStyles() {
        return css``
    }

    static get properties() {
        return {
            spinner: {
                type: Object
            }
        }
    }
    get styleElement() {
        return `style[scope=header]`
    }
    constructor() {
        super();
    }
    launchRouter() {
        return html`
            <app-router-element .routecallback="${(this.routecallback).bind(this)}" layer1>
            </app-router-element> `
    }
    /**
     * * @removed for parcel
     */
    /* async importLazyLoads({ imports }) {
         //  let resolve = imports.map(importPath => import(importPath))
         return// Promise.all(resolve)
         // .catch(err => console.error('wrong file path or not set in "areas.imports"', err, imports))
     }*/
    __InitSetup__() {
        if (!this.INFO) return console.error('no INFO set', this.INFO);
        // this.importLazyLoads(this.INFO.areas)
        this._setMediaMatches()
    }
    setAferLoad({ reset, form, noInview }) {
        if (!noInview) this.setInviewTrue.call(this, [])
        this.resolvers.setTools({ reset, form })
    }
    _setMediaMatches() {
        this.setLayoutState(this)
            .on_desktopLayout("(min-width: 871px)", layout => this.resetLayout = layout)
            .on_mobileLayout("(max-width: 870px)", layout => this.resetLayout = layout)
            .match()
    }
    async setInviewTrue(ignores) {
        if (!!this.inview) return
        let newUrl = resetIgnoreQueries(['inview', 'resetview', ...ignores])
        callLocationEvent(`${newUrl}&inview=true`)
        this.inview = true
        return
    }
    _getInviewState(routes) {
        if (!!this.route && !!Object.keys(this.route).length)
            return getInviewState.call(this, routes)
    }
    setHrefs(query, id) {
        if (query) {
            let [parsedQuery, { links }] = [{ ...query }, this.INFO.areas]
            if (!links) return
            return setArticleLinks.call(this, links[id], parsedQuery)
        }
    }
    getUpdateState() {
        let Updated = this.Updated
        return Updated
    }
    getLang() {
        return this.lang
    }
    getArticleId() {
        return this.query.articleid
    }
    openFormPopup(tempSecret, formCategory) {
        this.resolvers
            .getFormTemplate(tempSecret, formCategory)
            .then(({ aproved, Template }) => {
                if (aproved.secret === tempSecret)
                    callCustomTemplatePopup.call(this, {
                        template: Template,
                        type: 'customTemplate',
                        method: this.resetForm.bind(this),
                        cancelMethod: this.resetForm.bind(this)
                    })
            })
            .catch(error => console.error(error));
    }
    defaultAssert(response) {
        return assertResponse
            .call(this, 'prefixType', PrefixTypes,
                response, response.json(), 'response returned an error message')
    }
    nolangResponse(response, contentToQuery) {
        return this.defaultAssert(response)
            .then(response => CallResponseMethods.call(this, response, contentToQuery))
            .catch(console.error)
    }
    simpleResponse(response, contentToQuery) {
        return this.defaultAssert(response)
            .then(response => defaultSetPageResponse.call(this, response, contentToQuery))
            .catch(console.error)

    }
    endpointsResponse(response, contentToQuery) {
        return response
            .then(Response => Promise.
                resolve(Response.map((EDPTRes) => this.simpleResponse.call(this, EDPTRes, contentToQuery))))
    }
    async newGetCategories(category, popUp) {
        let page = GetPage(this.routeData)
        let { assert, queries, expect } = category.ResolveCategories()
        if (popUp) page = `${page}-${popUp}`
        let CategoriesCached = this._control_category_cache(page)
        if (!!CategoriesCached) return CategoriesCached.content.get()
        CacheLoadedControl.CategoriesCached[page] = true
        return _getCategories.call(this, queries)
            .then(res => assertResponse(assert, expect, res, res.json(), 'response returned an errorMessage'))
            .then(content => CategoryCacheResolve(this, page, expect, content).get())
    }
    _control_category_cache(page) {
        let CategoriesCached = isCategoryCacheSet(page)
        if (!CategoriesCached) return false
        if (!!CacheLoadedControl.CategoriesCached[page]) return CategoriesCached
        return CategoriesCached.control.Dump()
    }
    contentQueries(categories = [], requestKey) {
        let endpoints = {}
        if (categories.length)
            categories.forEach(category => {
                let { queries } = category.RequestArticles(this, requestKey)
                this.getEndpoints(queries, endpoints);
            })
        return endpoints
    }
    getEndpoints(queries, endpoints) {
        Object.keys(queries)
            .forEach(endpoint => {
                if (!endpoints[endpoint])
                    endpoints[endpoint] = '';
                endpoints[endpoint] += queries[endpoint];
            });
    }
    /**
     * This function is used to get the content of the page
     * @returns The response from the endpoint.
     */
    async newSetContent({ routeData, ToQuery, requestKey, noLang, addToCache = false, cacheList }) {
        let page = GetPage(routeData || this.routeData)
        let contentToQuery = ToQuery || this.categories
        let cacheOptions = { addToCache, noLang, requestKey, cacheList, contentToQuery, update: this.query.resetview }
        let ContentLangCache = this._control_content_cache(this.query.lang, page, cacheOptions)
        let options = { contentToQuery }
        if (!!ContentLangCache) return defaultSetPageResponse.call(this, ContentLangCache.content, options)
        let queries = this.contentQueries.call(this, contentToQuery, requestKey)
        return this.endpointsResponse(_getArticles2.call(this, queries), options)
    }
    _control_content_cache(lang, page, { requestKey, contentToQuery, cacheList, update }) {
        if (cacheList) {
            let isCacheListSet = this.setCacheList(page, cacheList)
            if (!isCacheListSet) return isCacheListSet
        }
        let ResolvedRequests = this.getResolvedRequests(requestKey, contentToQuery)
        let ContentLangCache2 = isContentLangCacheSet({ lang, page, ResolvedRequests, update })
        return ContentLangCache2
    }
    /* The above code is a function that will return a promise. */
    /**
     * This function is used to get the content of the page
     * @returns The response is being returned as a promise.
     */
    async newSetNoLangContent({ routeData, ToQuery, requestKey, addToCache = false, cacheList }) {
        let page = GetPage(routeData || this.routeData)
        let contentToQuery = ToQuery || this.categories
        let cacheOptions = { addToCache, cacheList, contentToQuery, requestKey, update: this.query.resetview }
        let ContentLangCache2 = this._control_simple_content_cache2(page, cacheOptions)
        let options = { contentToQuery }
        if (!!ContentLangCache2) return CallResponseMethods.call(this, ContentLangCache2.content, options)
        let queries = this.contentQueries.call(this, contentToQuery, requestKey)
        let [Articles] = await _getArticles2.call(this, queries)
        return this.nolangResponse(Articles, options)
    }
    _control_simple_content_cache2(page, { requestKey, contentToQuery, cacheList, update }) {
        let ResolvedRequests = this.getResolvedRequests(requestKey, contentToQuery)
        let ContentCache = isContentCacheSet({ page, ResolvedRequests, update })
        if (cacheList) {
            let isCacheListSet = this.setCacheList(page, cacheList)
            if (!isCacheListSet) return isCacheListSet
        }
        return ContentCache
    }
    getResolvedRequests(requestKey, contentToQuery) {
        let [contentToQueryMapped, ResolvedRequests] = [contentToQuery.map(ToQuery => ToQuery.http[requestKey].request), []]
        contentToQueryMapped
            .forEach(requestA => requestA
                .forEach(request => Object.keys(request)
                    .forEach(key => ResolvedRequests.push(key))))
        return ResolvedRequests
    }
    setCacheList(page, cacheList) {
        if (!!cacheList && !CacheLoadedControl.cacheByQuery[page])
            CacheLoadedControl.cacheByQuery[page] = {}
        if (!!CacheLoadedControl.cacheByQuery[page] && !CacheLoadedControl.cacheByQuery[page][cacheList])
            return !(CacheLoadedControl.cacheByQuery[page][cacheList] = cacheList)
        return true
    }
    toggleSpinner(l) {
        toggleSpinner(l)
    }
    setScrollHeader() {
        var appHeader = document.querySelector(`#header`);
        var fadeBackgroundEffect = appHeader.createEffect('fade-background');
        var appHeaderlayout = document.querySelector(`#header-layout`)
        this.setDefaultLayout(appHeader, appHeaderlayout)
        this.setHeaderScrollListners(fadeBackgroundEffect, appHeader)
    }

    setDefaultLayout(appHeader, appHeaderlayout) {
        appHeader.classList.add('header-full')
        appHeaderlayout.$.contentContainer.style.paddingTop = "0px"
        scroll({ top: 0 })
    }
    setHeaderScrollListners(fadeBackgroundEffect, appHeader) {
        window.addEventListener('scroll', function () {
            var isCondensed = window.scrollY > 150;
            fadeBackgroundEffect.run(isCondensed ? 1 : 0);
            appHeader.shadow = isCondensed;
            appHeader.resetLayout()
            if (appHeader.classList.contains('header-full'))
                appHeader.classList.remove('header-full')
            appHeader.resetLayout()
            if (window.scrollY > 50)
                document.querySelector(`#header`).classList.add("header-scrolled")
            else if (window.scrollY <= 50)
                document.querySelector(`#header`).classList.remove("header-scrolled")
        })
    }
    _slotContent() {
        if (!!this.INFO.areas) {
            const { positions, Template } = this.resolvers.getLayout(this.INFO.areas)
            litRender(Template(positions), this)
            this.setScrollHeader()
        }
    }

}
///customElements.define('app-page-template', AppPageTemplate);
