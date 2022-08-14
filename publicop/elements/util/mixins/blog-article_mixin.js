//"use strict"
import { getCredentials, _CheckSecret } from '../../../js/login_lib';
import { resetForm, extention, mixInScope, resolveToInfoData, setCustomToolFrom, setDataWithTools, setElementToRender } from '../../lib/methods';
import * as States from '../cacheStates&Listners/articles-states';
import { setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache';
import { setLayoutState } from '../cacheStates&Listners/layoutState';
import * as resolvers from '../resolvers/blog-article_resolver';
import * as route_methods from '../route-methods/blog-article-route_methods';

const methodsToInclude = {
    ...States, ...route_methods, setLayoutState, setElementToRender, resetForm, setPropertyContentAsInfoData, _CheckSecret
}

export const Methods = (baseClass) => class extends extention(baseClass) {
    constructor(...args) {
        super(...args);
        this.resolvers = {}
        mixInScope.call(this, methodsToInclude)
        mixInScope.call(this, resolvers, this.resolvers)
        this.ElementsTorender = {}
    }
    get query() {
        return this.getQueryState()
    }
    set query(query) {
        this.setQueryState(query)
    }
    get logedin() {
        return this.getLogedinState()
    }
    set logedin(logedin) {
        this.setLogedinState(logedin)
    }
    setElementsToRender() {
        this.ElementsTorender = {}
        this.setElementToRender('renderToArticles', `#${this.INFO.id}-articles`)
    }
    setCategories(response) {
        setDataWithTools.call(this, response, ['article'])
        resolveToInfoData.call(this, ['tools', 'articleTools'])
        setCustomToolFrom.call(this, 'tools', 'createTools', 'id', this.INFO.areas.tools.formCategoryId)
        this.setElementsToRender()
    }
    async setPage(query) {
        this.lang = query.lang
        query.logedin && this.setAferLoad({})
        let options = this.getOptions(this.categories)
        return options
    }
    async setArticle(query) {
        let title = `${localStorage['app-id']}-${this.INFO.id}-${query.articleid}`
        window.onbeforeunload = function () { }
        document.querySelector('title').innerHTML = title
        this.logedin = query.logedin
        this.article = query.articleid
        query.logedin && this.setAferLoad({ noInview: true })
        let options = this.getOptions(this.articleTools, query.articleid, true)
        return options
    }
    getOptions(ToQuery, cacheList, noLang) {
        let options = {
            noLang,
            ToQuery,
            cacheList,
            requestKey: 'articles'
        }
        return options
    }
    checkChangeState(query) {
        let categoriesSet = !!this.categories
        let langNotSet = this.inview && (this.lang !== query.lang && !query.resetview) ? 'changeLangState' : false
        let loginNotSet = this.inview && query.logedin !== this.logedin && !query.resetview ? 'changeLoginState' : false
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
        return this.setArticle(query)
            .then(options => this.newSetNoLangContent(options))
            .then(() => this.resolvers.setTools({ isCached: true }))
            .catch(console.error)
    }
    setCreate() {
        this.setEdit()
    }
    setEdit() {
        let [formCategory] = this.createTools
        let Permitions = formCategory.permitions
        let tempSecret = getCredentials().UserRecord.checkCredentials(Permitions)
        if (!tempSecret) return
        this.openFormPopup(tempSecret, formCategory)
    }
}
