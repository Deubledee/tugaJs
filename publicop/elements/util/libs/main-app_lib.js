import { toggleSpinner } from '../../lib/methods';
import { html as litHtml } from 'lit-html';
import { getViewTemplate } from '../../templates/view-elements_templates';
import { langMediaTemplates, pagesMediaTemplates } from '../../templates/media-templates/main-app_media-templates';
import { setInfo, setPropertyContentAsInfoData } from '../cacheStates&Listners/infoCache'


function createStyleElements() {
    let Styles = ["header", "reset"]
    Styles.forEach(StyleNode => {
        let StylesTemplate = document.createElement('template')
        StylesTemplate.innerHTML = `<style scope="${StyleNode}"></style>`
        let resetStyleNode = document.importNode(StylesTemplate.content, true);
        document.head.appendChild(resetStyleNode)
    });
}

function getLangAndLgoinTemplate() {
    function template() {
        let templateResolve = litHtml`
        ${langMediaTemplates.desktop.call(this)}
            <div class="langs-container">
                <app-lang-menu
                .items="${this.langArray}" 
                .item="${this.lang ? this.lang : localStorage['app-lang']}">
                </app-lang-menu>
            </div>`
        return templateResolve
    }
    return template.call(this)
}

function getPageToolbarTemplate(data, layout = 'desktop') {
    this.orderdPages = []
    data.forEach(item => this.orderdPages[item.pageOrder - 1] = item)
    this.userProfile = data.find(item => item.type === "profile")
    let template = (pages) => {
        if (layout in pagesMediaTemplates) return litHtml`${pagesMediaTemplates[layout].call(this, pages)}`
        return litHtml`layout: ${layout}`
    }
    return template.call(this, this.orderdPages)
}

function _checkAndsetLang(lang) {
    if (!lang || lang === 'undefined')
        this.lang = !!localStorage['app-lang'] && localStorage['app-lang'] !== 'undefined' ? localStorage['app-lang'] : 'pt'
}

function setViews() {
    let obj = {}
    this.viewPages.forEach(item => obj[item.path] = item.type)
    this.views = obj
}

async function pageViewObjectSetter(categories) {
    this.viewPages = categories
    await setPropertyContentAsInfoData.call(this, 'viewPages', 'viewsInfo')
    setViews.call(this)
    setCategoryViews.call(this)
    return this.views
}

function setCategoryViews() {
    let categoryViews = this.categoryViews
    this.categoryViews = getCategoryRoutes.call(this, categoryViews)
}

function getCategoryRoutes(categoryViews) {
    let categoryRoutes = this.viewPages.filter(item => !!item.areas && !!item.areas.routes)
    if (!!categoryRoutes.length) categoryRoutes
        .forEach(({ areas }) => Object.keys(areas.routes)
            .forEach(route => categoryViews[route] = areas.routes[route]))
    return categoryViews
}

function categoryViewObjectSetter(category) {
    this.categoryPage = this.getInfo('toolsInfo', category.path)
    return this.categoryViews
}

async function contentSetter(getPages) {
    if (!!getPages && !!getPages.length) {
        setInfo.call(this, 'viewsInfo', getPages)
        return pageViewObjectSetter.call(this, getPages)
    }
}
function categorySetter(CategoryPage, exists = false) {
    if (!exists) setInfo.call(this, 'toolsInfo', CategoryPage)
    categoryViewObjectSetter.call(this, CategoryPage[0])
}

export {
    categorySetter, contentSetter, getLangAndLgoinTemplate, getViewTemplate, getPageToolbarTemplate,
    toggleSpinner, _checkAndsetLang, createStyleElements
}
