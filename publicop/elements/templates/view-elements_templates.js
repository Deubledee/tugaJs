import { html } from 'lit-html';

const templateObject = {
    'home': function (areaName, InfoData) {
        return html`
                <app-home-page
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}" 
                    .areas="${InfoData.areas}" 
                    id="${areaName}"
                    .lang="${this.lang}">
                </app-home-page>`},
    'blog': function (areaName, InfoData) {
        return html`
                <app-blog-page
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}" 
                    .layout="${InfoData.areas.layout}"
                    .areas="${InfoData.areas}"
                    id="${areaName}"
                    .lang="${this.lang}">
                </app-blog-page>`},
    'blog-article': function (areaName, InfoData) {
        return html`
                <app-blog-article
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}" 
                    .areas="${InfoData.areas}"
                    .layout="${InfoData.areas.layout}" 
                    .lang="${this.lang}" 
                    id="${areaName}"
                    aria-label="${areaName}-area"
                    class="${areaName}">
                </app-blog-article>`},
    'blog-users': function (areaName, InfoData) {
        return html`
                <app-blog-users
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}"
                    .areas="${InfoData.areas}"
                    .layout="${InfoData.areas.layout}" 
                    .lang="${this.lang}" 
                    id="${areaName}" 
                    aria-label="${areaName}-area"
                    class="${areaName}">
                </app-blog-users>`},
    'blog-subjects': function (areaName, InfoData) {
        return html`
                <app-blog-subjects
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}"
                    .areas="${InfoData.areas}"
                    .layout="${InfoData.areas.layout}"
                    .lang="${this.lang}"
                    id="${areaName}" 
                    aria-label="${areaName}-area"
                    class="${areaName}">-
                </app-blog-subjects>`},
    'articles-form': function (InfoData) {
        return (statusMethod, defaultCancel) => html`
                <app-articles-form
                    id="${InfoData.id}"
                    aria-label="${InfoData.id}-popup"
                    class="${InfoData.id}-popup"
                    .type="${InfoData.type}" 
                    .lang="${this.lang}"
                    .edit=${this.edit}
                    .layout="${InfoData.areas.layout}"
                    .statusmethod=${statusMethod} 
                    .defaultcancel=${defaultCancel}
                    .areas="${InfoData.areas}"
                    .INFO="${InfoData}">
                </app-articles-form>`},
    'blog-social': function (areaName, InfoData) {
        return html`
                <app-blog-social
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}" 
                    .areas="${InfoData.areas}"
                    .layout="${InfoData.areas.layout}"
                    id="${areaName}" 
                    aria-label="${areaName}-area"
                    class="${areaName}"
                    slot="${areaName}">
                </app-blog-social>`
    },
    'user': function (areaName, InfoData) {
        return html`
                <app-user-profile
                    .INFO="${InfoData}" 
                    .type="${InfoData.type}" 
                    .areas="${InfoData.areas}"
                    .layout="${InfoData.areas.layout}"
                    .lang="${this.lang}"
                    id="${areaName}" 
                    aria-label="${areaName}-area"
                    class="${areaName}">
                </app-user-profile>`},
    'galleries': function (data) {
        let { INFO, lang, category } = data
        return html`
                <app-gallery-page
                    id="${INFO.id}" 
                    aria-label="${INFO.id}-popup"
                    class="${INFO.id}-popup"
                    .INFO="${INFO}" 
                    .areas="${INFO.areas}" 
                    .type="${INFO.type}" 
                    .requestcategory="${category}" 
                    .layout="${INFO.areas.layout}"
                    .lang="${lang}" 
                    .statusmethod=${this._statusMethod.bind(this)} 
                    .defaultcancel=${this.defaultCancel.bind(this)}>
                </app-gallery-page>`}
}

export function getViewTemplate(data) {
    if (data in templateObject) return templateObject[data]
}
