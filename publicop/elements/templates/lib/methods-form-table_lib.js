"use strict";
import { html } from 'lit-html';
import { AssetEventFactory } from '../../util/classes/Asset_Event-class';
import { getLink } from "../../../js/urlQueryToObject";

export const MethodTypes = {
    warningYesNo({ methods, Property, method, resolver: { lang } }) {
        let { LayoutMethods } = methods[Property];
        return html`
            <div
                class="warning ${this.INFO.id}-methods-row-container methods-container-warning" 
                id=" ${this.INFO.id}-warning"
                origin="${methods[Property].origin}">
                <h5
                class="warning ${this.INFO.id}-methods-header methods-header-warning">
                    ${method[lang]}
                </h5>
                ${Object.keys(LayoutMethods)
                .map(layout => html`            
                    <paper-icon-button
                        class="${this.INFO.id}-methods-icon ${layout === LayoutMethods[layout].origin ? 'icon-active' : ''}"
                        title="${LayoutMethods[layout].title[lang]}"
                        name="${layout}"
                        origin="${layout}"
                        icon="${LayoutMethods[layout].icon}"  
                        @click="${evt => method.call(this, AssetEventFactory(evt, methods, {}, Property, methods[Property].origin))}">
                    </paper-icon-button>
                `)}
            </div>`;
    },
    warning({ method, resolver: { lang } }) {
        return html`
            <div
                class="${this.INFO.id}-methods-container warning" 
                id=" ${this.INFO.id}-warning"
                origin="${methods[Property].origin}">
                <h5>
                    ${method[lang]}
                </h5>
            </div>`;
    },
    rowMethods({ methods, Property, method, resolver: { lang } }) {
        let { LayoutMethods } = methods[Property];
        return html`
            <div
                class="${this.INFO.id}-methods-row-container ${this.INFO.id}-layouts-container"
                id="${methods[Property].method}-${methods[Property].origin}"
                title="${methods[Property][lang]}">
                ${Object.keys(LayoutMethods)
                .map(layout => html`            
                    <paper-icon-button
                        class="${this.INFO.id}-methods-icon ${layout === LayoutMethods[layout].origin ? 'icon-active' : ''}"
                        title="${LayoutMethods[layout].title[lang]}"
                        name="${layout}"
                        origin="${layout}"
                        icon="${LayoutMethods[layout].icon}"
                        @click="${evt => method.call(this, AssetEventFactory(evt, methods, { layout }, Property, methods[Property].origin))}">
                    </paper-icon-button>
                `)}
            </div>`; /**/
    },
    standart({ methods, Property, method, resolver: { scope, lang } }) {
        let { resolvedLink, category } = getLink.call(this, methods, Property);
        let Template = (resolvedLink, category) => html`
            <div
                class="${this.INFO.id}-methods-container"
                name="${methods[Property].origin}"
                origin="${methods[Property].origin}">
                    <div
                        class="${this.INFO.id}-methods-text"
                        name="${methods[Property].origin}"
                        origin="${methods[Property].origin}">
                        ${methods[Property][lang]}
                    </div>
                ${!!resolvedLink ? html`
                <a
                    id="${category.id}-anchor"
                    class="${this.INFO.id}-anchor ${category.id}-anchor"
                    href="${resolvedLink}">  
                    <paper-icon-button
                        class="${this.INFO.id}-methods-icon"
                        title="${methods[Property][this.lang]}"
                        name="${methods[Property].origin}"
                        origin="${methods[Property].origin}"
                        icon="${methods[Property].icon}"
                        @click="${evt => method.call(scope, AssetEventFactory(evt, methods, {}, Property, methods[Property].origin))}">
                    </paper-icon-button>
                </a>` : html` 
                    <paper-icon-button
                        class="${this.INFO.id}-methods-icon"
                        title="${methods[Property][this.lang]}"
                        name="${methods[Property].origin}"
                        origin="${methods[Property].origin}"
                        icon="${methods[Property].icon}"
                        @click="${evt => method.call(scope, AssetEventFactory(evt, methods, {}, Property, methods[Property].origin))}">
                    </paper-icon-button>`}  
            </div>`;
        return Template.call(this, resolvedLink, category);
    },
    listnerArea({ methods, Property, method, resolver: { lang } }) {
        let { resolvedLink, category } = getLink.call(this, methods, Property);
        let title = methods[Property].title ? methods[Property].title[this.lang] : methods[Property][this.lang];
        let Template = (resolvedLink, category) => html`
            <div
                class="${this.INFO.id}-methods-container methods-container"
                id="${methods[Property].id}"
                name="${methods[Property].origin}"
                origin="${methods[Property].origin}">
                <div
                    class="${this.INFO.id}-methods-text"
                    name="${methods[Property].origin}"
                    title="${title}"
                    origin="${methods[Property].origin}">
                        ${methods[Property][lang]}
                </div>
                ${!!resolvedLink ?
                html`
                    <a
                        id="${category.id}-anchor"
                        class="${this.INFO.id}-anchor ${category.id}-anchor"
                        href="${resolvedLink}">                   
                        <paper-icon-button
                            class="${this.INFO.id}-methods-icon"
                            title="${title}"
                            name="${methods[Property].origin}"
                            origin="${methods[Property].origin}"
                            icon="${methods[Property].icon}"
                            @click="${evt => method.call(this, AssetEventFactory(evt, methods, { origin: methods[Property].origin }, Property, methods[Property].origin))}">
                        </paper-icon-button>
                    </a>` :
                html`                   
                    <paper-icon-button
                        class="${this.INFO.id}-methods-icon"
                        name="${methods[Property].origin}"
                        title="${title}"
                        origin="${methods[Property].origin}"
                        icon="${methods[Property].icon}"
                        @click="${evt => method.call(this, AssetEventFactory(evt, methods, { origin: methods[Property].origin }, Property, methods[Property].origin))}">
                    </paper-icon-button>`}                 
            </div>`; /*  */
        return Template.call(this, resolvedLink, category);
    }
};
