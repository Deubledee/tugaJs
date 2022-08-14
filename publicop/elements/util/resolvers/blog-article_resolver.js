import { checkIsCachedResponse, ContentCacheResolve } from '../cacheStates&Listners/contentCache';
import { getArticleHero, getLayout, setTools, StylesTemplate, getFormTemplate } from './app_default_resolvers';


function getBlogArticleDataByID(response, articleTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let { id: area, element, responseName, noLang, includeAssets: { styles } } = category.areaInfo
    let { renderToArticles } = this.ElementsTorender
    let [TemplateId, delay] = [this.query.articleid, 30 * 2]

    this.blogArticlesResolver = ContentCacheResolve(this, response, {
        area, element, category, responseName, stylesCategory: this.INFO, noLang,
        update: this.query.resetview === 'true'
    })
    if (!IsCached) this.blogArticlesResolver
        .setCategory(category)
        .setMethodFromCategory({ Category: category })
        .setStyles(styles)
    if (this.query.resetview === 'true')
        this.blogArticlesResolver
            .resetTemplateRenderArea(renderToArticles, {})
            .resetLocation(['resetview', 'formpopup'], false)
    this.blogArticlesResolver
        .setContentList(TemplateId, response)
        .setTemplateId(TemplateId)
        .RenderTemplate(renderToArticles, { TemplateId, delay })
}

export { getBlogArticleDataByID, setTools, getArticleHero, StylesTemplate, getLayout, getFormTemplate };
