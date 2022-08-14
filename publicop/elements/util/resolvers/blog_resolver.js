import { getArticleHero, getLayout, getFormTemplate, StylesTemplate, setTools } from './app_default_resolvers';
import { ContentCacheResolve, checkIsCachedResponse } from '../cacheStates&Listners/contentCache';

function getArticleBlog(response, articleTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let latestContent = !IsCached ? [response[0]] : response
    let { id: area, element, responseName, noLang } = category.areaInfo
    this.latestBlogResolver = ContentCacheResolve(this, latestContent, {
        area, category, responseName, element,
        noLang, stylesCategory: this.INFO,
        update: this.query.resetview === 'true'
    })
    let { renderToLatestArticles } = this.ElementsTorender
    if (!this.latestBlogResolver) return console.log('No Resolver !!', this.latestBlogResolver);
    if (this.latestBlogResolver.hasError) return this.latestBlogResolver
        .hasError()
        .resetTemplateRenderArea(renderToLatestArticles, {})
    if (this.query.resetview === 'true')
        this.latestBlogResolver.resetTemplateRenderArea(renderToLatestArticles, {})
    this.resolveContentNotCached(this.latestBlogResolver, IsCached)
        .RenderTemplate(renderToLatestArticles)
        .resetLocation(['resetview', 'formpopup'], false)
    getArticleBlogPrevious.call(this, response, articleTools, true)
}
function getArticleBlogPrevious(response, articleTools, area2) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let previousContent = !IsCached ? response.slice(1, response.length) : response
    let { id: area, element, responseName, noLang } = category.areaInfo.area2
    this.previousBlogsResolver = ContentCacheResolve(this, previousContent,
        { area2, category, area, responseName, element, noLang, stylesCategory: this.INFO })
    let { renderToPreviousArticles } = this.ElementsTorender
    if (this.query.resetview === 'true')
        this.previousBlogsResolver.resetTemplateRenderArea(renderToPreviousArticles, {})
    this.resolveContentNotCached(this.previousBlogsResolver, IsCached)
        .RenderTemplate(renderToPreviousArticles)
}

export { getArticleBlog, setTools, getArticleHero, getLayout, StylesTemplate, getFormTemplate, };

