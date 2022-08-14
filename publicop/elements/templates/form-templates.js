import { html } from 'lit-html';
import { getCredentials } from '../../js/login_lib';
import '../tools/app-tools-nav';
import { methodsTemplateResolve, formInputsResolve } from './form-table-templates';
import { ResolveElement } from './elements-template';

function methodsTemplate({ methods, listners, layout }, resolver, permitionType, article) {
    return html`
        ${!!this.showActiveFormTitle ? html`
        <div class="${this.INFO.id}-active-form">
            <h2> activeForm  </h2>
        </div>` : ''}
        <nav class="${this.INFO.id}-methods-nav ${resolver.category.id}-methods-nav">
        ${!!Object.keys(methods).length ?
            Object.keys(methods)
                .map(method => !!~methods[method].permitions[permitionType]
                    .indexOf(getCredentials().UserRecord.role) ?
                    (methodsTemplateResolve.call(this, methods[method].type, methods, method, listners, resolver) ||
                        formInputsResolve.call(this, methods[method].type, methods[method], article, {}, layout, resolver))
                    : '')
            : ``}
        </nav>`
}
function ironFormTemplate({ formTable, layout }, resolver, article) {
    let allow = true
    article = Array.isArray(article) ? article[0] : article
    return html`
    <iron-form
        id="${this.INFO.id}-popup-form"            
        .allow-redirect="${allow}">
        <form class="popup-form">           
            <div 
                overflow 
                class="${this.INFO.id}-assets-container ${resolver.assetType}-formtable-container">
                    ${Object.keys(article)
            .map((property, idx) => formTable[property] && html`
                <nav 
                    id="form-slot-asset-input-${resolver.assetType}-${idx}"
                    class="${formTable[property].classList.nav} ${this.INFO.id}-${formTable[property].classList.nav} ${this.INFO.id}-asset-nav asset-nav asset-input-nav">                        
                    ${formInputsResolve.call(this, formTable[property].type, formTable[property], article, {}, layout, resolver)}                       
                </nav>`)}                
            </div >
        </form >
    </iron-form>`
}
function checkListFormTemplate({ formTable, Display, listners, layout }, resolver, articles) {
    articles = Array.isArray(articles) ? articles : [articles]
    return html`
        ${!!formTable && (!!Display && !!Display[layout].hasAssets)
            ? html`
            <nav 
                id="form-slot-asset-nav-${resolver.assetType}"
                class="asset-nav asset-nav-${resolver.assetType} ${this.INFO.id}-table-nav asset-table-nav">
                ${!!formTable ? Object.keys(formTable)
                    .map(asset => html`
                <paper-tab
                    title="${formTable[asset][this.lang]}" 
                    name="${formTable[asset][this.lang]}" 
                    class="assets-tab">
                    ${formTable[asset][this.lang]}
                </paper-tab>`) : ''}
            </nav>`
            : ``}
        <div
            overflow
            class="${this.INFO.id}-container ${resolver.assetType}-formtable-container asset-input-container-${layout}">
            ${articles
            .map((article, idx) => html`        
            <nav 
                id="form-slot-asset-input-${resolver.assetType}-${idx}"
                class="form-slot-${resolver.category.id} ${this.INFO.id}-asset-nav asset-input-nav asset-input-nav-${layout} ${this.INFO.id}-asset-checkList-nav checkList-nav-${resolver.assetType}">
                ${Object.keys(formTable)
                    .map(asset =>
                        formInputsResolve.call(this, formTable[asset].type, formTable[asset], article, listners, layout, resolver, idx))}
            </nav>`)}
        </div> `
}
function previewFormTemplate({ formTable, listners, layout }, resolver, articles) {
    let Articles = Array.isArray(articles) ? articles : [articles]
    let Options = { Articles }
    return html`
    <div
        overflow
        class="${this.INFO.id}-container ${resolver.assetType}-formtable-container asset-input-container-${layout}">        
        <nav 
            id="form-slot-asset-input-preview"
            class="${this.INFO.id}-asset-nav
                ${this.INFO.id}-asset-preview-nav
                asset-input-nav-${layout} asset-input-nav">
        ${Object.keys(formTable)
            .map((asset, idx) => formTable[asset].elementType === 'formInput' ?
                formInputsResolve.call(this, formTable[asset].type, formTable[asset], Articles[0], listners, layout, resolver, idx) :
                ResolveElement.call(resolver, formTable[asset].type, Options)())}
        </nav>
    </div> `
}

export {
    checkListFormTemplate, ironFormTemplate,
    methodsTemplate, previewFormTemplate
};
