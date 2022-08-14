import { render as litRender } from 'lit-html';
import { appLogin, checkForLogin, sendLoginStatus } from '../../../js/login_lib';
import { extention, getInviewState, getInfoDataByType, mixInScope, revertTo } from '../../lib/methods';
import { getInfo } from '../cacheStates&Listners/infoCache';
import { setAppLayoutState } from '../cacheStates&Listners/layoutState';
import * as lib_methods from '../libs/main-app_lib';
import { getCategory, getContent } from '../requests&queries/requests/main-app_requests';
import { resetAppStyles } from '../resolvers/app_default_resolvers';
import * as route_methods from '../route-methods/main-app-route_methods.js';
const methodsToInclude = { ...route_methods, ...lib_methods, resetAppStyles, setAppLayoutState, getInfo, getCategory, getInfoDataByType }

export const Methods = mainApp => class extends extention(mainApp) {
    constructor(...args) {
        super(...args);
        mixInScope.call(this, methodsToInclude)
        this._checkAndsetLang()
        this.categoryViews = {}
    }
    async getAndSetContent(data) {
        if (!this.viewPages)
            return this.contentSetter(await getContent.call(this, data)
                .catch(console.error))
    }
    resetAppToolbar() {
        this._setPageSellector(this.viewPages, this.resetLayout)
        this._setLangSellector()
    }
    _getInviewState(routes) {
        if (!!this.route && !!Object.keys(this.route).length)
            return getInviewState.call(this, routes)
    }
    _setMediaMatches() {
        this.setAppLayoutState()
            .on_desktopLayout("(min-width: 871px)", layout => this.resetLayout = layout)
            .on_mobileLayout("(max-width: 870px)", layout => this.resetLayout = layout)
            .match()
    }
    _setPageSellector(data, layout) {
        let paperTabs = this.querySelector('#toolbar-pages')
        litRender(this.getPageToolbarTemplate(data, layout), paperTabs)
        if (!!this.firstLoad) paperTabs.select(this.orderdPages.findIndex(item => item.id === this.routeData.page))
    }
    _setLangSellector() {
        let LangsSellector = this.querySelector('#lang-sellector')
        litRender(this.getLangAndLgoinTemplate(this.resetLayout), LangsSellector)
    }
    setAppLanguage(query) {
        this.lang = (!!query.lang && query.lang !== 'undefined' && query.lang !== undefined) ? query.lang : 'pt'
        localStorage['app-lang'] = this.lang
        this.changeLang = true
        if (this.viewPages) this.resetAppToolbar()
    }
    checkHeroState(INFO) {
        let showHero = !!Object.keys(INFO.areas).find(item => item === 'hero')
        if (!showHero) return INFO.hideHero = this.showHideHero.bind(this)
        this.showHideHero(INFO, showHero)
    }
    showHideHero(INFO, showHero = false) {
        this.showHero = showHero
        if (!!this.showHero && this.presentHero !== (INFO.id + this.showHero))
            this.presentHero = INFO.id + this.showHero
    }
    async loginchecker(page, INFO) {
        if (!!page) {
            this.setLoginEvent(page, INFO)
            await checkForLogin.call(this, INFO)
                .then(session => !session ?
                    appLogin.call(this, `login to ${this.query.type}`) :
                    sendLoginStatus.call(this, { status: 'logedin' }))
                .catch(() => sendLoginStatus.call(this, { status: 'all users' }))
        }
    }
    setLoginEvent(page, INFO) {
        const onloginStatus = ({ detail }) => {
            if (detail.status === 'logedin' || detail.status === 'all users') {
                this.checkHeroState(INFO)
                litRender(this.getViewTemplate.call(this, page).call(this, page, INFO), this.pagesElement)
            }
            if (detail.status === 'notlogedin')
                revertTo.call(this, 'parent', this.lang)
            window.removeEventListener('login-status', onloginStatus)
        }
        window.addEventListener('login-status', onloginStatus)
    }
}
