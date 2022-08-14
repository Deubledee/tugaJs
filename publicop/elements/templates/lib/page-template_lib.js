import { render } from 'lit-html';
import { getCurrentLayout } from "../../util/classes/layoutState_class";

function setInfoDataResponse(infoDAta, Articles) {
    let { resolvedQlQueries } = infoDAta;
    let articles = Object.keys(resolvedQlQueries)
        .filter(key => key !== 'categories')
        .map(articlekeys => resolvedQlQueries[articlekeys]).pop()
    let key = articles.find(article => Object.keys(Articles).find(key => article === key));
    if (!!key) infoDAta.resolvedArticles = { [key]: Articles[key] };
}
function ResolvedArticles(infoDAta) {
    let { resolvedArticles } = infoDAta;
    if (resolvedArticles)
        Object.keys(resolvedArticles)
            .forEach(key => (key in this.resolvers) && this.resolvers[key].call(this, resolvedArticles[key], infoDAta));
}
function resolveInfoDataArticlesResponse(contentToQuery, Articles) {
    contentToQuery.forEach(infoDAta => setInfoDataResponse(infoDAta, Articles));
}
function setResolvedArticles(contentToQuery) {
    contentToQuery.forEach(infoDAta => ResolvedArticles.call(this, infoDAta));
}
function SetHeader(event) {
    let images = []
    if (!!event[0].images && event[0].images.length > 0)
        if (event[0].images.length > 1) event[0].images
            .forEach(item => images[item.imageOrder - 1] = item.url)
        else images = event[0].images[0].url
    this.INFO.images = images
    setStyles.call(this, images)
}
function setStyles(images) {
    if (!!this && !!this.INFO.globalDefaultStyles) {
        let templateObj = {},
            { layout, MediaQuery } = getCurrentLayout()
        if (images) templateObj.images = this.INFO.images
        let [defaultStyles, styles] = [!!this.INFO.globalDefaultStyles[this.INFO.type] ?
            this.INFO.globalDefaultStyles[this.INFO.type] : '',
        !!this.INFO.globalStyles[this.INFO.type][layout][MediaQuery] ?
            this.INFO.globalStyles[this.INFO.type][layout][MediaQuery] : '']
        templateObj.Styles = defaultStyles + styles
        render(this.resolvers.StylesTemplate(templateObj), document.querySelector(this.styleElement))
    }
}
function CallResponseMethods(articles, { contentToQuery }) {
    resolveInfoDataArticlesResponse(contentToQuery, articles);
    setResolvedArticles.call(this, contentToQuery);
}
async function defaultSetPageResponse(articles, options) {
    if (!this.NoSetStyles) setStyles.call(this)
    if (!!this.INFO.hideHero) this.INFO.hideHero(this.INFO)
    CallResponseMethods.call(this, articles, options);
    return articles
}

export { defaultSetPageResponse, CallResponseMethods, SetHeader, setStyles };

