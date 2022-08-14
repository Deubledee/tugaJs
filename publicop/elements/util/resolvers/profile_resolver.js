import { html, render } from 'lit-html';
import { getArticleHero, getLayout, StylesTemplate } from './app_default_resolvers';
import { setResponse, getInfoDataByProperty, createCategoryPropertyFrom } from '../../lib/methods'
import { getCredentials } from '../../../js/login_lib';
import { setStylesToInclude } from '../cacheStates&Listners/styles_to_include';

const formTypeObj = { "edit": undefined, "create": undefined }

function getArticleForm(formArticles) {
    if (!formArticles) return () => html``
    setResponse.call(this, formArticles, "getArticleForm")
    Object.keys(formTypeObj)
        .forEach(key => formTypeObj[key] = this.langs[this.lang].getArticleForm
            .find(formArticle => formArticle.id.includes(key)))
}

function setProfile(userProfile, formAreas) {
    let formType = !!this.edit ? 'edit' : 'create', allow = false
    let valueType = "value-type"
    let category = getInfoDataByProperty.call(this, 'form')
    createCategoryPropertyFrom.call(this, this.INFO, category)
    setStylesToInclude.call(this, this.category.id, 'imageUploader', this.category.rootStyles, this.category.rootDefaultStyles)
    if (!!userProfile) {
        let [{ UserRecord }, { lang, profile }] = [getCredentials(), this.query]
        const mainTemplate = (data, UserProfile) =>
            html`
            <div class="users-container-row">
                ${!!UserRecord.checkCredentials(category.permitions) && UserProfile.linkedAccounts.indexOf(UserRecord.uid) ?
                    html`
                <a class="edit-icon-anchor profile-edit-anchor"
                    href="/profile?type=user&view=${this.INFO.path}&inview=true&editprofile=${profile}&hasprofile=true&lang=${lang}">
                    <span>
                        ${data.articleName}
                    </span>
                    <paper-icon-button icon="icons:create">
                    </paper-icon-button>
                </a>` : ''}
            </div>
            <div class="user-active-row">
                <h1>${UserProfile.name}</h1>
                <h3>${getCredentials().UserRecord.role}
                </h3>
            </div>
            <div class="users-image users-image-row">
                <iron-form id="users-image-form" .allow-redirect="${allow}">
                    <form class="">
                        <div class="images-input-container">
                            <app-image-uploader
                                name="${formAreas.form.images.name}" 
                                .type="${formAreas.form.images.type}"
                                .placeholder="${formAreas.form.images.langs[this.lang]}"
                                .valuetype="${formAreas.form.images[valueType]}" 
                                ._category=${this.category}
                                .areas=${formAreas}
                                .imageproperty="${formAreas.form.images.name}" 
                                .edit="${this.edit}" .
                                lang="${this.lang}">
                            </app-image-uploader>
                        </div>
                    </form>
                </iron-form>
            </div>`
        render(mainTemplate(formTypeObj[formType], userProfile[0]), document.querySelector(`#${this.INFO.id}-tools`))/**/
    }
}
function getUserProfile(userProfile) {
    if (!!userProfile && !this.userProfile) this.userProfile = userProfile
    let category = getInfoDataByProperty.call(this, 'form')
    if (!!this.query.hasprofile && !this.query.editaccount) {
        this.editaccount = false
        this.edit = atob(this.query.profile).split('-')[1];
        sessionStorage[this.edit] = JSON.stringify(this.userProfile[0])
    }
    let formType = !!this.edit ? 'edit' : 'create'
    let { rootStyles, rootDefaultStyles } = this.INFO
    setStylesToInclude.call(this, category.id, 'toolArticle', rootStyles, rootDefaultStyles)
    setStylesToInclude.call(this, category.id, 'textArea', rootStyles, rootDefaultStyles)
    const mainTemplate = (content, formKeys) => html`    
                    <app-user-profile-form
                        id="free-tool-article-${content.id}" 
                        .editaccount=${!!this.editaccount} 
                        .category=${category}
                        .defaultcancel=${this.defaultCancel} 
                        .statusmethod=${this.statusMethod} 
                        .toolarticle=${content} 
                        .areas=${category.areas}
                        .form=${category.areas.form} 
                        .formkeys=${formKeys} 
                        .edit="${this.edit}" 
                        .lang="${this.lang}">
                    </app-user-profile-form>`
    setTimeout(() => {
        setProfile.call(this, userProfile, category.areas)
        render(mainTemplate(formTypeObj[formType], Object.keys(category.areas.form)), this.querySelector(`#user-profile`))
    }, 500);/**/
}
export { getLayout, StylesTemplate, getArticleForm, getUserProfile, getArticleHero };

