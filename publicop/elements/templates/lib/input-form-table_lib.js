"use strict";
import { html } from 'lit-html';
import { setHrefs } from "../../../js/urlQueryToObject";
import { AssetEventFactory } from '../../util/classes/Asset_Event-class';
import { setToolbar } from '../toolbar_templates';

export const inputTypes = {
    toolSearch({ method, property, formTable, formData, resolver: { lang }, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
            <app-search-input
                id="${formTable.id}"
                role="search"
                tabindex="${index}" 
                class="${formTable.classList.search} form-tab-${layout}"
                name="${formData[property]}" 
                origin="${formTable.origin}"
                type="search"
                slot="${formTable.slot}"                
                @click=${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}>
                <iron-icon
                    slot="prefix"
                    id="${formTable.id}-iron-icon"
                    name="${formData[property]}"
                    origin="${formTable.origin}"
                    icon="${formData.icon}">
                </iron-icon>
                <aside
                    slot="suffix"
                    id="${formTable.id}-aside"
                    class="${formTable.classList.aside}"
                    name="${formData[property]}" 
                    origin="${formTable.origin}">
                    ${formData.langs[lang]} blog 
                </aside>
            </app-search-input>` : '';
    },
    toolTabReact({ method, property, formTable, formData, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ?
            html`
                <tool-tab-react
                    id="${formData.id}"
                    role="link"
                    tabindex="${index}"
                    class="${formTable.classList.tab} form-tab-${layout}"
                    title="${formData[property]}"
                    slot="${formTable.slot}" 
                    name="${formData[property]}" 
                    .origin="${formData.id}" 
                    .sethref="${formTable.link ?
                    this[setHrefs.call(this, this.query, formData, formTable.link)] : false}"
                    .formtable="${formTable}"
                    .formdata="${formData}"
                    .method=${((evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))).bind(this)}>
                </tool-tab-react>` : '';
    },
    toolTabLink({ method, property, formTable, formData, layout, resolver: { lang, category } }, index) {
        formData.index = index;
        let Category = formData.areas ? formData : category;
        let message = formData.langs ? formData.langs[lang] : formData[property];
        let updateClass = this.getUpdateState && this.getUpdateState();
        let template = !formTable.layouts || !!~formTable.layouts.indexOf(layout) ?
            html`
            <paper-tab
                id="${formData.id}"
                role="link"
                tabindex="${index}"
                class="${formTable.classList.tab} ${formData[property]}-tab
                ${formData[property]}${updateClass ? '-update' : ''} form-tab-${layout}"             
                title="${formData[property]}"
                slot="${formTable.slot}" 
                name="${formData[property]}" 
                origin="${formTable.origin}"
                @click=${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}>  
                <a
                    id="${formTable.id}-anchor"
                    class="${formTable.classList.anchor} ${formData[property]}-anchor"
                    href="${this[setHrefs.call(this, this.query, Category, formTable.link, message)]}">
                    <iron-icon
                        class="${formTable.classList.aside} ${formData[property]}-icon"
                        icon="${formData.icon}">
                    </iron-icon>
                    ${message}
                </a>
            </paper-tab>` : '';
        return template;
    },
    toolTabLinkNoIcon({ method, property, formTable, formData, resolver: { lang, category }, layout }, index) {
        formData.index = index;
        let Category = formData.areas ? formData : category;
        let message = formData.langs ? formData.langs[lang] : formData[property];
        let linkFormData = formTable.noFormDataProperty ? formData : message;
        let updateClass = this.getUpdateState && this.getUpdateState();
        let template = !formTable.layouts || !!~formTable.layouts.indexOf(layout) ?
            html`<paper-tab
                id="${formData.id}"
                role="link"
                tabindex="${index}"
                class="${formTable.classList.tab} ${formData[property]}-tab ${formData[property]}${updateClass ? '-update' : ''} form-tab-${layout}"             
                title="${formData[property]}"
                slot="${formTable.slot}" 
                name="${formData[property]}" 
                origin="${formTable.origin}"
                @click=${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}>  
            <a
                id="${formTable.id}-anchor"
                class="${formTable.classList.anchor} ${formData[property]}-anchor"
                href="${this[setHrefs.call(this, this.query, Category, formTable.link, linkFormData)]}">              
                ${message}
            </a>
        </paper-tab>` : '';
        return template;
    },
    toolTab({ method, property, formTable, formData, resolver: { lang }, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
                <paper-tab
                    role="checkbox"
                    id="${formData.id}-${formData[property]}"
                    role="tab"
                    tabindex="${index}"
                    class="${formTable.classList.tab} form-tab-${layout}"
                    title="${formData[property]}" 
                    name="${formData[property]}" 
                    origin="${formTable.origin}"
                    slot="${formTable.slot}" 
                    @click=${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}>                   
                    <aside
                        id="${formData.id}-aside"
                        class="${formTable.classList.aside}">
                        <iron-icon
                            id="${formData.id}-iron-icon"
                            icon="${formData.icon}"
                            name="${formData.langs[lang]}" 
                            title="${formData.langs[lang]}">
                        </iron-icon>    
                        <span id="${formData.id}-span">
                            ${formData.langs[lang]}
                        </span>
                    </aside>
                </paper-tab>` : '';
    },
    appArticleMenu({ method, formTable, formData, property, resolver: { lang, category }, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
        <app-article-menu
            horizontal-align="${formTable.halign}"
            vertical-align="${formTable.valign}"
            required
            showlabel
            notintoolbar
            id="${formTable.property}-article-menu"
            role="menu"
            tabindex="${index}"
            class="${formTable.classList.element} form-tab-${layout}"
            name="${formTable.property}" 
            origin="${formTable.origin}"                                        
            .category="${category}"
            .item=${{ formTable, formData }}
            .itemlabel="${formTable[lang]}"
            .items="${formTable.menu}" 
            .setvaluecallback="${({ event, value }) => method.call(this, AssetEventFactory(event, formTable, { value, data: formData }, property, methods[Property].origin))}">
            <div
                slot="label"
                class="lang-menu-label"
                id="${formTable.property}-div">
                ${formTable[lang]}
            </div>
        </app-article-menu>` : '';
    },
    appMenu({ method, formTable, formData, property, resolver: { lang, category }, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
        <app-menu
            horizontal-align="${formTable.halign}"
            vertical-align="${formTable.valign}"
            required
            showlabel
            notintoolbar
            id="${formTable.id}"
            role="menu"
            tabindex="${index}"
            class="${formTable.classList.element} form-tab-${layout}"
            name="${formTable.property}" 
            origin="${formTable.origin}"                                        
            .category="${category}"
            .item=${{ formTable, formData }}
            .itemlabel="${formTable[lang]}"
            .items="${formTable.menu}" 
            .setvaluecallback="${({ event, value }) => method.call(this, AssetEventFactory(event, formTable, { value, data: formData }, property, formTable.origin))}">
            <div
                slot="label"
                class="lang-menu-label"
                id="${formTable.property}-div">
                ${formTable[lang]}
            </div>
        </app-menu>` : '';
    },
    langMenu({ method, formTable, formData, property, resolver: { lang, category }, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
                <app-lang-menu
                    required
                    showlabel
                    notintoolbar
                    id="${formTable.id}"
                    role="menu"
                    tabindex="${index}"
                    class="${formTable.classList.element} form-tab-${layout}"
                    name="${formTable.property}" 
                    origin="${formTable.origin}"
                    value="${this.articlelang || lang}"                    
                    .category="${category}"
                    .item="${this.articlelang || lang}"
                    .itemlabel="${!this.editype === 'edit' ? '' : formTable[lang]}"
                    .items="${formTable.langs}" 
                    .setvaluecallback="${({ event, value }) => method.call(this, AssetEventFactory(event, formTable, { value, data: formData }, property, methods[Property].origin))}">
                    <div  
                        slot="label"
                        class="lang-menu-label"
                        id="${formTable.property}-div">
                            ${formTable[lang]}
                    </div>
                </app-lang-menu>` : '';
    },
    imageUploader({ property, formTable, formData, resolver: { lang, category }, layout }, index) {
        formData.index = index;
        return html`                
                <app-image-uploader
                    id="${formTable.id}"
                    role="img"
                    tabindex="${index}"
                    name="${property}" 
                    class="form-tab-${layout}"
                    origin="${formTable.origin}"
                    .category="${category}"
                    .type="${property}"
                    .placeholder="${formTable[lang]}"
                    .valuetype="${property}"
                    ._category="${category}"
                    .imageproperty="${property}" 
                    .edit="${formData}"
                    .lang="${lang}">
                </app-image-uploader>`;
    },
    _image({ method, property, formTable, formData, resolver: { lang, category }, layout }, index) {
        let SRC = formTable.imagesArray ? formData[formTable.arrayName][0][property] : formData[property];
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`                
            <paper-tab
                id="${formTable.id}-paper-tab"
                tabindex="${index}"
                role="tab"
                draggable
                class="${formTable.classList.tab} form-tab-${layout}"
                name="${formData[formTable.nameProperty]}" 
                origin="${formTable.origin}"
                value="${formTable.nameProperty}"
                alt="${formTable[lang]} ${formData[formTable.nameProperty]} ${formTable.alt}">
                <app-image
                    class="${formTable.classList.image}"
                    title="${formTable[lang]}" 
                    name="${formData[formTable.nameProperty]}"                          
                    alt="${formTable.alt}"                          
                    origin="${formTable.origin}"                            
                    src="${SRC}"                    
                    .category="${category}"
                    .nameproperty="${formTable.nameProperty}"
                    .dragg="${formTable.draggable}"
                    .src="${SRC}"
                    .value="${SRC}"
                    @click="${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}">                        
                </app-image>
            </paper-tab>`
            : '';
    },
    image({ method, property, formTable, formData, resolver: { lang, category }, layout }, index) {
        let SRC = formTable.imagesArray ? formData[formTable.arrayName][0][property] : formData[property];
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`                
            <paper-tab
                id="${formTable.id}-paper-tab"
                tabindex="${index}"
                role="tab"
                draggable
                class="form-tab-${layout} ${formTable.classList.tab} "
                name="${formData[formTable.nameProperty]}" 
                origin="${formTable.origin}"
                value="${formTable.nameProperty}"
                alt="${formTable[lang]} ${formData[formTable.nameProperty]} ${formTable.alt}">
                <app-image
                    class="${formTable.classList.image}"
                    title="${formData[formTable.nameProperty]}" 
                    name="${formData[formTable.nameProperty]}"                                           
                    origin="${formTable.origin}"                            
                    .imagesrc="${SRC}"                            
                    .imagealt="${formData[formTable.nameProperty]}_${formTable.alt}" 
                    .category="${category}"
                    .nameproperty="${formTable.nameProperty}"
                    .dragg="${formTable.draggable}"
                    .src="${SRC}"
                    .value="${SRC}"
                    @click="${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}">                        
                </app-image>
            </paper-tab>`
            : '';
    },
    checkbox({ method, property, formTable, formData, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
            <paper-tab
                id="${formTable.id}-paper-tab"
                role="tab"
                tabindex="${index}"
                class="${formTable.classList.tab} form-tab-${layout}">
                <paper-checkbox
                    role="checkbox"
                    id="${formTable.id}"
                    class="${formTable.classList.checkbox}"
                    title="${formData[property]}"
                    name="${formData[property]}" 
                    origin="${formTable.origin}"
                    value="${JSON.stringify(formData)}"
                    @click="${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}">
                </paper-checkbox>
            </paper-tab>` : '';
    },
    textarea({ property, formTable, formData, resolver: { lang }, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
            <app-textarea
                id="${property}-textarea"
                role="textbox"
                tabindex="${index}"
                required
                value="${formData[property]}"
                class="${formTable.classList.div} form-tab-${layout}"
                title="${property}"
                name="${property}" 
                origin="${formTable.origin}"                    
                .item="${formData}"
                .edit="${formData}"
                .category=${this.INFO} 
                .encoding="${formTable.encoding}"
                .type="${formTable.property}"
                .valuetype="${formTable["value-type"]}"
                .toolbartype="${formTable.toolbar}"
                .toolbar="${setToolbar.call(this, formTable.toolbar, [])}"                    
                .label="${formTable[lang]}">
            </app-textarea>` : '';
    },
    tab({ method, property, formTable, formData, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
            <paper-tab
                id="${formTable.id}"
                tabindex="${index}"
                role="tab"
                class="${formTable.classList.tab} form-tab-${layout}"
                name="${formData[property]}"
                title="${formData[property]}" 
                origin="${formTable.origin}"
                value="${formTable.origin}"
                draggable
                @click=${(evt) => method.call(this, AssetEventFactory(evt, formTable, formData, property, formTable.origin))}>
                <aside                        
                    id="${formTable.id}-aside"
                    class="${formTable.classList.aside}"
                    name="${formData[property]}"
                    title="${formData[property]}" 
                    origin="${formTable.origin}">
                    ${formData[property]}
                </aside>
            </paper-tab>` : ''; /**/
    },
    div({ property, formTable, formData, layout }, index) {
        formData.index = index;
        return !formTable.layouts || !!~formTable.layouts.indexOf(layout) ? html`
            <div
                id="${formTable.id}"
                tabindex="${index}"
                role="tab"
                class="${formTable.classList.div} form-tab-${layout}"
                title="${formData[property]}"
                name="${formData[property]}" 
                origin="${formTable.origin}">
                ${formData[property]}
            </div>` : '';
    }
};
