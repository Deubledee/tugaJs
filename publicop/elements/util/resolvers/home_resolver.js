import { ContentCacheResolve, checkIsCachedResponse } from '../cacheStates&Listners/contentCache';
import { getArticleHero, getLayout, StylesTemplate } from './app_default_resolvers';

function getArticleAbout(response, articleTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let { renderToAbout } = this.ElementsTorender
    let { id: area, element, responseName, includeAssets: { styles } } = category.areaInfo
    let Resolver = ContentCacheResolve(this, response,
        { area, category, element, responseName, stylesCategory: category })
    Resolver
        .setTemplate()
        .setStyles(styles)
    Resolver.RenderTemplate(renderToAbout)
}
function getArticleServices(response, articleTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let { renderToServices } = this.ElementsTorender
    let { id: area, element, responseName, includeAssets: { styles } } = category.areaInfo
    let Resolver = ContentCacheResolve(this, response,
        { area, category, element, responseName, stylesCategory: category })
    Resolver
        .setTemplate()
        .setStyles(styles)
    Resolver.RenderTemplate(renderToServices)
}
function getArticleContacts(response, articleTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let { renderToContacts } = this.ElementsTorender
    let { id: area, element, responseName, includeAssets: { styles } } = category.areaInfo
    let Resolver = ContentCacheResolve(this, response,
        { area, category, element, responseName, stylesCategory: category })
    Resolver
        .setTemplate()
        .setStyles(styles)
    Resolver.RenderTemplate(renderToContacts)
}

export { StylesTemplate, getArticleServices, getArticleAbout, getArticleContacts, getArticleHero, getLayout };
