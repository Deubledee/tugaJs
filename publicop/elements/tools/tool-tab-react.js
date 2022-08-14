
import { html as litHtml, render } from 'lit-html';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { IronControlState } from '@polymer/iron-behaviors/iron-control-state.js';


export class toolTabReact extends mixinBehaviors([
    IronA11yAnnouncer,
    IronControlState], PolymerElement) {
    static get template() {
        return html`
         <style>
            :host {
                display: block;
            }
        </style>
        <app-location route="{{route}}"></app-location>
        <app-route route="{{route}}" pattern="/:item" data="{{routeData}}" query-params="{{query}}">
        </app-route>
        <div class="content-container">
            <slot name="reaction"></slot>            
        </div>`
    }
    static get is() {
        return 'tool-tab-react';
    }
    static get properties() {
        return {
            formtable: {
                type: Object,
                notify: true
            },
            formdata: {
                type: Object,
                notify: true
            },
            sethref: {
                type: String,
                notify: true,
                observer: 'setHref'
            }
        };
    }
    ready() {
        super.ready();
        window.addEventListener('react-to', this.reactTo.bind(this));
    }
    reactTo({ detail }) {
        let { reactTo, reaction } = detail
        if (!this[reaction]) return
        this[reaction]()
            .then(() => !!this.show && this.render(reactTo))
    }
    render(result) {
        let element = this.querySelector(`#${this.formtable.origin}`)
        let Template = (Result) => litHtml`
        ${this.Href ? litHtml`
                <a
                    id="${this.formtable.origin}-anchor"
                    class="${this.formtable.classList.tab}"
                    href="${this.Href || ''}">
                    <iron-icon
                        class="${this.formtable.classList.aside}"
                        icon="${this.formdata.icon}">
                    </iron-icon>
                    ${Result}
                </a>`:
                litHtml`<iron-icon
                    class="${this.formtable.classList.aside}"
                    icon="${this.formdata.icon}">
                </iron-icon>
                ${Result}`}`;
        render(Template(result), element);
    }
    async slotContent() {
        let Template = () => this.show ? litHtml`
                 <paper-tab
                     id="${this.formtable.origin}"
                     class="${this.formtable.classList.tab}"
                     slot="reaction">  
                 </paper-tab>`: litHtml``
        render(Template(), this)
        return
    }
    async hideSlot() {
        this.show = false
        this.slotContent()
        return
    }
    async showSlot() {
        this.show = true
        this.slotContent()
        return
    }
    setHref(Href) {
        if (!Href) return
        this.Href = Href
    }
}
customElements.define(toolTabReact.is, toolTabReact);
