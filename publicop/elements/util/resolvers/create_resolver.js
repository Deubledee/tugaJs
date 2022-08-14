import { html, render } from 'lit-html';
import { getArticleHero, getLayout, StylesTemplate } from './app_default_resolvers'
import { getInfoDataByProperty, setResponse } from '../../lib/methods'
import { getCredentials } from '../../../js/login_lib'
import { setStylesToInclude } from '../cacheStates&Listners/styles_to_include';

const getArticleForm = function (event) {
    setResponse.call(this, event, "getArticleForm")
    let category = getInfoDataByProperty.call(this, 'form')
    let areas = JSON.parse(category.areas)
    let formIndex = this.langs[this.lang].getArticleForm.findIndex(form => form.id.includes(this.routeData.page2))
    setStylesToInclude.call(this, category.id, 'toolArticle', this.INFO.rootStyles, this.INFO.rootDefaultStyles)
    const mainTemplate = (article, areas) =>
        !!getCredentials().UserRecord.checkCredentials(category.permitions) ||
            (this.edit && getCredentials().UserRecord.checkIfIsAuthor(JSON.parse(sessionStorage[this.edit]))) ?
            html`<app-free-tool-article 
                    required
                    showname
                    showform
                    id="free-tool-article-${article.id}" 
                    class="${areas.assets.type}" 
                    .category="${category}"
                    .lang="${this.lang}" 
                    .article="${article}">
                    <nav class="assets-nav">
                        ${areas.assets.tools.map(tool => html`
                        <div class="assets-container">
                            <div style="padding-block-start: 9px;font-size: 15px;letter-spacing: 1.2px;font-weight: bold;">
                                ${tool[this.lang]}
                            </div>
                            <paper-icon-button
                                @click="${this[tool.method].bind(this)}" 
                                class="submit"
                                icon="${tool.icon}">
                            </paper-icon-button>
                        </div>`)}
                    </nav>
                    <div slot="type" id="free-tool-type-slot" class=""></div>
                    <div slot="description" id="free-tool-description-slot" class=""></div>
                    <div slot="form">
                        <app-blog-form
                            id="form-article-${article.id}" 
                            .lang="${this.lang}" 
                            .subjects="${this.tools}"
                            .category="${category}" 
                            .edit="${this.edit}" 
                            .areas="${areas}">
                        </app-blog-form>
                    </div>
                </app-free-tool-article>`: ''
    setTimeout(() => {
        render(mainTemplate(this.langs[this.lang].getArticleForm[formIndex], areas), document.querySelector(`#${this.INFO.id}-form`))
    }, 250);
}
export { getArticleHero, getArticleForm, getLayout, StylesTemplate }
