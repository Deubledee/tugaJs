
import { checkIsCachedResponse, ContentCacheResolve } from '../cacheStates&Listners/contentCache';
import { getArticleHero, getFormTemplate, getLayout, setTools, StylesTemplate } from './app_default_resolvers';

// *subjects
function getArticleBlogSubjects(response, articleTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : articleTools
    let { id: area, element, responseName } = category.areaInfo
    let { renderToSubjects } = this.ElementsTorender
    this.subjectArticlesResolver = ContentCacheResolve(this, response, {
        area, category, responseName, element,
        stylesCategory: this.INFO, update: this.query.resetview === 'true'
    })
    if (!this.subjectArticlesResolver) return console.log('No Resolver !!', this.subjectArticlesResolver);
    if (this.subjectArticlesResolver.hasError) return this.subjectArticlesResolver
        .hasError()
        .resetTemplateRenderArea(renderToSubjects, {})
    if (!IsCached || !this.query.resetview)
        this.subjectArticlesResolver
            .setCategory(category)
            .setMethodFromCategory({ Category: category })
            .setStyles()
    if (this.query.resetview === 'true')
        this.subjectArticlesResolver
            .resetTemplateRenderArea(renderToSubjects, {})
            .resetLocation(['resetview', 'formpopup'], false)
    this.subjectArticlesResolver
        .setTemplate()
        .RenderTemplate(renderToSubjects, { delay: 30 * 2 })
}
// *blogs
function getArticleBlogBySubject(response, blogCategory) {
    if (!this.query.subject) return
    let [IsCached, TemplateId, delay] = [checkIsCachedResponse(response), this.query.subject, 30 * 2]
    let { renderToArticles } = this.ElementsTorender
    let category = !!IsCached ? IsCached.category : blogCategory
    let { id: area, element, responseName, noLang } = category.areaInfo
    this.blogArticlesResolver = ContentCacheResolve(this, response, {
        area, category, element, responseName, noLang,
        articleName: this.query.subject, update: this.Update,
        stylesCategory: blogCategory
    })
    if (!this.blogArticlesResolver)
        return console.log(this.blogArticlesResolver);
    if (this.blogArticlesResolver.hasError) return this.blogArticlesResolver
        .hasError()
        .resetTemplateRenderArea(renderToArticles, {})
    if (!IsCached) this.blogArticlesResolver
        .setCategory(category)
        .setStyles()
    this.blogArticlesResolver
        .setContentList(TemplateId, response)
        .setTemplateId(TemplateId)
        .RenderTemplate(renderToArticles, { TemplateId, delay })
}

function updateSubject({ resetview }) {
    setTimeout(() => {
        this.updateActiveSubject(resetview, this.subjectArticlesResolver)
    }, 125);
}

export {
    setTools,
    getLayout,
    updateSubject,
    StylesTemplate,
    getArticleHero,
    getFormTemplate,
    getArticleBlogSubjects,
    getArticleBlogBySubject
};

