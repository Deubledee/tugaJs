import { ContentCacheResolve, checkIsCachedResponse } from '../cacheStates&Listners/contentCache';
import { getLayout, setTools, StylesTemplate } from './app_default_resolvers';

function getArticleGalleries(response, mediaTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : mediaTools
    let { id: area, element, responseName, noLang, form, includeAssets: { styles, assets } } = category.areaInfo
    let { renderToFormTool } = this.ElementsTorender
    this.FormResolver = ContentCacheResolve(this, response, {
        area, category, responseName, noLang,
        form, element, stylesCategory: this.INFO
    })
    if (!!this.FormResolver.hasError) return
    let { Template } = this.FormResolver.getTemplate()
    if (Template) this.FormResolver
        .resetTemplate()
    this.FormResolver
        .setCategory(category)
        .setAssets(assets)
        .setStyles(styles)
    this.FormResolver.setTemplate()
        .RenderTemplate(renderToFormTool, { delay: 30 * 2 })
    this.setForm()
}

function getArticleImages(response, mediaTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : mediaTools
    let { id: area, element, responseName, noLang, form, includeAssets: { styles, assets } } = category.areaInfo
    let { renderToFormTool } = this.ElementsTorender
    this.FormResolver = ContentCacheResolve(this, response, {
        area, responseName: `${responseName}-${mediaTools.id}`,
        form, element, noLang
    });
    if (!!this.FormResolver.hasError) return
    let { Template } = this.FormResolver.getTemplate()
    if (Template) this.FormResolver
        .resetTemplate()
    this.FormResolver
        .setCategory(mediaTools)
        .setAssets(assets)
        .setStyles(styles)
    this.FormResolver
        .setTemplate()
        .RenderTemplate(renderToFormTool, { delay: 30 * 2 })
    this.setForm()
}

function setForm(inProcess, formOnly, assetType, layout, { localformtype, update }) {
    let scrollby = this.checkForScroll(this.query)
    let options = { formOnly, scrollby, delay: 30 * 2, layout, localformtype }
    let content = inProcess.getContent(assetType, update)
    return this.getFormResolver()
        .renderForm(this.galleryPermitionType, assetType, content, options)
}

export {
    setForm,
    setTools,
    getLayout,
    StylesTemplate,
    getArticleImages,
    getArticleGalleries
};

