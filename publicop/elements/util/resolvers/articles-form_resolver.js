import { ContentCacheResolve, checkIsCachedResponse } from '../cacheStates&Listners/contentCache';
import { getLayout, StylesTemplate, setTools } from './app_default_resolvers';

function getArticleForm(response, formTools) {
    let IsCached = checkIsCachedResponse(response)
    let category = !!IsCached ? IsCached.category : formTools
    let { id: area, element, responseName, noLang, form, includeAssets: { styles } } = category.areaInfo
    //responseName = `${responseName}-${area}-${this.getEditState().EditType}`
    let [{ renderToFormTool }, lang] = [this.ElementsTorender, this.getLangState()]
    this.FormResolver = ContentCacheResolve(this, response, {
        area, responseName, category, element, form, noLang, stylesCategory: this.INFO
    })
    if (!!this.FormResolver.hasError) return
    let { Template } = this.FormResolver.getTemplate()
    if (Template) this.FormResolver
        .resetTemplate()
    this.FormResolver
        .setCategory(category)
        .setAssets([this.getEditState().EditType])
        .setLang(lang)
        .setTemplate()
        .setStyles(styles)
    this.FormResolver
        .RenderTemplate(renderToFormTool, { delay: 30 * 2 })
    this.setForm()/**/
}

async function setForm(inProcess, lang, options) {
    let { articletype } = this.query
    let { EditType } = this.getEditState()
    let content = inProcess.getContent(lang)
    this.getFormResolver().renderForm(articletype, EditType, content, options)
    return inProcess
}

export {
    setForm,
    setTools,
    getLayout,
    getArticleForm,
    StylesTemplate
};
