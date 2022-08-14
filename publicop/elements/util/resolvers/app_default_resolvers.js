import { resetAppStyles, StylesTemplate } from '../../lib/app-styles-setter';
import { sortCategoryViewTypes } from '../../lib/methods';
import { getViewTemplate } from '../../templates/view-elements_templates';
import { SetHeader } from '../../templates/lib/page-template_lib';
import { ContentCacheResolve, checkIsCachedResponse } from '../cacheStates&Listners/contentCache';
import { getLayout } from './page_resolver';

function setTools({ form }) {
    let order = sortCategoryViewTypes.call(this, 'tools')
    let [tools] = Array.from(document.querySelectorAll(`#${this.INFO.id}-tools`))
    let responseName = `${this.INFO.id}-setTools`
    this.ToolsResolver = ContentCacheResolve(this, order, {
        area: 'tools', responseName, form,
        element: 'toolsNav', stylesCategory: this.INFO
    })
    if (!!this.ToolsResolver.hasError || !this.ToolsResolver)
        return console.log(responseName, form, this.ToolsResolver);
    this.ToolsResolver
        .setCategory(this.INFO)
        .setStyles()
        .setTemplate({})
        .RenderTemplate(tools, {})
}

function getArticleHero(response) {
    let IsCached = checkIsCachedResponse(response)
    let hero = document.querySelector(`#hero`)
    let Resolver = ContentCacheResolve(this, response, {
        area: 'hero', responseName: 'getArticleHero',
        element: 'hero', stylesCategory: this.INFO
    })
    if (!IsCached) Resolver.setDefaultResolve()
    SetHeader.call(this, Resolver.content)
    Resolver.RenderTemplate(hero)
}

async function getFormTemplate(tempSecret, formCategory) {
    let Aproved = {}
    let aproved = this._CheckSecret(tempSecret, Aproved)
    if (!aproved) throw { error: 'not aproved!!' }
    let template = getViewTemplate.call(this, formCategory.areas.templateName)
    return { aproved: Aproved, Template: template.call(this, formCategory) }
}

export {
    getFormTemplate,
    getArticleHero,
    StylesTemplate,
    resetAppStyles,
    getLayout, sortCategoryViewTypes,
    setTools, SetHeader
};
