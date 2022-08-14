"use strict"
import { getCredentials, _CheckSecret } from '../../../js/login_lib';
import {
    resetForm, extention, getInfoDataByProperty, mixInScope, resolveToInfoData,
    setCustomToolAndResponses, setDataWithTools, setElementToRender
} from '../../lib/methods';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import * as resolvers from '../resolvers/blog_resolver';
import * as route_methods from '../route-methods/blog-page-route_methods';

const methodsToMixin = {
    ...route_methods, setElementToRender, setLayoutState, _CheckSecret,
    setCustomToolAndResponses, setPropertyContentAsInfoData, resetForm
}

export const Methods = (appBlogArticle) => class extends extention(appBlogArticle) {
    constructor(...args) {
        super(...args);
        this.resolvers = {}
        this.ElementsTorender = {}
        mixInScope.call(this, methodsToMixin)
        mixInScope.call(this, resolvers, this.resolvers)
        this.mediaInfoSet = false
        // CSS.paintWorklet.addModule(' ../../../js/register_paint.js');ØØ
    }
    checkChangeState(query) {
        let categoriesSet = !!this.categories
        let langNotSet = query.inview === 'true' && (this.lang !== query.lang && !query.resetview) ?
            'changeLangState' : false
        let loginNotSet = (!!this.categories && query.logedin && query.inview === 'true' && !query.resetview) ?
            'changeLoginState' : false
        if ((langNotSet || loginNotSet) && categoriesSet) return { langNotSet, loginNotSet }
        return false
    }
    async setStateChange(StateChange, query) {
        let cahngeState = Object.values(StateChange).find(state => !!state)
        if (this[cahngeState] && this[cahngeState].call) await this[cahngeState](query)
    }
    async changeLangState(query) {
        await this.setPage(query)
            .then(options => this.newSetContent(options))
            .then(() => this.resolvers.setTools({ isCached: true }))
    }
    async changeLoginState(query) {
        await this.setPage(query)
            .then(() => this.resolvers.setTools({ isCached: true }))
            .catch(console.error)
    }
    setCategories(response) {
        setDataWithTools.call(this, response, ['hero', 'article'])
        resolveToInfoData.call(this, ['tools', 'heroTools', 'articleTools'])
        this.setElementsToRender()
    }
    setElementsToRender() {
        this.setElementToRender('renderToPreviousArticles', '#blog-previous_articles')
        this.setElementToRender('renderToLatestArticles', '#blog-latest_articles')
    }
    resolveContentNotCached(Resolver, IsCached) {
        if (!IsCached || !this.query.resetview)
            Resolver.setCategory(this.INFO).setStylesAndTemplate({})
        return Resolver
    }
    async setPage(query) {
        this.lang = query.lang
        window.onbeforeunload = function () { }
        document.querySelector('title').innerHTML = localStorage['app-id'] + '-' + this.type
        query.logedin && this.setAferLoad({ noInview: true })
        let options = this.getOptions(this.heroTools)
        return options
    }
    async setArticles() {
        let options = this.getOptions(this.articleTools, true)
        return options
    }
    getOptions(ToQuery, noLang = false) {
        let options = {
            requestKey: 'articles',
            ToQuery, noLang
        }
        return options
    }
    setCreate() {
        let { formCategoryId, permitions } = this.INFO.areas.tools
        let formCategory = getInfoDataByProperty.call(this, formCategoryId, 'id', 'tools')
        let Permitions = permitions ? permitions : formCategory.permitions
        let tempSecret = getCredentials().UserRecord.checkCredentials(Permitions)
        if (!tempSecret) return
        this.openFormPopup(tempSecret, formCategory)
    }
    searchBlogArticles(evt) {
        console.log('TODO searchBlogArticles', evt.target);
    }
}
