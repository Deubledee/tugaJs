import '@polymer/paper-spinner/paper-spinner';
import { html, PolymerElement } from '@polymer/polymer';
import '@polymer/polymer/polymer-legacy.js';


export class appSpinner extends PolymerElement {
    static get template() {
        return html`
        <style>

            :host {
                display: block;
            }

            main {
                display: block;
                color: var(--paper-deep-orange-a100);
            }

            main, aside, paper-spinner.redshift {
                z-index: 120;
            }

            aside {
                display: block;
                position: relative;
                top: -48px;
                font-size: 17px;
                font-weight: bold;
            }
            
            paper-spinner.redshift {
                height: 60px;
                width: 60px;
            }
            
            paper-spinner.redshift {
                --paper-spinner-layer-2-color: var(--google-blue-300);
                --paper-spinner-layer-3-color: var(--google-yellow-300);
                --paper-spinner-layer-4-color: var(--google-blue-500);
                --paper-spinner-layer-1-color: var(--paper-yellow-900);
                --paper-spinner-stroke-width: 10px;
            }        

            main[spninerout], h2[spninerout], paper-spinner[spninerout] {
                z-index: 0!important;
            }
            
            aside[spninerout]{
                display: none
            }

        </style>

        <main spninerout$="[[!active]]">
            <paper-spinner class="redshift" active="[[active]]" spninerout$="[[!active]]">
            </paper-spinner>
            <aside spninerout$="[[!active]]"> [[message]] </aside>
        </main>
        `
    }

    static get is() { return 'app-spinner' }

    static get properties() {
        return {
            message: {
                type: String,
                value: 'loading',
            },
            active: {
                type: Boolean,
                reflectToAttribute: true,
                observer: 'toggleZindex'
            },
            spninerout: {
                type: String,
                reflectToAttribute: true
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }

    ready() {
        super.ready();
        this._spinner = this.shadowRoot.querySelector('paper-spinner')
    }
    toggleZindex(active) {
        this.style.zIndex = active ? 120 : 0
    }
}

customElements.define(appSpinner.is, appSpinner);
