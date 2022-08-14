
import { html } from 'lit';
import { getCredentials } from '../../js/login_lib';
import { formInputsResolve } from './form-table-templates';

const ElementsTypes = {
    heroTemplate({ content, category, responseName }) {
        /* let { formCategoryId } = category.areas.tools
         let { permitions } = category.areas.tools[formCategoryId]
         let { UserRecord } = getCredentials()
            .setedit=${method.bind(this)}
            .edit=${UserRecord.checkCredentials(permitions, data)}*/
        return () => html`
        <app-hero-article
            id="hero-article-${content[0].id}" 
            .category="${category}" 
            .content="${this.areas.hero}"
            .lang="${this.lang}" 
            .article="${content[0]}"
            .cachekey="${responseName}">
        </app-hero-article>`
    },
    aboutTemplate({ content, category, responseName }) {

        /*  let { formCategoryId } = category.areas.tools
          let { permitions } = category.areas.tools[formCategoryId]
          let { UserRecord } = getCredentials()
            .setedit=${method.bind(this)}
            .edit=${UserRecord.checkCredentials(permitions, data)}*/
        return () => html`
        ${content.map((data) => html`  
        <app-about-article
            id="about-article-${data.id}" 
            class="${this.areas.about.asc}"
            .show="${category.areaInfo.show}"
            .category="${category}"
            .content="${this.areas.about}" 
            .lang="${this.lang}" 
            .cachekey="${responseName}"
            .article="${data}">
        </app-about-article>`)} `
    },
    servicesTemplate({ content, category, responseName }) {
        /* let { formCategoryId } = category.areas.tools
         let { permitions } = category.areas.tools[formCategoryId]
         let { UserRecord } = getCredentials()
            .setedit=${method.bind(this)}
            .edit=${UserRecord.checkCredentials(permitions, data)}*/
        return () => html`${content
            .map((data, idx) => html`
        <app-services-article
            id="services-article-${data.id}" 
            class="${this.areas.services.asc}" 
            .show="${category.areaInfo.show}"
            .category="${category}"
            .content="${this.areas.services}" 
            .lang="${this.lang}" 
            .cachekey="${responseName}"
            .index="${idx + 1}" 
            .article="${data}">
        </app-services-article>`)} `
    },
    contactsTemplate({ content, category, responseName }) {
        /* let { formCategoryId } = category.areas.tools
         let { permitions } = category.areas.tools[formCategoryId]
         let { UserRecord } = getCredentials()
            .setedit=${method.bind(this)}
            .edit=${UserRecord.checkCredentials(permitions, data)}*/
        return () => html`                                
        <app-contacts
            id="contacts-articles-${content.id}" 
            class="${this.areas.contacts.asc}"
            .show="${category.areaInfo.show}"
            .category="${category}" 
            .content="${this.areas.contacts}"
            .lang="${this.lang}" 
            .cachekey="${responseName}"
            .articles="${content}">
        </app-contacts>`
    },
    listArticleTemplate({ content, category }) {
        let previous = category.areas && category.areas.previous || false
        return () => html`${content
            .map((data) => html`
        <app-blog-list-article
            id="list-article-item-${data.id}" 
            .lang="${this.lang}"
            .article="${data}" 
            .previous=${previous}
            .category="${category}">
        </app-blog-list-article>`
            )}`
    },
    appArticleTemplate({ area, content, category, method, responseName }, { Articles }) {
        let { permitions } = category.areas[area]
        let { UserRecord } = getCredentials()
        content = !Articles ? content : Articles
        return () => html`${content
            .map((data) => html`
            <app-preview-article
                id="list-article-item-${data.id}" 
                .lang="${this.lang}"
                .cachekey="${responseName}"
                .article="${data}" 
                .category="${category}"
                .setedit=${method ? method.bind(this) : () => { }}
                .edit=${method ? UserRecord.checkCredentials(permitions, data) : false}>                
            </app-preview-article>`
            )}`
    },
    subjectsArticleTemplate({ area, content, category, method, responseName }) {
        let { permitions } = category.areas[area]
        let { UserRecord } = getCredentials()
        return () => html`${content
            .map(data => html`${checkDataPermitions(data, UserRecord) ? html`
                <app-blog-subjects-article
                    id="services-article-${data.id}" 
                    .lang="${this.lang}"
                    .cachekey="${responseName}"
                    .article="${data}"
                    .category="${category}" 
                    .content="${category.areas.subjects}"
                    .setedit=${method.bind(this)}
                    .edit=${UserRecord.checkCredentials(permitions)}>
                </app-blog-subjects-article>`
                : ''}`
            )}`
    },
    toolArticleTemplate({ scope, category, content }) {
        return () => html`     
        <app-free-tool-article show showname showform
            id="${scope.INFO.id}-free-tool-article"
            class="free-tool-article-${scope.INFO.id}"
            .category="${category}" 
            .lang="${this.lang}" 
            .article="${content[0]}">
            <nav id="${scope.INFO.id}-methods-slot"></nav>
            <div slot="type" id="${scope.INFO.id}-free-tool-type-slot"></div>
            <div slot="description" id="${scope.INFO.id}-free-tool-description-slot"></div>
            <div class="tool-form" slot="form" id="${scope.INFO.id}-slot"></div>
        </app-free-tool-article>`
    },
    toolsNavTemplate(resolver) {
        let { area, content, category } = resolver
        let { UserRecord } = getCredentials()
        let { assets } = category.areas[area]
        return () => html`
        <app-tools-nav
            .navlayout="${this.areas.tools.navlayout}"
            .category="${category}"
            id="${category.id}-tools-toolbar"
            role="tablist">
            ${content
                .map((data, index) => checkDataPermitions(data, UserRecord) ?
                    formInputsResolve.call(this,
                        assets[data.id].type,
                        assets[data.id], data, {}, assets[data.id].layout, resolver, index)
                    : '')} 
        </app-tools-nav>`
    },
    imageDropTemplate({ permitionType, category, responseName, formTable }) {
        let { UserRecord } = getCredentials()
        return () => checkDataPermitions(formTable.element, UserRecord, permitionType) ? html`
              <app-image-drop
                .cachekey="${responseName}"     
                .category="${category}"
                .gallerytype="${this.query.gallerytype}"
                .gallery="${this.query.gallery}"  
                .scope=${this}  
                .lang="${this.lang}"   
                .table="${formTable}">            
              </app-image-drop>`: ''
    }
}


function checkDataPermitions(data, UserRecord, permitionType) {
    let allViewPermitions = 'all users'
    let permitions = !!data.permitions && !permitionType ? data.permitions : data.permitions[permitionType]
    return getPermitions(permitions, allViewPermitions, UserRecord)
}
function getPermitions(permitions, allViewPermitions, UserRecord) {
    return !!~permitions.indexOf(allViewPermitions) || !!(UserRecord.checkCredentials(permitions))
}

function ResolveElement(TemplateName, { Articles }) {
    if (!!ElementsTypes[TemplateName])
        return ElementsTypes[TemplateName].call(this.scope, this, { Articles });

}

export { ResolveElement }
