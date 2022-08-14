import '@polymer/polymer/polymer-legacy.js';
import { html, render } from "lit-html";
import { setToolbar } from '../../templates/toolbar_templates'
import { defaultFormCallback } from '../libs/user-profile-form_lib';
export const Methods = {
    setUserRole({ model }) {
        this.role = model.__data.item
    },
    saveUserProfile() {
        this.save = true;
        this.submit()
        this.save = false;
    },
    submit() {
        let articlesForm = document.querySelector("#user-form")
        !!articlesForm.validate() && articlesForm.submit() && !!this.statusmethod && this.statusmethod()
    },
    getUserProfileForm() {
        let allow = true
        let { methods } = this.areas.tools
        const mainTemplate = (formKeys, form) => html`
            <app-free-tool-article id="free-tool-article" class="subject-article-tool" .category=${this.category}
                .content=${this.areas.tools} .lang="${this.lang}" .article="${this.toolarticle}" .hidemethods=${!this.edit} required
                showname showform>
                <nav class="assets-nav">
                    ${Object.keys(methods).map(methodKey => html`
                    <div class="assets-container">
                        <div style="padding-block-start: 9px;font-size: 15px;letter-spacing: 1.2px;font-weight: bold;">
                            ${methods[methodKey][this.lang]}
                        </div>
                        <paper-icon-button @click="${this[methods[methodKey].method].bind(this)}" icon="${methods[methodKey].icon}">
                        </paper-icon-button>
                    </div>`)}
                </nav>
                <div slot="type" id="free-tool-type-slot"></div>
                <div slot="description" id="free-tool-description-slot"></div>
                <div slot="form">
                    <iron-form id="user-profile-form" class="user-profile-iform"
                        @iron-form-submit="${defaultFormCallback.bind(this)}" 
                        .allow-redirect="${allow}">
                        <form class="user-profile-form">
                            ${formKeys.map(section => {
            let item = { [section]: "" }
            return (form[section].type === 'textarea' || form[section].type.includes('input')) ? html`           
                            <app-textarea class="articles-form-tool"
                                .toolbartype="${form[section].toolbar}"
                                .toolbar="${setToolbar.call(this, form[section].toolbar, [])}"
                                .validmessage="${this.areas.tools.warnings[this.lang]}" 
                                .edit="${this.edit}"
                                .category=${this.category} 
                                .valuetype="${form[section]["value-type"]}"
                                .type="add-subjects-tool-${section}"
                                .label="${form[section].langs[this.lang]}" 
                                .item="${item}" 
                                name="${form[section].name}"
                                required>
                            </app-textarea>`: ''
        })}
                        </form>
                    </iron-form>
                </div>
            </app-free-tool-article>`
        render(mainTemplate.call(this, this.formkeys, this.form), this)
    }
}
